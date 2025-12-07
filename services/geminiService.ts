import { FactCheckResult, NPC, CombatCard } from "../types";

// --- API PROXY ---
// All calls go through /api/gemini to keep the API key server-side

interface ApiResponse {
  text?: string;
  imageBytes?: string;
  groundingMetadata?: {
    groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
  };
  error?: string;
}

const callGeminiApi = async (
  action: string,
  options: {
    model?: string;
    prompt?: string;
    config?: Record<string, unknown>;
    imagePrompt?: string;
    aspectRatio?: string;
  }
): Promise<ApiResponse> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...options })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
};

// --- RATE LIMITER & CIRCUIT BREAKER ---
let lastCallTime = 0;
let circuitOpen = false;
let circuitResetTime = 0;
const MIN_CALL_INTERVAL = 2500; // ms
const CIRCUIT_COOLDOWN = 60000; // 60s

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const safeCall = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
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
        if (e.message?.includes('429') || e.message?.includes('Rate limited')) {
            console.error("QUOTA EXCEEDED. Opening Circuit Breaker.");
            circuitOpen = true;
            circuitResetTime = Date.now() + CIRCUIT_COOLDOWN;
        }
        return fallback;
    }
};

export interface DialogueResponse {
  text: string;
  initiateCombat: boolean;
  combatReason?: string;
}

/**
 * Generate an instant greeting without API call for faster initial dialogue
 * This provides immediate feedback while maintaining character consistency
 */
export const generateInstantGreeting = (npc: NPC): string => {
  const relationship = npc.relationshipToHenry;
  const hasPersonalRelationship = relationship && relationship.type !== 'stranger';

  // Personal relationships get warm, immediate greetings
  if (hasPersonalRelationship) {
    const nickname = relationship!.knowsHenryAs || 'Henry';
    const familyGreetings = [
      `${nickname}! What a delightful surprise to find you here!`,
      `My dear ${nickname}! I had no idea you were in Paris!`,
      `${nickname}! Of all the people to encounter at this extraordinary Fair!`,
      `Well, well—${nickname}! How wonderful to see you!`,
    ];
    const friendGreetings = [
      `${nickname}! What a pleasure to see a familiar face among all these strangers.`,
      `Ah, ${nickname}! I was just thinking of you. How serendipitous!`,
      `${nickname}, my friend! Paris seems smaller already.`,
      `What luck! ${nickname}, it's been too long.`,
    ];
    const acquaintanceGreetings = [
      `${nickname}, isn't it? A pleasure to see you again.`,
      `Ah, ${nickname}. I thought I recognized you from across the way.`,
      `${nickname}! We meet again. How are you finding the Exposition?`,
    ];

    if (relationship!.type === 'family') {
      return familyGreetings[Math.floor(Math.random() * familyGreetings.length)];
    } else if (relationship!.type === 'close_friend') {
      return friendGreetings[Math.floor(Math.random() * friendGreetings.length)];
    } else {
      return acquaintanceGreetings[Math.floor(Math.random() * acquaintanceGreetings.length)];
    }
  }

  // Nationality-based greetings for strangers
  const nationality = npc.nationality?.toLowerCase() || 'french';
  const isFrench = nationality === 'french' || nationality.includes('paris');
  const isAmerican = nationality === 'american';
  const isBritish = nationality === 'british' || nationality === 'english' || nationality === 'irish' || nationality === 'scottish';

  // Profession-based flavor
  const prof = npc.profession.toLowerCase();
  const isArtist = prof.includes('artist') || prof.includes('painter') || prof.includes('sculptor');
  const isWriter = prof.includes('writer') || prof.includes('author') || prof.includes('poet') || prof.includes('journalist');
  const isScientist = prof.includes('scientist') || prof.includes('engineer') || prof.includes('inventor');
  const isAristocrat = prof.includes('count') || prof.includes('baron') || prof.includes('aristocrat') || prof.includes('noble');

  // French greetings
  if (isFrench) {
    const frenchGreetings = [
      "Bonjour, monsieur. You are enjoying our Exposition, I trust?",
      "Ah, another visitor. The Tower draws everyone eventually, does it not?",
      "Good day. Are you perhaps lost, or merely contemplating?",
      "Monsieur. A fine day for the Fair, non?",
      "Welcome. You have the air of a gentleman who appreciates culture.",
    ];
    if (isArtist) {
      return "Ah, a fellow appreciator of beauty, perhaps? The light here is magnificent.";
    }
    return frenchGreetings[Math.floor(Math.random() * frenchGreetings.length)];
  }

  // American greetings (recognizing a fellow countryman)
  if (isAmerican) {
    const americanGreetings = [
      "Say, you're American too, aren't you? Always nice to meet a countryman abroad.",
      "Well hello there! Another American taking in the sights?",
      "Good to see a familiar accent in this crowd. How do you find Paris?",
      "An American! Wonderful. I was beginning to feel quite outnumbered.",
    ];
    return americanGreetings[Math.floor(Math.random() * americanGreetings.length)];
  }

  // British greetings
  if (isBritish) {
    const britishGreetings = [
      "Good day. Quite the spectacle, isn't it?",
      "Ah, hello there. Taking in the French accomplishments, I see.",
      "Rather overwhelming, all this, wouldn't you say?",
      "Good afternoon. I trust you're finding the Exposition instructive?",
    ];
    return britishGreetings[Math.floor(Math.random() * britishGreetings.length)];
  }

  // Generic greetings for other nationalities
  const genericGreetings = [
    "Good day, sir. A remarkable gathering, is it not?",
    "Ah, another visitor drawn to this spectacle of progress.",
    "Welcome. The Fair has brought people from every corner of the world.",
    "Greetings. Are you finding everything to your satisfaction?",
    "Good day. There is much to see here, is there not?",
  ];

  // Add profession flavor
  if (isWriter) {
    return "Ah, I sense a thoughtful observer. There is much here to inspire the pen.";
  }
  if (isScientist) {
    return "Fascinating, isn't it? The machinery alone would occupy weeks of study.";
  }
  if (isAristocrat) {
    return "Good day. I trust you are finding the accommodations... adequate.";
  }

  return genericGreetings[Math.floor(Math.random() * genericGreetings.length)];
};

