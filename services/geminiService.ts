
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

      // Only 15% of NPCs recognize Henry James - he was not famous in France in 1889
      // Literary professionals and some aristocrats might know him
      const literaryProfessions = ['writer', 'author', 'journalist', 'editor', 'critic', 'professor', 'diplomat', 'publisher'];
      const isLiterary = literaryProfessions.some(p => npc.profession.toLowerCase().includes(p));
      const recognitionRoll = Math.random();
      const knowsJames = isLiterary ? recognitionRoll < 0.5 : recognitionRoll < 0.12;

      // Determine how the NPC perceives this stranger
      const playerDescription = knowsJames
          ? "Henry James, the American novelist (you've read his work or heard his name in literary circles)"
          : "a well-dressed American gentleman of middle age, clearly educated, with an observer's careful gaze";

      const prompt = `You are ${npc.name}, a ${npc.profession} (age ${npc.age}, ${npc.gender}) at the 1889 Paris Universal Exposition.

CHARACTER: ${npc.description}
CURRENT GOAL: ${npc.goal}
MANNER OF SPEAKING: ${npc.dialogueStyle}
LOCATION: ${context}

${knowsJames
    ? `You recognize this man as Henry James, an American writer of some reputation in literary circles.`
    : `A well-dressed American gentleman approaches. You do not know him—he is simply another visitor to the Fair, though he carries himself with a certain quiet distinction.`}

${history.length > 0 ? `CONVERSATION SO FAR:\n${history.slice(-4).join('\n')}` : ''}

${isGreeting
    ? `This ${knowsJames ? 'American writer' : 'stranger'} approaches you. Respond naturally—${knowsJames ? 'you might acknowledge knowing his work, or simply be polite' : 'as you would to any foreign visitor'}.`
    : `The American says: "${playerInput}"`}

ESSENTIAL RULES:
- Write ONLY spoken dialogue. No actions, no narration, no asterisks.
- Be a real person, not a tour guide or exposition spokesperson
- You have your own concerns, moods, distractions—this stranger is not the center of your world
- ${knowsJames ? 'You may reference knowing his literary reputation, but do not fawn or lecture' : 'You have no idea who this man is—treat him as you would any polite stranger'}
- Speak naturally for your class and profession in 1889 France
- Brief responses are fine—not everyone wants a long conversation
- If this is a greeting, you might be distracted, busy, or merely polite
- Maximum 35 words`;

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
        const prompt = `You are briefly describing a fleeting moment at the 1889 Paris World's Fair.

A well-dressed American observer (the player) passes near ${npc.name}, a ${npc.profession} (${npc.age} years old, ${npc.gender}).

Write ONE sentence in the style of Henry James's prose—noting a telling detail, a gesture, an expression, something that reveals character or social position. Be precise and observant, slightly detached.

The encounter is incidental—they do not interact, merely pass in the crowd. Maximum 30 words.`;
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
      const prompt = `You are ${attacker.name}, a ${attacker.profession} (${attacker.age} years old) at the 1889 Paris World's Fair.

You are in a heated verbal exchange with an American gentleman—a writer, you gather, though not one whose name you recognize. He has just made a remark: "${playerCard.name}" (${playerCard.type}: ${playerCard.description})

Generate your counter-response. This is 1889—wit is a weapon, and social embarrassment a genuine danger. Your reply should be period-appropriate: cutting but not vulgar, clever but not modern.

Return JSON only:
{
  "text": "Your retort (1-2 sentences, in character for your profession and class)",
  "damage": number between 3-15 based on how sharp the riposte
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

An American writer (the player) has just made a remark of type ${cardType}: "${playerText}"

His opponent is ${npcName}, a ${npcProfession}, ${npcAge} years old.
NPC Stats - Wit: ${npcWit}/20, Observation: ${npcObservation}/20, Composure: ${npcComposure}/20

Previous exchanges: ${battleContext.slice(-4).join(' | ') || 'None yet'}

EVALUATION CRITERIA (strict period authenticity):
- EXCELLENT: Genuinely witty in the 1889 sense—allusive, subtle, devastatingly polite. Would land in a Henry James novel.
- GOOD: Reasonable attempt, period-appropriate enough, shows some verbal skill
- WEAK: Too modern, too blunt, misses the tone of Victorian social combat
- BACKFIRE: Anachronistic, crude, or so poorly aimed it embarrasses the speaker

For INSULT cards: Should wound through implication, not direct attack
For DEFENSE cards: Should redirect with grace, perhaps a disarming concession
For OBSERVATION cards: Should reveal something the target wished hidden

Return JSON only:
{
    "quality": "excellent" | "good" | "weak" | "backfire",
    "damageMultiplier": number (excellent: 1.5, good: 1.0, weak: 0.5, backfire: 0),
    "npcResponse": "The NPC's counter-response (1-2 sentences, in character for their class/profession)",
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
