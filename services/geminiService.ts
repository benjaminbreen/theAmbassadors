
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

      // Build nationality and background context
      const nationalityContext = npc.nationality ? `${npc.nationality}` : 'French';
      const birthplaceContext = npc.birthplace
          ? `born in ${npc.birthplace.city}${npc.birthplace.region ? `, ${npc.birthplace.region}` : ''}`
          : '';
      const residenceContext = npc.currentResidence
          ? `currently residing in ${npc.currentResidence.city}`
          : '';
      const backgroundContext = [birthplaceContext, residenceContext].filter(Boolean).join(', ');

      const prompt = `You are ${npc.name}, a ${nationalityContext} ${npc.profession} (age ${npc.age}, ${npc.gender}) at the 1889 Paris Universal Exposition.

CHARACTER: ${npc.description}
${backgroundContext ? `BACKGROUND: ${backgroundContext}` : ''}
${npc.historicalNote ? `BIOGRAPHY: ${npc.historicalNote}` : ''}
CURRENT GOAL: ${npc.goal}
MANNER OF SPEAKING: ${npc.dialogueStyle}
LOCATION: ${context}

${knowsJames
    ? `You recognize this man as Henry James, an American writer of some reputation in literary circles.`
    : `A well-dressed American gentleman approaches. You do not know him—he is simply another visitor to the Fair, though he carries himself with a certain quiet distinction.`}

${history.length > 0 ? `CONVERSATION SO FAR (YOU are "${npc.name}", the American stranger is "PLAYER"):\n${history.slice(-4).join('\n')}` : ''}

${isGreeting
    ? `This ${knowsJames ? 'American writer' : 'stranger'} approaches you. Respond naturally—${knowsJames ? 'you might acknowledge knowing his work, or simply be polite' : 'as you would to any foreign visitor'}.`
    : `The American (PLAYER) now says to you: "${playerInput}"\n\nRespond as ${npc.name}. Do NOT repeat or rephrase what the PLAYER just said—respond to it.`}

ESSENTIAL RULES:
- Write ONLY spoken dialogue. No actions, no narration, no asterisks.
- Be a real person, not a tour guide or exposition spokesperson
- Your nationality and background subtly inform your perspective and speech patterns
- You have your own concerns, moods, distractions—this stranger is not the center of your world
- ${knowsJames ? 'You may reference knowing his literary reputation, but do not fawn or lecture' : 'You have no idea who this man is—treat him as you would any polite stranger'}
- Speak naturally for your class, profession, and nationality in 1889
- Brief responses are fine—not everyone wants a long conversation
- If this is a greeting, you might be distracted, busy, or merely polite

CRITICAL - HANDLING INAPPROPRIATE SPEECH:
If the player says something anachronistic (modern slang like "dude", "bro", "my man"), vulgar, overly familiar, or bizarre:
- DO NOT politely play along or act merely "puzzled"
- React as a REAL person of your class and era would: with offense, confusion, coldness, or dismissal
- Aristocrats and upper class: Be AFFRONTED. Turn away. "I beg your pardon?" / "Sir, you forget yourself." / End the conversation.
- Working class: Be suspicious or hostile. "What's your game?" / "Clear off."
- Artists/bohemians: Might be amused but still find it strange
- You may simply REFUSE to continue speaking to someone who addresses you inappropriately
- False claims of acquaintance from a stranger should be met with ICY skepticism, not polite accommodation

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
        const nationalityHint = npc.nationality && npc.nationality !== 'French'
            ? `, evidently ${npc.nationality}`
            : '';
        const prompt = `You are briefly describing a fleeting moment at the 1889 Paris World's Fair.

A well-dressed American observer (the player) passes near ${npc.name}, a ${npc.profession}${nationalityHint} (${npc.age} years old, ${npc.gender}).
${npc.historicalNote ? `Context: ${npc.historicalNote.slice(0, 100)}...` : ''}