export const generateDialogue = async (
  npc: NPC,
  playerInput: string,
  history: string[],
  context: string
): Promise<string> => {
  // For initial greetings (empty playerInput), use instant generation for speed
  if (playerInput === "" && history.length === 0) {
    return generateInstantGreeting(npc);
  }
  const response = await generateDialogueWithCombatCheck(npc, playerInput, history, context);
  return response.text;
};

export const generateDialogueWithCombatCheck = async (
  npc: NPC,
  playerInput: string,
  history: string[],
  context: string
): Promise<DialogueResponse> => {
  return safeCall(async () => {
      const model = "gemini-2.5-flash";
      const isGreeting = playerInput === "";

      // Check if NPC has a defined relationship to Henry James (family, close friends, etc.)
      const relationship = npc.relationshipToHenry;
      const hasPersonalRelationship = relationship && relationship.type !== 'stranger';

      // Only 15% of NPCs recognize Henry James - he was not famous in France in 1889
      // Literary professionals and some aristocrats might know him
      // BUT: NPCs with defined relationships ALWAYS know him
      const literaryProfessions = ['writer', 'author', 'journalist', 'editor', 'critic', 'professor', 'diplomat', 'publisher'];
      const isLiterary = literaryProfessions.some(p => npc.profession.toLowerCase().includes(p));
      const recognitionRoll = Math.random();
      const knowsJames = hasPersonalRelationship || (isLiterary ? recognitionRoll < 0.5 : recognitionRoll < 0.12);

      // Determine how the NPC perceives this stranger
      let playerDescription: string;
      if (hasPersonalRelationship) {
          // Personal relationship - describe based on their history
          const nickname = relationship!.knowsHenryAs || 'Henry';
          playerDescription = `${nickname} - ${relationship!.description}`;
      } else if (knowsJames) {
          playerDescription = "Henry James, the American novelist (you've read his work or heard his name in literary circles)";
      } else {
          playerDescription = "a well-dressed American gentleman of middle age, clearly educated, with an observer's careful gaze";
      }

      // Build nationality and background context
      const nationalityContext = npc.nationality ? `${npc.nationality}` : 'French';
      const birthplaceContext = npc.birthplace
          ? `born in ${npc.birthplace.city}${npc.birthplace.region ? `, ${npc.birthplace.region}` : ''}`
          : '';
      const residenceContext = npc.currentResidence
          ? `currently residing in ${npc.currentResidence.city}`
          : '';
      const backgroundContext = [birthplaceContext, residenceContext].filter(Boolean).join(', ');

      // NPC's wit stat affects their likelihood to initiate verbal combat
      const npcWit = npc.combatStats?.wit || 10;
      const combatThreshold = npcWit >= 15 ? 'low' : npcWit >= 10 ? 'medium' : 'high';

      const prompt = `You are ${npc.name}, a ${nationalityContext} ${npc.profession} (age ${npc.age}, ${npc.gender}) at the 1889 Paris Universal Exposition.

CHARACTER: ${npc.description}
${backgroundContext ? `BACKGROUND: ${backgroundContext}` : ''}
${npc.historicalNote ? `BIOGRAPHY: ${npc.historicalNote}` : ''}
CURRENT GOAL: ${npc.goal}
MANNER OF SPEAKING: ${npc.dialogueStyle}
LOCATION: ${context}
WIT: ${npcWit}/20 (${npcWit >= 15 ? 'sharp-tongued, enjoys verbal sparring' : npcWit >= 10 ? 'capable of wit when provoked' : 'prefers to avoid confrontation'})

${hasPersonalRelationship
    ? `YOU KNOW THIS MAN WELL: This is ${playerDescription}
${relationship!.sharedHistory ? `YOUR SHARED HISTORY: ${relationship!.sharedHistory}` : ''}
You call him "${relationship!.knowsHenryAs || 'Henry'}" - use this name naturally in conversation.
Your relationship is: ${relationship!.type} (${relationship!.type === 'family' ? 'you are family - be warm, familiar, perhaps with gentle teasing as family does' : relationship!.type === 'close_friend' ? 'you are dear friends - show genuine warmth and interest' : 'you know each other professionally or socially'})`
    : knowsJames
    ? `You recognize this man as Henry James, an American writer of some reputation in literary circles.`
    : `A well-dressed American gentleman approaches. You do not know him—he is simply another visitor to the Fair, though he carries himself with a certain quiet distinction.`}

${history.length > 0 ? `CONVERSATION SO FAR (YOU are "${npc.name}", the American stranger is "PLAYER"):\n${history.slice(-4).join('\n')}` : ''}

${isGreeting
    ? hasPersonalRelationship
        ? `${relationship!.knowsHenryAs || 'Henry'} approaches you! Greet him as you would ${relationship!.type === 'family' ? 'your brother' : relationship!.type === 'close_friend' ? 'a dear friend' : 'someone you know'}—with appropriate warmth and familiarity.`
        : `This ${knowsJames ? 'American writer' : 'stranger'} approaches you. Respond naturally—${knowsJames ? 'you might acknowledge knowing his work, or simply be polite' : 'as you would to any foreign visitor'}.`
    : `The American (PLAYER) now says to you: "${playerInput}"\n\nRespond as ${npc.name}. Do NOT repeat or rephrase what the PLAYER just said—respond to it.`}

ESSENTIAL RULES:
- Write ONLY spoken dialogue. No actions, no narration, no asterisks.
- Be a real person, not a tour guide or exposition spokesperson
- Your nationality and background subtly inform your perspective and speech patterns
${hasPersonalRelationship
    ? `- You KNOW this man well! Address him by name ("${relationship!.knowsHenryAs || 'Henry'}"), show familiarity, reference shared experiences naturally
- ${relationship!.type === 'family' ? 'As family, you can be informal, tease gently, ask about family matters' : relationship!.type === 'close_friend' ? 'As dear friends, show warmth and genuine interest in his well-being' : 'As acquaintances, be cordial and reference your professional connection'}`
    : `- You have your own concerns, moods, distractions—this stranger is not the center of your world
- ${knowsJames ? 'You may reference knowing his literary reputation, but do not fawn or lecture' : 'You have no idea who this man is—treat him as you would any polite stranger'}`}
- Speak naturally for your class, profession, and nationality in 1889
- Brief responses are fine—not everyone wants a long conversation
- If this is a greeting, ${hasPersonalRelationship ? 'show appropriate warmth for your relationship' : 'you might be distracted, busy, or merely polite'}

CRITICAL - HANDLING INAPPROPRIATE OR INSULTING SPEECH:
If the player says something insulting, offensive, prejudiced, condescending, or barbed:
- DO NOT simply accept it or respond meekly
- A person of wit and pride would CHALLENGE such remarks
- Consider whether this insult warrants a "duel of wits" - a formal verbal sparring match
- Trigger combat for: direct insults, bigotry, condescension, challenges to honor/intelligence/nationality
- ${combatThreshold === 'low' ? 'You have a sharp tongue and LOW threshold for insults - you ENJOY verbal combat' : combatThreshold === 'medium' ? 'You will defend yourself if sufficiently provoked' : 'You prefer to walk away, but grievous insults will be answered'}

If the player says something anachronistic (modern slang like "dude", "bro", "my man"), vulgar, or bizarre:
- React with confusion, offense, or dismissal appropriate to your class
- This may ALSO warrant initiating combat if it seems intentionally disrespectful

Return JSON:
{
    "text": "Your spoken response (max 35 words, dialogue only)",
    "initiateCombat": true/false,
    "combatReason": "Brief reason if initiating combat (e.g., 'insulted my nationality', 'questioned my honor')"
}`;

      const response = await callGeminiApi('generateContent', {
          model,
          prompt,
          config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{"text": "...", "initiateCombat": false}');
      return {
          text: data.text || "...",
          initiateCombat: data.initiateCombat === true,
          combatReason: data.combatReason
      };
  }, { text: "The noise of the crowd drowns out their reply.", initiateCombat: false, combatReason: undefined });
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
      const response = await callGeminiApi('generateContent', { model, prompt });
      return response.text || "You see nothing of note.";
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
        const response = await callGeminiApi('generateContent', { model, prompt });
        return response.text || `You enter ${zoneName}.`;
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
        const response = await callGeminiApi('generateContent', { model, prompt });
        return response.text || `${npc.name} is nearby.`;
    }, `${npc.name} passes by.`);
}

