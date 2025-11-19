# LLM API Usage Analysis - The Ambassadors (1889)

## Executive Summary

**Current State:**
- ✅ Basic rate limiting implemented (2.5s between calls)
- ✅ Circuit breaker for quota errors (60s cooldown)
- ✅ Some throttling on automatic triggers
- ⚠️ NO usage tracking/counting system
- ⚠️ Some potential for runaway calls in edge cases
- ⚠️ Image generation not separately rate-limited

---

## 1. All API Call Locations

### A. Automatic Triggers (Background)

#### 1.1 Zone Entry Narrative
- **Function:** `generateLocationNarrative()`
- **Trigger:** Entering a new zone (GameContext.tsx:975)
- **Frequency:** Once per unique zone visited
- **Throttling:**
  - ✅ Only if zone not already cached (`!currentZone.narratorDescription`)
  - ✅ Global 20s cooldown (`lastGlobalNarratorTrigger`)
  - ✅ `isGenerating` flag prevents concurrent calls
- **Risk:** LOW - Cached per zone, can't trigger infinitely

#### 1.2 NPC Proximity Encounters
- **Function:** `generateNpcEncounter()`
- **Trigger:** Standing near NPCs (GameContext.tsx:936)
- **Frequency:** When within 1.5 tiles of an NPC
- **Throttling:**
  - ✅ 60s cooldown per individual NPC (`npcCooldowns`)
  - ✅ Global 20s cooldown
  - ✅ `isGenerating` flag
  - ✅ Only triggers once per NPC encounter (`triggered` flag)
- **Risk:** LOW - Well throttled

#### 1.3 Dialogue Responses
- **Function:** `generateDialogue()`
- **Trigger:** Player sends chat message (GameContext.tsx:910)
- **Frequency:** Once per player message
- **Throttling:**
  - ✅ Gemini service rate limiter (2.5s)
  - ❌ No local throttle - player can spam messages
- **Risk:** MEDIUM - Player could spam chat if typing fast
- **Dependency:** `state.dialogue?.history.length` - triggers on history change

#### 1.4 Curator Minigame Items
- **Function:** `generateCuratorItem()`
- **Trigger:** Queue below 3 items (GameContext.tsx:960)
- **Frequency:** When `queue.length < 3`
- **Throttling:**
  - ✅ Gemini service rate limiter only
  - ⚠️ Could theoretically trigger 3x in quick succession on minigame start
- **Risk:** LOW - Minigame is short-lived

---

### B. Player-Triggered Actions

#### 2.1 Pondering (Hold T)
- **Function:** `generatePondering()`
- **Trigger:** Player holds 'T' in golden zone (OverworldMap.tsx:233)
- **Frequency:** Manual, requires timing skill
- **Throttling:**
  - ✅ Requires hold-and-release timing (60-90% progress bar)
  - ✅ Gemini service rate limiter
- **Risk:** LOW - Player-limited by skill check

#### 2.2 Scrutinizing Objects (Hold T near object)
- **Function:** `generateScrutiny()`
- **Trigger:** Player holds 'T' near landmark (OverworldMap.tsx:260)
- **Frequency:** Manual, requires timing
- **Throttling:**
  - ✅ Same hold-timing requirement
  - ✅ Gemini service rate limiter
- **Risk:** LOW - Skill-gated

#### 2.3 Image Generation - Landmarks
- **Function:** `generateImpressionistImage()` (Imagen API)
- **Trigger:** Successful scrutiny of major landmarks (OverworldMap.tsx:266)
- **Frequency:** After scrutinizing landmarks with LANDMARKS[id] entry
- **Throttling:**
  - ✅ Requires successful scrutiny (skill check)
  - ✅ Only for specific landmarks
  - ⚠️ Uses same rate limiter as text (should be separate!)
- **Risk:** MEDIUM - Image API is more expensive than text

#### 2.4 Image Generation - Zone Observations
- **Function:** `generateImpressionistImage()` (Imagen API)
- **Trigger:** Clicking camera icon in UI (App.tsx:120)
- **Frequency:** Manual button click
- **Throttling:**
  - ✅ Cached per zone (`zone.observedImage`)
  - ✅ Gemini service rate limiter
  - ⚠️ Same rate limiter pool as text
- **Risk:** LOW - Cached, manual trigger

#### 2.5 Combat AI Responses
- **Function:** `generateCombatMove()`
- **Trigger:** Player plays a card in combat (CombatView.tsx:38)
- **Frequency:** Once per card played
- **Throttling:**
  - ✅ Gemini service rate limiter only
  - ❌ No combat-specific throttle
- **Risk:** MEDIUM - Player could play cards rapidly

#### 2.6 Telegraph Minigame
- **Function:** `generateTelegram()`
- **Trigger:** Activating telegraph device (OverworldMap.tsx:225)
- **Frequency:** When starting telegraph minigame
- **Throttling:**
  - ✅ Gemini service rate limiter
  - ✅ Manual trigger only
