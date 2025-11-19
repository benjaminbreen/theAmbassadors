
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
      
      const prompt = `
        Roleplay as ${npc.name}, a ${npc.profession} at the 1889 Paris World's Fair.
        BIO: ${npc.description}. Goal: ${npc.goal}. Style: ${npc.dialogueStyle}.
        Context: ${context}.
        History: ${history.slice(-3).join('\n')}
        ${isGreeting ? "The player approaches. Greet them." : `Player said: "${playerInput}"`}
        Reply strictly in character. Max 50 words.
      `;

      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text || "...";
  }, "The noise of the crowd drowns out their reply.");
};

export const askNarrator = async (question: string, context: string): Promise<string> => {
  return safeCall(async () => {
      const model = "gemini-2.5-flash";
      const prompt = `
        DM for 1889 Paris RPG. Player: Henry James.
        Context: ${context}
        Query: "${question}"
        Describe in rich sensory detail. Max 50 words.
      `;
      const res = await ai.models.generateContent({model, contents: prompt});
      return res.text || "You see nothing of note.";
  }, "The details are hazy.");
}

export const generateLocationNarrative = async (zoneName: string, biome: string, desc: string): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `
          Narrator for Henry James at 1889 Paris Expo.
          Location: ${zoneName} (${biome}).
          Desc: ${desc}
          Write 2 atmospheric sentences about sights/smells/sounds here. Literary tone.
        `;
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
        const prompt = `Henry James ponders ${zoneName}. One complex, judgmental sentence.`;
        const res = await ai.models.generateContent({model, contents: prompt});
        return res.text || "The crowd is overwhelming.";
    }, "You are lost in thought.");
}

export const generateScrutiny = async (objectName: string): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Henry James scrutinizes ${objectName}. One detailed sentence.`;
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
        const prompt = `Short telegram from Henry James. Uppercase. STOP punctuation.`;
        const res = await ai.models.generateContent({model, contents: prompt});
        return (res.text || "TIRED STOP").toUpperCase().replace(/[^A-Z ]/g, '');
    }, "NO SIGNAL STOP");
}

export const generateZoneInfo = async (biome: string): Promise<{name: string, description: string}> => {
    return safeCall(async () => {
         const model = "gemini-2.5-flash";
         const prompt = `Name/Desc for 1889 Paris zone: ${biome}. JSON {name, description}.`;
         const response = await ai.models.generateContent({model, contents: prompt, config: {responseMimeType: "application/json"}});
         return JSON.parse(response.text || "{}");
    }, { name: "Unknown Area", description: "Fog covers the street." });
}
