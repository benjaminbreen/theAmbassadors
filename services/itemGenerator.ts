import { Item } from "../types";

// Rate limiting
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 2500;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface GeneratedItemData {
  name: string;
  description: string;
  type: 'DOCUMENT' | 'TOOL' | 'CURIOSITY' | 'CONSUMABLE' | 'PERSONAL' | 'ART';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE';
  historicalNote?: string;
}

// Call our API proxy instead of Gemini directly
const callGeminiApi = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateContent',
        model: 'gemini-2.0-flash',
        prompt,
        config: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      console.error('API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};

/**
 * Generate a contextual item based on location and NPC
 * Uses AI to create historically accurate 1889 Paris items
 */
export const generateContextualItem = async (
  context: {
    location?: string;
    npcName?: string;
    npcProfession?: string;
    playerAction?: string;
  }
): Promise<Item | null> => {
  // Rate limiting
  const now = Date.now();
  const timeSinceLast = now - lastCallTime;
  if (timeSinceLast < MIN_CALL_INTERVAL) {
    await wait(MIN_CALL_INTERVAL - timeSinceLast);
  }
  lastCallTime = Date.now();

  try {
    const prompt = `Generate a single historically accurate item from 1889 Paris World's Fair era.

Context:
${context.location ? `- Location: ${context.location}` : ''}
${context.npcName ? `- Related to: ${context.npcName} (${context.npcProfession})` : ''}
${context.playerAction ? `- Obtained by: ${context.playerAction}` : ''}

Requirements:
- Must be period-accurate (1889 Paris)
- Should feel like something Henry James might encounter
- Include specific historical details
- Choose appropriate rarity based on value/unusualness

Return JSON only:
{
  "name": "specific item name",
  "description": "vivid 1-2 sentence description from Henry James' perspective",
  "type": "DOCUMENT|TOOL|CURIOSITY|CONSUMABLE|PERSONAL|ART",
  "rarity": "COMMON|UNCOMMON|RARE",
  "historicalNote": "optional brief historical context"
}`;

    const responseText = await callGeminiApi(prompt);
    if (!responseText) return null;

    const data: GeneratedItemData = JSON.parse(responseText);

    if (!data.name || !data.description) {
      console.error('Generated item missing required fields');
      return null;
    }

    const item: Item = {
      id: `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      description: data.description,
      type: data.type || 'CURIOSITY',
      rarity: data.rarity || 'COMMON',
      historicalNote: data.historicalNote,
      category: 'AI_GENERATED'
    };

    return item;
  } catch (error) {
    console.error('Error generating item:', error);
    return null;
  }
};

/**
 * Generate combat victory loot
 */
export const generateCombatLoot = async (opponentName: string, opponentProfession: string): Promise<Item | null> => {
  return generateContextualItem({
    npcName: opponentName,
    npcProfession: opponentProfession,
    playerAction: 'won debate/duel of wits'
  });
};

/**
 * Generate location-specific item
 */
export const generateLocationItem = async (location: string, biome: string): Promise<Item | null> => {
  return generateContextualItem({
    location: `${location} (${biome})`,
    playerAction: 'thorough exploration'
  });
};

/**
 * Generate minigame reward
 */
export const generateMinigameReward = async (minigameType: string): Promise<Item | null> => {
  const contexts: Record<string, string> = {
    'TELEGRAPH': 'Successfully sent telegraph message',
    'CURATOR': 'Curated exhibition successfully',
    'FLANEUR': 'Navigated social gathering undetected'
  };

  return generateContextualItem({
    playerAction: contexts[minigameType] || 'completed challenge'
  });
};

/**
 * Generate item from NPC gift/trade
 */
export const generateNpcGift = async (npcName: string, npcProfession: string, reason: string): Promise<Item | null> => {
  return generateContextualItem({
    npcName,
    npcProfession,
    playerAction: reason
  });
};