Write ONE sentence in the style of Henry James's prose—noting a telling detail, a gesture, an expression, something that reveals character, social position, or national origin. Be precise and observant, slightly detached.

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
      const nationalityContext = attacker.nationality ? `${attacker.nationality} ` : '';
      const backgroundHint = attacker.birthplace
          ? `(from ${attacker.birthplace.city})`
          : '';

      const prompt = `You are ${attacker.name}, a ${nationalityContext}${attacker.profession} ${backgroundHint} (${attacker.age} years old) at the 1889 Paris World's Fair.
${attacker.historicalNote ? `Background: ${attacker.historicalNote.slice(0, 150)}` : ''}

You are in a heated verbal exchange with an American gentleman—a writer, you gather, though not one whose name you recognize. He has just made a remark: "${playerCard.name}" (${playerCard.type}: ${playerCard.description})

Generate your counter-response. This is 1889—wit is a weapon, and social embarrassment a genuine danger. Your reply should be period-appropriate: cutting but not vulgar, clever but not modern. Your nationality and background should subtly inform your perspective.

Return JSON only:
{
  "text": "Your retort (1-2 sentences, in character for your profession, class, and nationality)",
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

// Combat remark evaluation - with severity levels for backfires
export const evaluateCombatRemark = async (
    playerText: string,
    cardType: string,
    npcName: string,
    npcProfession: string,
    npcAge: number,
    npcWit: number,
    npcObservation: number,
    npcComposure: number,
    battleContext: string[],
    npcNationality?: string,
    npcBackground?: string
): Promise<{
    quality: 'excellent' | 'good' | 'weak' | 'backfire';
    backfireSeverity?: 'mild' | 'severe' | 'catastrophic';
    damageMultiplier: number;
    npcResponse: string;
    npcDamage: number;
    analysis: string;
}> => {
    const defaultResponse = {
        quality: 'good' as const,
        backfireSeverity: undefined as 'mild' | 'severe' | 'catastrophic' | undefined,
        damageMultiplier: 1.0,
        npcResponse: "They consider your words carefully.",
        npcDamage: 10,
        analysis: "Default response"
    };

    return safeCall(async () => {
        const model = "gemini-2.0-flash";
        const nationalityHint = npcNationality ? ` (${npcNationality})` : '';
        const prompt = `You are a STRICT evaluator of verbal exchanges at the 1889 Paris World's Fair. The player is Henry James, the famous American novelist known for his EXQUISITE subtlety and psychological precision.

The player has just made a remark of type ${cardType}: "${playerText}"

His opponent is ${npcName}, a ${npcProfession}${nationalityHint}, ${npcAge} years old.
${npcBackground ? `Background: ${npcBackground}` : ''}
NPC Stats - Wit: ${npcWit}/20, Observation: ${npcObservation}/20, Composure: ${npcComposure}/20

Previous exchanges: ${battleContext.slice(-4).join(' | ') || 'None yet'}

EVALUATION CRITERIA (BE HARSH - Henry James would NEVER speak crudely):

- EXCELLENT: Genuinely Jamesian—allusive, subtle, devastatingly polite, psychologically acute. Multi-layered meaning.
- GOOD: Acceptable period wit. Would pass in polite society. Shows verbal skill.
- WEAK: Too direct, too modern in sensibility, or misses the mark. Mildly embarrassing.
- BACKFIRE: Anything crude, vulgar, anachronistic, or beneath a gentleman. THIS INCLUDES:
  * Direct insults ("you're stupid", "your hat sucks", "you're ugly")
  * Modern slang or references (anything post-1889)
  * Profanity or vulgarity of ANY kind
  * Overly aggressive or unsubtle attacks
  * Anything Henry James would be MORTIFIED to have said

BACKFIRE SEVERITY (critical for game balance):
- "mild": Slightly embarrassing misstep, salvageable (npcDamage: 15-25)
- "severe": Genuine social blunder, onlookers notice (npcDamage: 30-45)
- "catastrophic": Unspeakably crude or stupid, social death (npcDamage: 50-70, effectively ends the duel)

Examples of CATASTROPHIC backfires:
- "your hat sucks" → catastrophic (vulgar, juvenile, unthinkable for James)
- "you're an idiot" → catastrophic (crude direct insult)
- "whatever, loser" → catastrophic (anachronistic AND crude)
- Any profanity → catastrophic

For INSULT cards: Must wound through IMPLICATION, never direct attack
For DEFENSE cards: Redirect with grace, perhaps a disarming concession that actually cuts
For OBSERVATION cards: Reveal something the target wished hidden, but SUBTLY

Return JSON only:
{
    "quality": "excellent" | "good" | "weak" | "backfire",
    "backfireSeverity": "mild" | "severe" | "catastrophic" (only if quality is backfire),
    "damageMultiplier": number (excellent: 1.5, good: 1.0, weak: 0.5, backfire: 0),
    "npcResponse": "The NPC's devastating counter-response (1-2 sentences, in character, MORE cutting if player backfired)",
    "npcDamage": number (see severity guide above - be PUNISHING for crude remarks),
    "analysis": "Brief explanation of rating (1 sentence)"
}`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        return {
            quality: data.quality || 'good',
            backfireSeverity: data.backfireSeverity,
            damageMultiplier: data.damageMultiplier || 1.0,
            npcResponse: data.npcResponse || "They regard you with cool amusement.",
            npcDamage: data.npcDamage || 10,
            analysis: data.analysis || ""
        };
    }, defaultResponse);
}

// Generate stream-of-consciousness writing from collected words (Muse Mode)
export const generateStreamOfConsciousness = async (
    words: string[],
    context?: string
): Promise<string> => {
    const fallback = words.join(' · ') + '...';

    return safeCall(async () => {
        const model = "gemini-2.5-flash";

        const prompt = `Generate introspective stream-of-consciousness in the style of Henry James's private notebooks—a mind circling around impressions, questioning itself.

