# DartKeeper - Complete Application Specification

## 1. Overview

**DartKeeper** is a modern, intuitive web application for tracking scores in traditional darts games played on felt dartboards. The app eliminates manual calculations and provides a seamless scorekeeping experience with an easy-to-use interface and subtle pub-themed aesthetic.

### Core Philosophy
- **Zero mental overhead**: Players focus on darts, not arithmetic
- **Intuitive interactions**: Tap-based, error-forgiving UX
- **Visual clarity**: All game state visible at a glance
- **Speed**: Quick entry, minimal steps between throws

---

## 2. Supported Games

### 2.1 Cricket (Standard)

**Objective:** Close all target numbers (15-20 + Bullseye) and have equal or higher score than opponents.

**Rules:**
- Target numbers: 15, 16, 17, 18, 19, 20, and Bullseye (25)
- Each number requires 3 "marks" to close
- Marks: Single hit = 1 mark, Double = 2 marks, Triple = 3 marks
- Once YOUR number is closed but opponent's isn't:
  - Additional hits score points (e.g., hitting closed 20 scores 20 points)
  - Once opponent also closes that number, no more points can be scored on it
- **Win condition:** All numbers closed AND score ≥ all opponents' scores

**Scoring Examples:**
- Player 1 hits single 20 three times → 20 is closed
- Player 1 hits 20 again (opponent hasn't closed) → +20 points
- Player 2 closes their 20 → No more points can be scored on 20 by anyone

**UI/UX Requirements:**
- Display grid/list showing numbers 15-20 + Bull
- Each number shows marks per player (visual: /, X, ⊗ for 1/2/3 marks)
- Display running point totals prominently
- **Input method:** Tap a number to add 1 mark, tap again to add another mark, etc.
- **Undo method:** Re-tap the same number to remove the last mark added
- Clearly indicate which numbers are "closed" vs "open"
- Show which player's turn it is
- Auto-detect win and display celebration message

---

### 2.2 301 Game

**Objective:** Reduce score from 301 to exactly 0.

**Rules:**
- Starting score: 301
- Players throw 3 darts per turn
- Each dart's value is subtracted from current score
- **Bust rule:** If score goes below 0 or equals negative, it's a "bust"
  - Turn is voided, score reverts to value at START of turn
- **No double-out requirement:** Game ends when player reaches exactly 0
- **Win condition:** First player to reach exactly 0

**Scoring:**
- Dartboard sections: 1-20, plus 25 (single bull), 50 (double bull/bullseye)
- Multipliers: Single (1x), Double (2x), Triple (3x)
- Special: Outer bull = 25, Inner bull/Bullseye = 50

**UI/UX Requirements:**
- Display each player's current remaining score (large, prominent)
- **Input method:** For each dart:
  - Player selects board number (1-20) or bull (25/50)
  - Player selects multiplier: Single, Double, or Triple
  - App calculates value and subtracts automatically
- Show "3 darts remaining" counter for current turn
- After 3 darts, auto-advance to next player
- **Undo:** Undo button reverts last dart entry
- Visual feedback for bust (red flash, "BUST!" message, score reverts)
- Suggest/display possible checkout combinations when score < 170
- Auto-detect exact 0 and declare winner

**Suggested Input UI:**
- Option A: Visual dartboard with tap regions for singles/doubles/triples
- Option B: Number grid (1-20, 25, 50) + modifier buttons (×1, ×2, ×3)
- **Recommended:** Option B for speed and accuracy on mobile

---

### 2.3 501 Game

**Identical to 301, except:**
- Starting score: 501
- All other rules, UI/UX identical to 301

---

### 2.4 Prisoner

**Objective:** Be the first to hit all numbers 1-20 in sequential order.

**Rules:**
- Players must hit numbers in order: 1, 2, 3, ..., 20
- Only certain areas count as valid hits:
  - **Valid:** Outer single, Double ring, Triple ring
  - **Invalid (becomes prisoner):** Inner single ring, Bullseye area
- When a dart lands in inner single or bullseye:
  - That dart becomes a "prisoner" 
  - It remains "captured" until ANY player hits that number's valid area
  - When number is hit validly, all prisoners on that number are "freed"
- Players must complete their current number before advancing
- **Win condition:** First player to validly hit all numbers 1-20 in order

**Scoring Examples:**
- Player 1 needs number 5, throws:
  - Dart 1: Hits outer single 5 → Valid! Advances to number 6
  - Dart 2: Hits inner single 6 → Prisoner! Must hit 6 again
  - Dart 3: Hits double 6 → Valid! Advances to number 7
- Player 2 hits outer single 6 → Frees Player 1's prisoner dart

**UI/UX Requirements:**
- Display each player's current target number (large, prominent)
- Show progress track: 1→2→3→...→20 with completed numbers marked
- Visual indicator for "prisoner" darts (red icon/badge)
- List of captured prisoner numbers per player
- **Input method:** 
  - After player throws, tap target number + hit type (valid/prisoner)
  - Or: Quick buttons: "Hit!", "Prisoner", "Miss"
- **Undo:** Revert last hit entry
- Auto-advance turn after player indicates throw complete
- Auto-detect win when player completes #20

---

### 2.5 Golf (9 Holes)

**Objective:** Complete 9 "holes" in the fewest total "strokes" (darts thrown).

**Rules:**
- 9 holes represented by numbers 1-9 on dartboard
- Par = 3 strokes per hole (standard)
- Players throw darts at current hole number until hit
- Count strokes (darts) per hole
- After all players complete hole, move to next hole
- **Scoring:** Under par = good, over par = bad
- **Win condition:** Lowest total strokes after 9 holes

**Hole Completion:**
- Any hit on the target number (single, double, or triple) completes the hole
- Miss = add 1 stroke, keep throwing

**Scoring Example:**
- Hole 1 (target: 1):
  - Player A: Misses twice, hits on 3rd dart → 3 strokes (par)
  - Player B: Hits on 1st dart → 1 stroke (2 under par!)
- Hole 2 (target: 2):
  - Player A: Misses four times, hits on 5th dart → 5 strokes (+2 over par)

**UI/UX Requirements:**
- Display current hole number (1-9) prominently
- Show par for current hole
- Display scorecard: hole-by-hole strokes for each player
- Show running total strokes and +/- relative to par
- **Input method:** 
  - Increment "Strokes" button each dart thrown
  - "Hole Complete" button when player hits target
- **Undo:** Decrement stroke count
- Auto-advance to next hole after all players finish current hole
- Display final scorecard and winner after hole 9

---

## 3. Global Features & UX Patterns

### 3.1 Player Management

**Requirements:**
- Support 2-6 players per game
- Quick player addition flow
- No authentication or persistent profiles needed

**Add Player Flow:**
1. Tap prominent "+" button (visible before game starts)
2. Inline text input appears immediately (auto-focused)
3. Type name, press Enter or tap "Add"
4. Player added to list instantly
5. Repeat for additional players

**Player List Display:**
- Show all players with names
- Indicate current player (highlight, arrow, or badge)
- Optional: Ability to remove player before game starts (X button)
- NO editing/removing during active game

---

### 3.2 Game Flow

**Pre-Game:**
1. Landing page: "DartKeeper" title + game selection buttons
2. Select game type (Cricket, 301, 501, Prisoner, Golf)
3. Add players (min 2, max 6)
4. Tap "Start Game" button
5. Enter game screen

**During Game:**
- Display current player prominently (name, highlighted)
- Show all player scores/status
- Input area for entering throw results
- "Undo" button always accessible
- Turn automatically advances after player completes their throws

**Post-Game:**
- Detect win condition automatically
- Display winner celebration screen
- Show final scores/statistics
- Options: "New Game" (same game type) or "Home" (game selection)

---

### 3.3 Undo Functionality

**Cricket:**
- Re-clicking a number removes the last mark added to that number
- Example: Player has 2 marks on 20, taps 20 again → adds 3rd mark. If mistake, tap 20 once more → removes that 3rd mark

**301/501/Prisoner/Golf:**
- Dedicated "Undo" button
- Clicking undo reverts the last action/dart entry
- Visual feedback showing what was undone
- Allow multiple undo levels (at least 3-5 actions back)

**Implementation Note:**
- Maintain action history stack per turn/game
- Undo pops last action and restores previous state

---

### 3.4 Win Detection

**Automatic win detection for all games:**
- Continuously evaluate win conditions after each input
- When win detected:
  1. Stop accepting further input
  2. Display overlay/modal with winner announcement
  3. Show final scores
  4. Provide "Play Again" and "Home" buttons

**Win Messages:**
- "🎯 [Player Name] Wins!"
- Show game-specific stats (e.g., total points in Cricket, final scores)

---

## 4. UI/UX Design Specifications

### 4.1 Visual Theme: Modern Pub Aesthetic

**Color Palette:**
- **Primary (dark wood):** `#2C1810` - dark brown
- **Secondary (brass/gold):** `#D4AF37` - muted gold
- **Accent (dartboard green):** `#1B5E20` - deep green
- **Background:** `#F5F1E8` - warm cream/off-white
- **Text (light):** `#F5F1E8` - cream
- **Text (dark):** `#2C1810` - dark brown
- **Success:** `#4CAF50` - green
- **Error/Bust:** `#E53935` - red
- **Neutral:** `#6D4C41` - medium brown

**Typography:**
- **Headings:** Bold, sans-serif (e.g., "Roboto Condensed", "Oswald")
- **Body/Scores:** Clean, legible sans-serif (e.g., "Open Sans", "Roboto")
- **Score displays:** Tabular numbers for alignment

**Visual Elements:**
- Subtle wood texture on headers/navigation
- Brass-colored borders for cards/sections
- Dartboard green accents for buttons/highlights
- Card-based layout with subtle shadows
- Rounded corners (border-radius: 8-12px)

---

### 4.2 Layout & Responsive Design

**Desktop (≥1024px):**
- Sidebar: Game info, player list
- Main area: Scoring interface, large and spacious
- Bottom: Action buttons (Undo, End Turn, etc.)

**Tablet (768px - 1023px):**
- Top bar: Game info
- Main area: Scoring interface
- Player list: Collapsible or horizontal scroll
- Bottom: Action buttons

**Mobile (≤767px):**
- Vertical stack layout
- Current player + score at top
- Scoring input optimized for thumb reach
- Other players' scores collapsible/scrollable
- Large tap targets (min 44x44px)

**Responsive Priorities:**
- Touch-first design for mobile
- Large, tappable buttons
- Clear visual hierarchy
- Minimal scrolling required

---

### 4.3 Component Structure

**Suggested Component Hierarchy:**

```
App
├── Router
│   ├── HomePage
│   │   └── GameSelector (Cricket, 301, 501, Prisoner, Golf)
│   ├── PlayerSetup
│   │   ├── PlayerList
│   │   └── AddPlayerButton
│   └── GameScreen
│       ├── GameHeader (title, current game type)
│       ├── PlayerStatusBar (all players, highlight current)
│       ├── ScoreDisplay (game-specific layout)
│       ├── InputArea (game-specific controls)
│       │   ├── CricketInput (number grid)
│       │   ├── 301501Input (dartboard or number grid + modifiers)
│       │   ├── PrisonerInput (hit/prisoner/miss buttons)
│       │   └── GolfInput (stroke counter + complete button)
│       ├── ActionButtons (Undo, End Turn, etc.)
│       └── WinModal (victory screen)
```

---

### 4.4 Interaction Patterns

**Feedback:**
- **Tap/Click:** Subtle scale animation (scale: 0.95) + color change
- **Success:** Green flash or checkmark animation
- **Error/Bust:** Red flash + shake animation
- **Score update:** Number count-up animation (fast)

**Loading & Transitions:**
- Page transitions: Fast fade (150-200ms)
- Score changes: Smooth number increment/decrement
- Modal appear: Slide-up + fade-in
- No slow animations (keep gameplay fast)

**Accessibility:**
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators for keyboard navigation
- ARIA labels for screen readers
- Touch targets ≥ 44x44px

---

## 5. Technical Architecture

### 5.1 Tech Stack

**Framework:** React 18+ with TypeScript
**Build Tool:** Vite
**Styling:** CSS Modules or Styled-Components
**State Management:** React Context API + useReducer (no Redux needed)
**Routing:** React Router v6
**Deployment:** Netlify (configured with netlify.toml)
**Testing:** Jest + React Testing Library (optional)

---

### 5.2 State Management Strategy

**Global State (Context):**
- Current game type
- Players array (name, id, scores, game-specific data)
- Current player index
- Game state (pre-game, in-progress, finished)
- Winner info

**Game-Specific State:**
- **Cricket:** marks per number per player, points per player
- **301/501:** remaining score per player, current turn darts
- **Prisoner:** current target per player, prisoner list
- **Golf:** current hole, strokes per hole per player

**Action History (for undo):**
- Stack of previous states
- Undo pops last state and restores

**State Structure Example:**

```typescript
interface GameState {
  gameType: 'cricket' | '301' | '501' | 'prisoner' | 'golf';
  players: Player[];
  currentPlayerIndex: number;
  gameStatus: 'setup' | 'playing' | 'finished';
  winner: Player | null;
  gameData: CricketData | ScoreCountdownData | PrisonerData | GolfData;
  history: GameState[]; // For undo
}

interface Player {
  id: string;
  name: string;
}

interface CricketData {
  marks: Record<string, Record<number, number>>; // playerId -> number -> mark count
  points: Record<string, number>; // playerId -> points
}

interface ScoreCountdownData {
  startingScore: 301 | 501;
  remainingScores: Record<string, number>; // playerId -> remaining
  currentTurnDarts: number; // 0-3
  turnStartScore: number; // For bust detection
}

// ... similar for Prisoner and Golf
```

---

### 5.3 Key Functions & Logic

**Game Logic Modules:**

1. **cricketLogic.ts**
   - `addMark(playerId, number, marks)`: Add marks to number
   - `removeMark(playerId, number)`: Undo last mark
   - `calculatePoints(marks, number, playerId)`: Calculate points scored
   - `checkCricketWin(playerData)`: Check win condition
   - `isNumberClosed(playerId, number)`: Check if number closed

2. **scoreCountdownLogic.ts (301/501)**
   - `subtractScore(current, dartValue)`: Calculate new score
   - `checkBust(newScore)`: Detect bust condition
   - `checkWin(score)`: Check if exactly 0
   - `calculateDartValue(number, multiplier)`: Calculate dart value
   - `getCheckoutSuggestions(score)`: Suggest finish combinations

3. **prisonerLogic.ts**
   - `recordHit(playerId, hitType)`: Record valid hit or prisoner
   - `advancePlayer(playerId)`: Move to next target number
   - `freePrisoners(number)`: Release prisoners when number hit
   - `checkPrisonerWin(playerId, targetNumber)`: Check if won

4. **golfLogic.ts**
   - `incrementStrokes(playerId, hole)`: Add stroke
   - `completeHole(playerId, hole, strokes)`: Record hole completion
   - `advanceHole()`: Move to next hole
   - `checkGolfWin(currentHole, allPlayersCompleted)`: Check if game over
   - `calculateScore(strokes, par)`: Calculate +/- par

---

### 5.4 File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── game/
│   │   ├── CricketBoard.tsx
│   │   ├── ScoreCountdownInput.tsx
│   │   ├── PrisonerBoard.tsx
│   │   ├── GolfScorecard.tsx
│   │   └── PlayerStatusBar.tsx
│   └── layout/
│       ├── Header.tsx
│       └── GameLayout.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── PlayerSetup.tsx
│   └── GameScreen.tsx
├── context/
│   └── GameContext.tsx
├── logic/
│   ├── cricketLogic.ts
│   ├── scoreCountdownLogic.ts
│   ├── prisonerLogic.ts
│   └── golfLogic.ts
├── types/
│   └── game.types.ts
├── styles/
│   ├── theme.ts (color palette, typography)
│   └── global.css
├── App.tsx
└── main.tsx
```

---

## 6. Edge Cases & Error Handling

### 6.1 Input Validation

- Prevent negative scores in 301/501
- Validate number ranges (1-20, 25, 50)
- Ensure valid multiplier selections
- Prevent actions when game is finished

### 6.2 Edge Cases

**Cricket:**
- Closing all numbers but opponent has more points → game continues
- Re-clicking number with 0 marks → no effect
- Hitting closed number when opponent also closed → no points

**301/501:**
- Bust on exact 0 attempt (e.g., score 32, throw 32) → NO bust, WIN
- Bust reverts to TURN START, not previous dart
- No negative scores displayed

**Prisoner:**
- Multiple prisoners on same number → all freed when number hit
- Player can free their own prisoners
- Hitting correct number validates before freeing prisoners

**Golf:**
- Hole-in-one → 1 stroke
- Max strokes per hole: No limit, but UI should handle large numbers
- Display total and per-hole scores clearly

### 6.3 Error Messages

- "Invalid input" (rare, mostly validation prevents this)
- "Game already finished" if action attempted post-win
- Network errors: N/A (fully client-side app)

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Initial load: < 3 seconds
- Interaction response: < 100ms
- Smooth 60fps animations
- Optimized bundle size (code splitting by game type)

### 7.2 Browser Support

- Modern browsers: Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile browsers: iOS Safari, Chrome Mobile
- No IE11 support required

### 7.3 Accessibility

- Keyboard navigation support
- Screen reader compatible (ARIA labels)
- WCAG 2.1 Level AA compliance
- Touch targets ≥ 44x44px

---

## 8. Future Enhancements (Out of Scope for V1)

- Game history / statistics tracking
- Multiple simultaneous games
- Custom game rule variations
- Sound effects / haptic feedback
- Dark mode toggle
- Multiplayer over network
- Tournament bracket mode
- Animated dartboard visualization
- Voice input for scoring
- Apple Watch / wearable companion

---

## 9. Success Criteria

**The app is successful if:**
1. Players can complete a full game of any type without confusion
2. Score entry is faster than mental math
3. Zero ambiguity about current game state
4. Undo functionality catches 100% of user errors
5. Win detection is instantaneous and accurate
6. UI is pleasant and "pub-like" without being kitschy
7. App works smoothly on phones held in one hand

---

## 10. Implementation Notes for AI

**When implementing:**
- Start with simplest game (301) to establish patterns
- Build reusable components (Button, Card, Modal)
- Implement state management early (Context + useReducer)
- Create one game fully before moving to next
- Test undo functionality thoroughly
- Ensure responsive design from the start
- Use TypeScript strictly (no `any` types)
- Add inline comments for complex game logic
- Keep components small and focused (< 200 lines)

**Testing priorities:**
1. Win detection accuracy (all games)
2. Bust logic (301/501)
3. Undo functionality (all games)
4. Multi-player turn rotation
5. Responsive layout breakpoints

**Deployment:**
- Ensure `netlify.toml` configured correctly
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect rules configured

---

## Appendix A: Glossary

**Bust:** In 301/501, going below 0 or failing to finish on required target
**Mark:** In Cricket, a hit on a target number (need 3 to close)
**Close:** In Cricket, achieving 3 marks on a number
**Prisoner:** In Prisoner, a dart that landed in invalid area and must be freed
**Stroke:** In Golf, a single dart thrown (analogous to golf stroke)
**Par:** In Golf, target number of strokes per hole (typically 3)
**Checkout:** In 301/501, the final combination to reach exactly 0

---

**End of Specification**