- **Risk:** LOW - Rare occurrence

---

## 2. Current Rate Limiting Analysis

### geminiService.ts Rate Limiter

```typescript
MIN_CALL_INTERVAL = 2500ms (2.5 seconds)
CIRCUIT_COOLDOWN = 60000ms (60 seconds on quota error)
```

**Mechanism:**
1. Enforces 2.5s minimum between ANY API call
2. If 429 (quota exceeded) error: opens circuit for 60s
3. All calls use same global rate limiter

**Issues:**
- ✅ Good: Prevents rapid-fire calls
- ⚠️ Issue: Text + Image share same limiter
- ⚠️ Issue: No distinction between cheap/expensive operations
- ⚠️ Issue: No per-user tracking

---

## 3. Potential Runaway Scenarios

### ❌ High Risk: None Found

### ⚠️ Medium Risk

1. **Dialogue Spam**
   - User could type very fast in chat
   - Each message triggers `generateDialogue()`
   - Mitigated by 2.5s rate limit but could queue up
   - **Recommendation:** Add local chat cooldown (e.g., 5s between messages)

2. **Combat Card Spam**
   - If player has many cards, could play rapidly
   - Each card triggers `generateCombatMove()`
   - **Recommendation:** Add turn delay or combat-specific throttle

3. **Image API Mixed with Text**
   - Imagen calls cost more but share rate limiter with text
   - Could impact budget unexpectedly
   - **Recommendation:** Separate rate limiters

### ✅ Low Risk

- Zone narratives: Cached, can't repeat
- NPC encounters: 60s cooldown per NPC
- Pondering/Scrutiny: Skill-gated timing
- Minigame triggers: Rare, player-initiated

---

## 4. Missing Features

### ❌ No Usage Tracking

Currently there is **NO system** for:
- Counting total API calls per session
- Tracking calls per user
- Monitoring costs
- Displaying usage to user
- Setting hard limits per session

### ❌ No Analytics

No data on:
- Which endpoints are called most
- Average calls per session
- Cost per user session
- Image vs text ratio

---

## 5. Recommendations

### Priority 1: Add Usage Tracking

```typescript
interface ApiUsageTracker {
  sessionStart: number;
  textCalls: number;
  imageCalls: number;
  totalCost: number; // Estimated
  callLog: { timestamp: number; type: string; endpoint: string }[];
  quotaRemaining?: number;
}
```

**Implementation:**
- Track in sessionStorage or State
- Display in settings/debug panel
- Log to localStorage for analytics
- Set soft cap (e.g., 50 calls per hour warning)

### Priority 2: Separate Rate Limiters

```typescript
const TEXT_RATE_LIMIT = 2500ms;
const IMAGE_RATE_LIMIT = 5000ms; // Images are more expensive

// Separate lastCallTime tracking
let lastTextCall = 0;
let lastImageCall = 0;
```

### Priority 3: Add Per-User Session Limits

```typescript
const MAX_CALLS_PER_SESSION = 100; // Soft cap
const MAX_IMAGE_CALLS = 20; // Hard limit

// Check before each call
if (usageTracker.totalCalls >= MAX_CALLS_PER_SESSION) {
  return fallback; // Graceful degradation
}
```

### Priority 4: Chat Throttling

```typescript
// In GameContext.tsx dialogue handler
const CHAT_COOLDOWN = 5000; // 5s between messages
let lastChatTime = 0;

// Check before calling generateDialogue()
if (Date.now() - lastChatTime < CHAT_COOLDOWN) {
  return; // Ignore message
}
```

### Priority 5: Cost Estimation

Add approximate cost tracking:
```typescript
const COSTS = {
  'gemini-2.5-flash': 0.0001, // Per call estimate
  'imagen-4.0': 0.04 // Per image estimate
};

totalCost += COSTS[model];
```

---

## 6. Current Safety Score: 7/10

### Strengths ✅
- Good basic rate limiting (2.5s)
- Circuit breaker for quota errors
- Fallback values for all calls
- Zone narrative caching
- NPC encounter cooldowns
- No infinite loops found

### Weaknesses ⚠️
- No usage tracking/analytics
- No per-session caps
- Text + Image share rate limiter
- Chat has no local throttle
- Combat has no turn delay
- No cost monitoring
- No user-facing usage display

---

## 7. Immediate Action Items

1. **Add usage counter to State** (30 min)
   - Track text vs image calls
   - Display in UI

2. **Separate image rate limiter** (15 min)
   - Different `lastImageCall` variable
   - Higher interval (5s)

3. **Add chat cooldown** (10 min)
   - 5s minimum between player messages

4. **Add session cap warning** (20 min)
   - Alert at 80% of soft cap
   - Graceful degradation at hard cap

5. **Create analytics export** (30 min)
   - Download usage log as JSON
   - Include timestamps, types, costs

**Total Implementation Time:** ~2 hours
