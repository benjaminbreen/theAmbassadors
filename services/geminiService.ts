
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { FactCheckResult, NPC, CombatCard } from "../types";

// Safe initialization - key must be in process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- RATE LIMITER & CIRCUIT BREAKER ---
let lastCallTime = 0;
let circuitOpen = false;
let circuitResetTime = 0;
const MIN_CALL_INTERVAL = 2500; // ms
const CIRCUIT_COOLDOWN = 60000; // 60s

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const safeCall = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    if (!apiKey) return fallback;

    // 1. Circuit Breaker Check
    if (circuitOpen) {
        if (Date.now() > circuitResetTime) {
            circuitOpen = false;
        } else {
            console.warn("Circuit open - skipping AI call");
            return fallback;
        }
    }

    // 2. Rate Limiting
    const now = Date.now();
    const timeSinceLast = now - lastCallTime;
    if (timeSinceLast < MIN_CALL_INTERVAL) {
        await wait(MIN_CALL_INTERVAL - timeSinceLast);
    }

    lastCallTime = Date.now();

    // 3. Execution
    try {
        const result = await fn();
        // Increment API usage counter
        window.dispatchEvent(new CustomEvent('api-call-made'));
        return result;
    } catch (e: any) {
        console.error("Gemini API Error:", e);
        // Check for 429 or Quota Exceeded
        if (e.status === 429 || (e.message && e.message.includes('429'))) {
            console.error("QUOTA EXCEEDED. Opening Circuit Breaker.");
            circuitOpen = true;
            circuitResetTime = Date.now() + CIRCUIT_COOLDOWN;
        }
        return fallback;
    }
};

export const generateDialogue = async (
  npc: NPC,
  playerInput: string,
  history: string[],
  context: string
): Promise<string> => {
  return safeCall(async () => {
      const model = "gemini-2.5-flash";
      const isGreeting = playerInput === "";

      const prompt = `You are ${npc.name}, a ${npc.profession} (age ${npc.age}, ${npc.gender}) at the 1889 Paris Universal Exposition.

CHARACTER: ${npc.description}
GOAL: ${npc.goal}
MANNER OF SPEECH: ${npc.dialogueStyle}
CURRENT LOCATION: ${context}

You are speaking with Henry James, the American novelist.

${history.length > 0 ? `RECENT CONVERSATION:\n${history.slice(-3).join('\n')}` : ''}

${isGreeting
  ? "Henry James approaches you. Greet him."
  : `Henry James says: "${playerInput}"`}

CRITICAL RULES:
- Write ONLY dialogue - spoken words only
- NO actions, NO stage directions, NO asterisks, NO italics
- NO "*I do something*" or "*adjusts spectacles*" - just speech
- Be naturalistic and conversational, not stiff or formal
- Speak as a real person would in 1889, with personality and warmth
- Stay in character but be human - use contractions, humor, emotion
- Maximum 40 words
- Use **bold** sparingly for emphasis on key words only`;

      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text || "...";
  }, "The noise of the crowd drowns out their reply.");
};

export const askNarrator = async (question: string, context: string): Promise<string> => {
  return safeCall(async () => {
      const model = "gemini-2.5-flash";
      const prompt = `You are the narrator for a literary RPG set at the 1889 Paris Universal Exposition.

The player is Henry James, the 46-year-old American novelist. He is observing the Fair with the eye of a writer—noting social dynamics, material culture, and the tensions between old Europe and industrial modernity.

CURRENT SITUATION: ${context}

PLAYER ASKS: "${question}"

Respond in the style of Henry James's own prose: precise, observant, with long sentences that circle toward insight. Describe sensory details—sounds of machinery, smells of food and crowds, the quality of light through glass and iron.

Focus on what a novelist would notice: human behavior, telling details, ironies of class and nation.

Maximum 60 words. Use *italics* for emphasis.`;
      const res = await ai.models.generateContent({model, contents: prompt});
      return res.text || "You see nothing of note.";
  }, "The details are hazy.");
}

export const generateLocationNarrative = async (zoneName: string, biome: string, desc: string): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";

        const biomeContext: Record<string, string> = {
            'GRAND_HALL': 'an immense iron-and-glass exhibition hall filled with the thunder of machinery',
            'GARDEN': 'manicured grounds with gravel paths, ornamental plantings, and the distant splash of fountains',
            'STREET': 'a bustling thoroughfare crowded with visitors from every nation',
            'SALON': 'an elegant pavilion with polished floors and carefully arranged displays',
            'TOWER_LEVEL': 'the iron lattice of the great tower, Paris spread below like a map'
        };

        const prompt = `You are the narrator for Henry James at the 1889 Paris Universal Exposition.

Henry James enters: ${zoneName}
Setting: ${biomeContext[biome] || biome}
Details: ${desc}

Write 2-3 atmospheric sentences describing this location. Include:
- Specific sensory details (sounds, smells, textures, light)
- The character of the crowd here
- Period-appropriate details from 1889

Prose style: Precise, literary, slightly ironic. Maximum 50 words.`;
        const res = await ai.models.generateContent({model, contents: prompt});
        return res.text || `You enter ${zoneName}.`;
    }, `You enter ${zoneName}.`);
}