export const generateCuratorItem = async (): Promise<{name: string, description: string, tags: string[]}> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Generate 1 object from 1889 Paris Expo. JSON: {name, description, tags:['VULGAR'|'SUBLIME']}.`;
        const response = await callGeminiApi('generateContent', {
            model,
            prompt,
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

      const response = await callGeminiApi('generateContent', {
          model,
          prompt,
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
      const response = await callGeminiApi('generateContent', {
          model,
          prompt,
          config: { tools: [{ googleSearch: {} }] }
      });
      const chunks = response.groundingMetadata?.groundingChunks || [];
      const sources = chunks
          .filter(c => c.web?.uri && c.web?.title)
          .map(c => ({ title: c.web!.title!, uri: c.web!.uri! }))
          .slice(0, 3);
      return { originalEvent: gameEventText, veracityScore: 85, correction: response.text || "Verified.", sources };
  }, { originalEvent: gameEventText, veracityScore: 0, correction: "Service unavailable.", sources: [] });
};

export const generateImpressionistImage = async (prompt: string): Promise<string | null> => {
    return safeCall(async () => {
        const response = await callGeminiApi('generateImage', {
            imagePrompt: prompt,
            aspectRatio: '4:3'
        });
        const base64 = response.imageBytes;
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
        const response = await callGeminiApi('generateContent', { model, prompt });
        return response.text || "The crowd is overwhelming.";
    }, "You are lost in thought.");
}

export const generateScrutiny = async (objectName: string): Promise<string> => {
    return safeCall(async () => {
        const model = "gemini-2.5-flash";
        const prompt = `Henry James, the novelist known for his precise observation, closely examines "${objectName}" at the 1889 Paris Exposition.