Words to weave in naturally: ${words.join(', ')}

THE VOICE:
- An observant, questioning mind thinking on paper
- Short declarative observations, then doubt, then circling back
- Uses double dashes (--) for asides and interruptions
- Ends with genuine uncertainty: "and yet..." or "but what?" or "of what?"
- Abstract nouns given weight: duty, composure, rank, attention
- The everyday made strange through scrutiny

STRUCTURE:
1. A brief, almost clinical observation
2. An expansion or variation
3. A self-interrupting aside (with --)
4. A trailing question that doesn't resolve

EXAMPLES OF THE EXACT TONE:
- "The offices of rank. Composure, sobriety; duty worn smooth as river pebbles. Officials everywhere, of course -- one could expect nothing else in such a place -- and yet, a sense of... of what?"
- "Green, everywhere green. The particular green of municipal gardens, tended and trimmed. Nature made respectable -- made official, even -- though beneath it all, something wilder, something that refuses to..."
- "Machinery. The great wheels turning. Progress, they call it -- but progress toward what, exactly? The crowd seems certain. I am less so."

Words again: ${words.join(', ')}

Write 35-55 words. NO quotation marks. End with uncertainty or an unfinished thought.`;

        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || fallback;
    }, fallback);
};

// Generate dynamic NPC opening barb for combat
export const generateNpcBarb = async (
    npcName: string,
    npcProfession: string,
    npcNationality: string | undefined,
    npcWit: number,
    npcObservation: number,
    npcComposure: number,
    exchangeNumber: number,
    previousExchanges: Array<{ npcBarb: string; playerResponse?: string; winner?: string }>,
    playerMalaise: number,
    playerComposure: number,
    cardType: 'INSULT' | 'OBSERVATION' | 'DEFENSE',
    knowsJames: boolean = false
): Promise<{ text: string; cardType: 'INSULT' | 'OBSERVATION' | 'DEFENSE' }> => {
    const defaultBarbs: Record<string, string[]> = {
        INSULT: [
            "I see you fancy yourself an observer of society. How quaint.",
            "Your reputation precedes you, though I confess the reality disappoints.",
        ],
        OBSERVATION: [
            "Your syllogism contains a rather glaring flaw, I'm afraid.",
            "That perspective betrays a certain... parochialism of thought.",
        ],
        DEFENSE: [
            "I find myself quite unmoved by your presence here.",
            "One develops certain immunities to provincial charm.",
        ]
    };

    const fallbackText = defaultBarbs[cardType][Math.floor(Math.random() * defaultBarbs[cardType].length)];

    return safeCall(async () => {
        const model = "gemini-2.0-flash";

        const historyContext = previousExchanges.length > 0
            ? `Previous exchanges:\n${previousExchanges.map((ex, i) =>
                `${i + 1}. NPC: "${ex.npcBarb}" → Player: "${ex.playerResponse || '(no response)'}" → ${ex.winner === 'PLAYER' ? 'Player won' : 'NPC won'}`
              ).join('\n')}`
            : 'This is the opening exchange.';

        const playerStateContext = playerMalaise > 60
            ? "Henry James appears visibly fatigued and melancholic - exploit this weakness."
            : playerMalaise > 30
            ? "Henry James seems somewhat weary."
            : "Henry James appears composed and alert.";

        const targetDescription = knowsJames
            ? "Henry James, the American novelist (you know his reputation for subtle psychological prose)"
            : "an American gentleman of middle age—you do not know his name or profession, only that he appears educated and carries himself with quiet distinction";

        const prompt = `Generate a cutting verbal barb for a witty NPC at the 1889 Paris World's Fair.

THE NPC:
- Name: ${npcName}
- Profession: ${npcProfession}${npcNationality ? ` (${npcNationality})` : ''}
- Wit: ${npcWit}/20, Observation: ${npcObservation}/20, Composure: ${npcComposure}/20

THE TARGET: ${targetDescription}
${playerStateContext}
Player composure: ${playerComposure}/100