export const generateNpcEncounter = async (npc: NPC): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `
            Henry James passes ${npc.name} (${npc.profession}) at the 1889 Expo.
            Write ONE sentence describing this fleeting moment.
        `;
        const res = await ai.models.generateContent({model, contents: prompt});
        return res.text || `${npc.name} is nearby.`;
    }, `${npc.name} passes by.`);
}

export const generateCuratorItem = async (): Promise<{name: string, description: string, tags: string[]}> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Generate 1 object from 1889 Paris Expo. JSON: {name, description, tags:['VULGAR'|'SUBLIME']}.`;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    }, { name: "Top Hat", description: "Standard issue.", tags: ['SUBLIME'] });
}

export const generateCombatMove = async (
  attacker: NPC,
  playerCard: CombatCard,
  battleLog: string[]
): Promise<{ text: string; damage: number }> => {
  return safeCall(async () => {
      const model = "gemini-2.5-flash";
      const prompt = `You are ${attacker.name}, a ${attacker.profession} at the 1889 Paris World's Fair.
Henry James just used "${playerCard.name}" (${playerCard.type}: ${playerCard.description}) against you in a battle of wits.

Generate your devastating counter-response in the style of a 19th century intellectual duel.

Return JSON only:
{
  "text": "Your witty, cutting retort (1-2 sentences max, in character)",
  "damage": number between 3-15 based on how devastating the burn is
}`;

      const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || "{}");
      return {
        text: data.text || "They scoff at you.",
        damage: typeof data.damage === 'number' ? data.damage : 5
      };
  }, { text: "They scoff at you.", damage: 5 });
};

export const checkHistoricalFact = async (gameEventText: string): Promise<FactCheckResult> => {
  return safeCall(async () => {
      const model = "gemini-2.5-flash";
      const prompt = `Verify historical accuracy of: "${gameEventText}" in 1889 context. Use Google Search.`;
      const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { tools: [{ googleSearch: {} }] }
      });
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter(c => c.web?.uri && c.web?.title).map(c => ({ title: c.web!.title!, uri: c.web!.uri! })).slice(0, 3);
      return { originalEvent: gameEventText, veracityScore: 85, correction: response.text || "Verified.", sources };
  }, { originalEvent: gameEventText, veracityScore: 0, correction: "Service unavailable.", sources: [] });
};

export const generateImpressionistImage = async (prompt: string): Promise<string | null> => {
    return safeCall(async () => {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { numberOfImages: 1, aspectRatio: '4:3' }
        });
        const base64 = response.generatedImages?.[0]?.image?.imageBytes;
        return base64 ? `data:image/png;base64,${base64}` : null;
    }, null);
}

export const generateObservationPrompt = (zoneName: string, biome: string, desc: string, npcs: NPC[]): string => {
    const npcText = npcs.length > 0 
        ? `Figures: ${npcs.map(n => n.name).join(', ')}.` 
        : "Empty.";
    return `Impressionist oil painting, 1889 Paris World's Fair. ${zoneName} (${biome}). ${desc} ${npcText} Style of Monet.`;
};

export const generatePondering = async (zoneName: string): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Henry James, the American novelist, pauses to ponder ${zoneName} at the 1889 Paris Exposition.

Write ONE sentence capturing his thought—complex, slightly melancholic, with the characteristic Jamesian style: subordinate clauses, qualifications, an ironic awareness of his own American perspective amid European grandeur.

The sentence should reveal something about the location, the Fair, or modern life. Maximum 40 words.`;
        const res = await ai.models.generateContent({model, contents: prompt});
        return res.text || "The crowd is overwhelming.";
    }, "You are lost in thought.");
}

export const generateScrutiny = async (objectName: string): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Henry James, the novelist known for his precise observation, closely examines "${objectName}" at the 1889 Paris Exposition.

Write ONE detailed sentence describing what he notices—the craftsmanship, the materials, what it reveals about its maker or its era. Use specific sensory details.

Jamesian prose style: precise, layered, attentive to surfaces that suggest depths. Maximum 35 words.`;
        const res = await ai.models.generateContent({model, contents: prompt});
        return res.text || "It appears manufactured.";
    }, "You look closely.");
}

export const generateAssessment = async (logs: string[], journal: string[]): Promise<any> => {
   return safeCall(async () => {
       const model = "gemini-2.5-flash";
       const prompt = `Analyze Henry James's visit. Logs: ${logs.slice(-10)}. JSON {score, title, summary}.`;
       const response = await ai.models.generateContent({model, contents: prompt, config: {responseMimeType: "application/json"}});
       return JSON.parse(response.text || "{}");
   }, { score: 0, title: "Unfinished", summary: "No data." });
}