Write ONE detailed sentence describing what he notices—the craftsmanship, the materials, what it reveals about its maker or its era. Use specific sensory details.

Jamesian prose style: precise, layered, attentive to surfaces that suggest depths. Maximum 35 words.`;
        const response = await callGeminiApi('generateContent', { model, prompt });
        return response.text || "It appears manufactured.";
    }, "You look closely.");
}

export const generateAssessment = async (logs: string[], journal: string[]): Promise<any> => {
   return safeCall(async () => {
       const model = "gemini-2.5-flash";
       const prompt = `Analyze Henry James's visit. Logs: ${logs.slice(-10)}. JSON {score, title, summary}.`;
       const response = await callGeminiApi('generateContent', {
           model,
           prompt,
           config: { responseMimeType: "application/json" }
       });
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
        const response = await callGeminiApi('generateContent', { model, prompt });
        return (response.text || "TIRED STOP").toUpperCase().replace(/[^A-Z ]/g, '');
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
         const response = await callGeminiApi('generateContent', {
             model,
             prompt,
             config: { responseMimeType: "application/json" }
         });
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

        const response = await callGeminiApi('generateContent', {
            model,
            prompt,
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

        const response = await callGeminiApi('generateContent', { model, prompt });
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

        const response = await callGeminiApi('generateContent', {
            model,
            prompt,
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

        const response = await callGeminiApi('generateContent', {
            model,
            prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || "{}");
        return {
            quality: data.quality || 'good',
            npcResponse: data.npcResponse || "They regard you with cool amusement."
        };
    }, defaultResponse);
};