EXCHANGE: ${exchangeNumber} of 3
${historyContext}

CARD TYPE TO PLAY: ${cardType}
- INSULT: A cutting remark that wounds through implication, never crude
- OBSERVATION: A pointed observation that exposes something uncomfortable
- DEFENSE: A dismissive deflection that implies superiority

REQUIREMENTS:
- Write as this specific ${npcProfession} would speak - use their professional vocabulary
${knowsJames
    ? '- You may reference knowing James as a novelist, but focus on what you can OBSERVE about him'
    : '- You do NOT know this man is a writer. Base your barbs ONLY on his appearance, manner, and what he has said. Mock his American accent, his clothes, his presumption—NOT his literary work.'}
- Reference the conversation history if relevant (callback to previous exchanges)
- 1-2 sentences maximum
- Period-appropriate (1889 Paris)
- Witty and cutting but NEVER crude or vulgar
- If NPC is losing (player won previous exchanges), they should become more desperate/pointed
- If NPC is winning, they can be more smugly dismissive

Return JSON only:
{
    "text": "The NPC's barb (1-2 sentences, in character)"
}`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        return {
            text: data.text || fallbackText,
            cardType
        };
    }, { text: fallbackText, cardType });
};

// Evaluate a single combat exchange (new streamlined system)
export const evaluateCombatExchange = async (
    playerText: string,
    playerCardType: string,
    npcBarb: string,
    npcCardType: string,
    npcName: string,
    npcProfession: string,
    npcWit: number,
    previousExchanges?: Array<{ npcBarb: string; playerResponse?: string; winner?: string; quality?: string }>,
    playerMalaise?: number,
    knowsJames: boolean = false
): Promise<{
    quality: 'excellent' | 'good' | 'weak' | 'backfire';
    npcResponse: string;
}> => {
    const defaultResponse = {
        quality: 'good' as const,
        npcResponse: "They consider your words carefully."
    };

    return safeCall(async () => {
        const model = "gemini-2.0-flash";

        const historyContext = previousExchanges && previousExchanges.length > 0
            ? `\nPrevious exchanges in this duel:\n${previousExchanges.map((ex, i) =>
                `${i + 1}. NPC: "${ex.npcBarb}" → James: "${ex.playerResponse}" (${ex.quality}) → ${ex.winner === 'PLAYER' ? 'James won' : 'NPC won'}`
              ).join('\n')}`
            : '';

        const malaiseContext = playerMalaise !== undefined && playerMalaise > 40
            ? `\nNote: Henry James is suffering from malaise (${playerMalaise}/100) - he may be off his game.`
            : '';

        const playerDescription = knowsJames
            ? "Henry James, the American novelist known for subtle, psychological wit"
            : "an American gentleman (the NPC does NOT know he is a writer—only that he appears educated and well-spoken)";

        const prompt = `You evaluate verbal sparring at the 1889 Paris World's Fair. The player is ${playerDescription}.
${historyContext}
${malaiseContext}

CURRENT EXCHANGE:
NPC (${npcName}, ${npcProfession}, Wit: ${npcWit}/20) used ${npcCardType}:
"${npcBarb}"

The American responds with ${playerCardType}:
"${playerText}"

EVALUATE the response (be STRICT - a gentleman of 1889 would NEVER be crude):

EXCELLENT: Genuinely period-appropriate wit—allusive, subtle, devastatingly polite. Multi-layered meaning that wounds through implication. References to the NPC's specific profession or previous remarks score highly.
GOOD: Acceptable period wit. Would pass in 1889 polite society.
WEAK: Too direct, too modern, or misses the mark. Generic responses that don't engage with the NPC's actual words.
BACKFIRE: Anything crude, vulgar, anachronistic, or beneath a gentleman. Direct insults, profanity, modern slang = BACKFIRE.

Card matchup context (affects narrative, not rating):
- INSULT beats DEFENSE (cuts through deflection)
- DEFENSE beats OBSERVATION (shields from scrutiny)
- OBSERVATION beats INSULT (exposes the attack's crudeness)

Return JSON only:
{
    "quality": "excellent" | "good" | "weak" | "backfire",
    "npcResponse": "The NPC's response (1-2 sentences, in character as this specific ${npcProfession}${knowsJames ? '' : ' who does NOT know the American is a novelist'} - graceful concession if bested, cutting retort if they win, reference previous exchanges if relevant)"
}`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        return {
            quality: data.quality || 'good',
            npcResponse: data.npcResponse || "They regard you with cool amusement."
        };
    }, defaultResponse);
};