export const generateTelegram = async (): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Generate a short telegram that Henry James might send from the 1889 Paris Exposition.

The telegram should be:
- In ALL CAPS with STOP between sentences
- Characteristic of James's personality: slightly world-weary, observant, literary
- Reference something specific about the Fair, Paris, or his literary work
- Maximum 15 words

Example format: TOWER VULGAR BUT IMPRESSIVE STOP CROWDS EXHAUSTING STOP MISS BOSTON STOP`;
        const res = await ai.models.generateContent({model, contents: prompt});
        return (res.text || "TIRED STOP").toUpperCase().replace(/[^A-Z ]/g, '');
    }, "NO SIGNAL STOP");
}

export const generateZoneInfo = async (biome: string): Promise<{name: string, description: string}> => {
    return safeCall(async () => {
         const model = "gemini-2.5-flash";

         const biomeHints: Record<string, string> = {
             'GRAND_HALL': 'an exhibition hall (Galerie des Machines, Palais des Industries, etc.)',
             'GARDEN': 'gardens or outdoor promenades (Champ de Mars, Trocadéro gardens, etc.)',
             'STREET': 'streets or commercial areas (Rue du Caire, colonial villages, food vendors)',
             'SALON': 'national pavilions or art galleries (foreign country exhibits, Beaux-Arts)',
             'TOWER_LEVEL': 'the Eiffel Tower or its base'
         };

         const prompt = `Generate a location for the 1889 Paris Universal Exposition.

Type: ${biomeHints[biome] || biome}

Return JSON with:
- name: A historically plausible name for this area (in French or English)
- description: One atmospheric sentence describing the location

The name should feel authentic to the 1889 Expo. Be specific—reference actual exhibits, pavilions, or features that existed.

JSON format: {"name": "string", "description": "string"}`;
         const response = await ai.models.generateContent({model, contents: prompt, config: {responseMimeType: "application/json"}});
         return JSON.parse(response.text || "{}");
    }, { name: "Unknown Area", description: "Fog covers the street." });
}

// Combat remark evaluation
export const evaluateCombatRemark = async (
    playerText: string,
    cardType: string,
    npcName: string,
    npcProfession: string,
    npcAge: number,
    npcWit: number,
    npcObservation: number,
    npcComposure: number,
    battleContext: string[]
): Promise<{
    quality: 'excellent' | 'good' | 'weak' | 'backfire';
    damageMultiplier: number;
    npcResponse: string;
    npcDamage: number;
    analysis: string;
}> => {
    const defaultResponse = {
        quality: 'good' as const,
        damageMultiplier: 1.0,
        npcResponse: "They consider your words carefully.",
        npcDamage: 7,
        analysis: "Default response"
    };

    return safeCall(async () => {
        const model = "gemini-2.0-flash";
        const prompt = `You are evaluating a verbal exchange at the 1889 Paris World's Fair.

Henry James just played a ${cardType} card and wrote: "${playerText}"

He is speaking to ${npcName}, a ${npcProfession}, ${npcAge} years old.
NPC Stats - Wit: ${npcWit}, Observation: ${npcObservation}, Composure: ${npcComposure}

Previous exchanges: ${battleContext.slice(-4).join(' | ') || 'None yet'}

EVALUATION CRITERIA:
- EXCELLENT: Historically appropriate, witty, matches card type perfectly, would genuinely sting a 19th century intellectual
- GOOD: Reasonable attempt, somewhat period-appropriate, makes sense for the card type
- WEAK: Generic, anachronistic, or doesn't match the card type well
- BACKFIRE: Completely inappropriate, nonsensical, embarrassingly bad, or so anachronistic it would confuse the NPC

For INSULT cards: Should be cutting, subtle, Victorian in sensibility
For DEFENSE cards: Should deflect elegantly, turn the conversation
For OBSERVATION cards: Should be perceptive, psychologically acute

Return JSON only:
{
    "quality": "excellent" | "good" | "weak" | "backfire",
    "damageMultiplier": number (excellent: 1.5, good: 1.0, weak: 0.5, backfire: 0),
    "npcResponse": "The NPC's witty counter-response (1-2 sentences, in character, period-appropriate)",
    "npcDamage": number (base 5-12, higher if player's remark was weak/backfire),
    "analysis": "Brief explanation of why this quality rating (1 sentence)"
}`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        return {
            quality: data.quality || 'good',
            damageMultiplier: data.damageMultiplier || 1.0,
            npcResponse: data.npcResponse || "They regard you with cool amusement.",
            npcDamage: data.npcDamage || 8,
            analysis: data.analysis || ""
        };
    }, defaultResponse);
}
