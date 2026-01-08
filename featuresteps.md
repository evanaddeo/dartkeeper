# DartKeeper - Implementation Roadmap

This document breaks down the DartKeeper application development into **7 feature-sized implementation steps**. Each step is designed to be completable independently and builds upon previous steps. Follow these in order for optimal development flow.

---

## Step 1: Foundation & Core Architecture

**Goal:** Establish project foundation with routing, state management, styling system, and reusable components.

### Tasks:

#### 1.1 Project Setup & Configuration
- ✅ Vite + React + TypeScript already initialized
- Update `package.json` with additional dependencies:
  - `react-router-dom` for routing
  - Optional: `clsx` or `classnames` for conditional styling
- Create folder structure as specified in specs.md
- Configure `tsconfig.json` for strict type checking

#### 1.2 Styling System & Theme
- Create `src/styles/theme.ts`:
  - Export color palette (primary, secondary, accent, background, text, success, error)
  - Export typography settings (font families, sizes, weights)
  - Export spacing scale (4px, 8px, 16px, 24px, 32px, etc.)
  - Export border radius values
- Create `src/styles/global.css`:
  - CSS reset/normalize
  - Global styles (body, html)
  - CSS custom properties for theme colors
  - Base typography styles
  - Utility classes (if needed)

#### 1.3 Type Definitions
- Create `src/types/game.types.ts`:
  - Define `GameType` union type
  - Define `Player` interface
  - Define `GameState` interface
  - Define game-specific data interfaces:
    - `CricketData`
    - `ScoreCountdownData`
    - `PrisonerData`
    - `GolfData`
  - Define action types for state reducer

#### 1.4 Reusable UI Components
Create base components in `src/components/common/`:

- **Button.tsx:**
  - Props: `variant` (primary, secondary, danger), `size`, `onClick`, `disabled`, `children`
  - Styled according to pub theme
  - Hover, active, disabled states
  
- **Card.tsx:**
  - Props: `children`, `padding`, `shadow`
  - Reusable container with subtle shadow and rounded corners
  
- **Modal.tsx:**
  - Props: `isOpen`, `onClose`, `title`, `children`
  - Overlay with centered modal
  - Close button and backdrop click handling
  
- **Input.tsx:**
  - Props: `value`, `onChange`, `placeholder`, `autoFocus`
  - Styled text input for player names

#### 1.5 Routing Setup
- Configure React Router in `src/App.tsx`:
  - Route: `/` → HomePage
  - Route: `/setup/:gameType` → PlayerSetup
  - Route: `/game/:gameType` → GameScreen
- Create placeholder pages:
  - `src/pages/HomePage.tsx` (empty for now)
  - `src/pages/PlayerSetup.tsx` (empty for now)
  - `src/pages/GameScreen.tsx` (empty for now)

#### 1.6 State Management Setup
- Create `src/context/GameContext.tsx`:
  - Define initial state structure
  - Create `GameProvider` component with `useReducer`
  - Create game reducer function with action handlers (stub implementations)
  - Export `useGame` custom hook for consuming context
  - Actions to implement: 
    - `SET_GAME_TYPE`
    - `ADD_PLAYER`
    - `REMOVE_PLAYER`
    - `START_GAME`
    - `RECORD_ACTION` (game-specific)
    - `UNDO_ACTION`
    - `END_GAME`

**Deliverable:** Fully configured project with routing, theme, types, reusable components, and state management ready for game implementation.

---

## Step 2: Home Page & Player Setup Flow

**Goal:** Create game selection interface and player management system.

### Tasks:

#### 2.1 HomePage Component
Create `src/pages/HomePage.tsx`:

- **Layout:**
  - Header with "🎯 DartKeeper" title
  - Subtitle: "Track your darts games with ease"
  - Grid of 5 game selection cards

- **Game Selection Cards:**
  - Each card shows:
    - Game name (Cricket, 301, 501, Prisoner, Golf)
    - Brief 1-sentence description
    - Decorative icon/emoji
  - On click: Navigate to `/setup/:gameType`
  - Use `Card` component from Step 1
  - Responsive grid (2 columns mobile, 3 columns desktop)

- **Styling:**
  - Pub-themed color palette
  - Subtle wood texture on header
  - Brass-colored accents on cards
  - Hover effects on cards

#### 2.2 PlayerSetup Component
Create `src/pages/PlayerSetup.tsx`:

- **Header Section:**
  - Display selected game type
  - Back button to return to home
  
- **Player List Section:**
  - Display added players with names
  - Remove button (X) for each player
  - Show count: "2 players added" (minimum 2 required)
  
- **Add Player Section:**
  - Large "+ Add Player" button
  - When clicked:
    - Show inline input field (auto-focused)
    - Enter key or "Add" button adds player
    - Input clears and refocuses for next player
  - Use `Input` component from Step 1
  
- **Start Game Button:**
  - Disabled if < 2 players
  - On click:
    - Dispatch `START_GAME` action
    - Navigate to `/game/:gameType`
  - Prominent styling (large, green, brass border)

- **State Integration:**
  - Connect to `GameContext`
  - Dispatch `SET_GAME_TYPE` on component mount
  - Dispatch `ADD_PLAYER` when player added
  - Dispatch `REMOVE_PLAYER` when X clicked

#### 2.3 Layout Component
Create `src/components/layout/GameLayout.tsx`:

- Wrapper for game screens
- Header with game title
- Main content area
- Responsive padding and spacing
- Use across PlayerSetup and GameScreen

**Deliverable:** Fully functional home page and player setup flow. Users can select a game, add 2-6 players, and navigate to game screen.

---

## Step 3: 301/501 Game Implementation

**Goal:** Implement complete 301 and 501 game functionality with scoring, bust detection, and win conditions.

### Tasks:

#### 3.1 Game Logic Module
Create `src/logic/scoreCountdownLogic.ts`:

**Functions:**
```typescript
// Calculate dart value based on number and multiplier
calculateDartValue(number: number, multiplier: 1 | 2 | 3): number

// Subtract score and check for bust
subtractScore(currentScore: number, dartValue: number): { newScore: number, isBust: boolean }

// Check if player won (exactly 0)
checkWin(score: number): boolean

// Get checkout suggestions for scores < 170
getCheckoutSuggestions(score: number): string[]

// Validate dart input
validateDartInput(number: number, multiplier: number): boolean
```

- Implement bust detection (score < 0)
- Ensure exact 0 is win, not bust
- Include common checkout combinations data

#### 3.2 Score Input Component
Create `src/components/game/ScoreCountdownInput.tsx`:

**Layout:**
- Number grid: 1-20, 25 (bull), 50 (double bull)
- Multiplier selector: "×1 Single", "×2 Double", "×3 Triple" (radio buttons or toggle)
- Selected dart display: "20 × 2 = 40"
- "Confirm Dart" button
- Dart counter: "Dart 1 of 3", "Dart 2 of 3", "Dart 3 of 3"

**Interaction Flow:**
1. Player selects number from grid
2. Player selects multiplier
3. Selected dart value shown
4. Player clicks "Confirm Dart"
5. Score subtracts, dart counter increments
6. After 3 darts or bust, turn auto-advances to next player

**Features:**
- Visual feedback on number selection
- Auto-advance after 3rd dart
- Bust detection with red flash animation
- Score reverts to turn start on bust
- Clear current selections after confirm

#### 3.3 Score Display Component
Create `src/components/game/ScoreCountdownDisplay.tsx`:

**Display Elements:**
- Each player's name and remaining score (large, prominent)
- Current player highlighted (border, background color)
- Turn indicator: "Player's Turn"
- Optional: Checkout suggestions when score < 170
- Visual "BUST!" indicator when bust occurs

**Styling:**
- Card-based layout
- Current player: green accent border
- Large tabular numbers for scores
- Compact view for non-current players

#### 3.4 Game Screen Integration
Update `src/pages/GameScreen.tsx`:

- Conditionally render game-specific components based on `gameType`
- For 301/501:
  - Render `ScoreCountdownDisplay`
  - Render `ScoreCountdownInput`
  - Render "Undo" button
  - Render "End Game" button (with confirmation)
  
- **State Integration:**
  - Initialize game data with starting scores (301 or 501)
  - Handle dart input actions
  - Handle undo action
  - Detect win and show modal
  
- **Win Modal:**
  - Use `Modal` component from Step 1
  - Display winner name: "🎯 [Name] Wins!"
  - Show final scores for all players
  - Buttons: "New Game" (reset), "Home" (navigate to home)

#### 3.5 State Reducer Updates
Update `src/context/GameContext.tsx`:

- Implement `RECORD_301_DART` action:
  - Calculate dart value
  - Check for bust
  - Update score or revert on bust
  - Advance dart counter
  - Advance turn after 3 darts
  - Push state to history for undo
  
- Implement `UNDO_ACTION` for 301/501:
  - Pop last state from history
  - Restore previous state
  
- Implement win detection:
  - Check after each dart if score === 0
  - Set winner and game status to 'finished'

**Deliverable:** Fully functional 301 and 501 games with scoring, bust detection, undo, and win detection.

---

## Step 4: Cricket Game Implementation

**Goal:** Implement Cricket game with mark tracking, point calculation, and win detection.

### Tasks:

#### 4.1 Game Logic Module
Create `src/logic/cricketLogic.ts`:

**Functions:**
```typescript
// Add marks to a number for a player
addMark(marks: CricketMarks, playerId: string, number: number, count: number): CricketMarks

// Remove last mark from a number for a player
removeMark(marks: CricketMarks, playerId: string, number: number): CricketMarks

// Check if a number is closed for a player
isNumberClosed(marks: CricketMarks, playerId: string, number: number): boolean

// Calculate points scored for a hit (if number closed but opponent's isn't)
calculatePoints(marks: CricketMarks, playerId: string, number: number, players: Player[]): number

// Check if all numbers are closed for a player
allNumbersClosed(marks: CricketMarks, playerId: string): boolean

// Check if player has won Cricket
checkCricketWin(marks: CricketMarks, points: Record<string, number>, players: Player[]): string | null
```

**Game Rules Implementation:**
- Numbers: 15, 16, 17, 18, 19, 20, 25 (Bull)
- 3 marks closes a number
- Points scored only if your number closed and opponent's isn't
- Win: All closed + score ≥ opponents

#### 4.2 Cricket Board Component
Create `src/components/game/CricketBoard.tsx`:

**Layout:**
- Table/grid format with columns:
  - Number column (15, 16, 17, 18, 19, 20, Bull)
  - Player columns (one per player)
- Each cell shows marks for that player/number:
  - 1 mark: `/`
  - 2 marks: `X`
  - 3 marks: `⊗` or filled circle
  - 3+ marks: `⊗` + points indicator
- Points row at bottom showing total points per player
- Current player's column highlighted

**Interaction:**
- Click a number in current player's column to add mark
- Re-click same number to remove last mark (undo)
- Visual feedback on click (animation, flash)
- Disable input when game finished

#### 4.3 Cricket Input Component
Create `src/components/game/CricketInput.tsx`:

**Layout:**
- Large number buttons: 15, 16, 17, 18, 19, 20, Bull
- Display: "[Number] selected"
- Multiplier selector (optional alternative):
  - Quick buttons: "+1 Mark", "+2 Marks", "+3 Marks"
  - Or: Single, Double, Triple buttons
- "End Turn" button to manually advance turn

**Interaction Flow:**
1. Player taps number (e.g., 20)
2. Adds 1 mark to 20 for current player
3. If closed and opponent open, add points
4. Player can tap again to add more marks
5. Re-tapping removes last mark
6. Manual "End Turn" or auto-advance after period of inactivity

**Alternative Simpler Flow (Recommended):**
- CricketBoard IS the input (clicking numbers directly adds marks)
- No separate input component needed
- Just "End Turn" button below board

#### 4.4 State Reducer Updates
Update `src/context/GameContext.tsx`:

- Implement `RECORD_CRICKET_HIT` action:
  - Add marks using `addMark` logic
  - Calculate and add points if applicable
  - Push state to history
  - Check win condition
  
- Implement `UNDO_CRICKET_HIT` action:
  - Remove last mark using `removeMark` logic
  - Recalculate points
  
- Implement Cricket win detection:
  - Check after each hit
  - Set winner when condition met

#### 4.5 Game Screen Integration
Update `src/pages/GameScreen.tsx`:

- For Cricket game type:
  - Render `CricketBoard`
  - Render "End Turn" button
  - Render "Undo" button (or use re-click on board)
  - Handle win modal

**Deliverable:** Fully functional Cricket game with mark tracking, point calculation, undo, and win detection.

---

## Step 5: Prisoner & Golf Game Implementations

**Goal:** Implement Prisoner and Golf games to complete all 5 supported game types.

### Tasks:

#### 5.1 Prisoner Game Logic
Create `src/logic/prisonerLogic.ts`:

**Functions:**
```typescript
// Record a hit (valid or prisoner)
recordHit(gameData: PrisonerData, playerId: string, hitType: 'valid' | 'prisoner'): PrisonerData

// Advance player to next target number
advancePlayer(gameData: PrisonerData, playerId: string): PrisonerData

// Free all prisoners on a given number
freePrisoners(gameData: PrisonerData, number: number): PrisonerData

// Get current target number for a player
getCurrentTarget(gameData: PrisonerData, playerId: string): number

// Check if player has won (completed all 20 numbers)
checkPrisonerWin(gameData: PrisonerData, playerId: string): boolean
```

**Game Rules:**
- Sequential targets: 1 → 2 → 3 → ... → 20
- Valid hits: outer single, double, triple
- Prisoner: inner single, bullseye
- Prisoners freed when any player hits that number validly

#### 5.2 Prisoner Board Component
Create `src/components/game/PrisonerBoard.tsx`:

**Layout:**
- Each player's section:
  - Name
  - Current target number (large, prominent)
  - Progress bar: 1 → 2 → 3 → ... → 20 (completed numbers checked off)
  - Prisoner indicators: "⛓️ 5, 12" (numbers with prisoners)
  
**Input Section (below board):**
- Current player highlighted
- Buttons: "Hit Target ✓", "Prisoner ⛓️", "Miss"
- Click "Hit Target" → advances to next number, frees prisoners
- Click "Prisoner" → adds prisoner to current target
- Click "Miss" → no effect, just feedback

**Alternative Input:**
- Text display: "Throw at: [number]"
- Quick 3-button interface for rapid input

#### 5.3 Golf Game Logic
Create `src/logic/golfLogic.ts`:

**Functions:**
```typescript
// Increment strokes for current hole
incrementStrokes(gameData: GolfData, playerId: string, hole: number): GolfData

// Complete a hole for a player
completeHole(gameData: GolfData, playerId: string, hole: number, strokes: number): GolfData

// Check if all players completed current hole
allPlayersCompletedHole(gameData: GolfData, hole: number): boolean

// Advance to next hole
advanceHole(gameData: GolfData): GolfData

// Calculate score relative to par
calculateScore(strokes: number, par: number): number

// Check if game is over (all 9 holes completed)
checkGolfWin(gameData: GolfData): { isFinished: boolean, winner: string | null }
```

**Game Rules:**
- 9 holes (numbers 1-9)
- Par 3 per hole
- Count strokes until target hit
- Lowest total strokes wins

#### 5.4 Golf Scorecard Component
Create `src/components/game/GolfScorecard.tsx`:

**Layout:**
- Scorecard table:
  - Columns: Hole | Par | Player1 | Player2 | ...
  - Rows: 1-9 + Total
  - Display strokes per hole
  - Display total and +/- par
- Current hole highlighted
- Current player highlighted

**Input Section:**
- Display: "Hole [X] - Par 3"
- Display: "[Player Name]'s turn"
- Stroke counter: "Strokes: 0" (increments with each throw)
- Button: "+1 Stroke" (tap each time they throw and miss)
- Button: "Hit Target ✓" (completes hole with current stroke count + 1)

**Interaction Flow:**
1. Player throws at current hole number
2. Miss? Tap "+1 Stroke"
3. Hit? Tap "Hit Target ✓"
4. Strokes recorded, move to next player
5. When all players finish hole, advance to next hole
6. After hole 9, declare winner (lowest total)

#### 5.5 State Reducer Updates
Update `src/context/GameContext.tsx`:

- Implement actions for Prisoner:
  - `RECORD_PRISONER_HIT`
  - `ADVANCE_PRISONER_TARGET`
  - `FREE_PRISONERS`
  
- Implement actions for Golf:
  - `INCREMENT_GOLF_STROKES`
  - `COMPLETE_GOLF_HOLE`
  - `ADVANCE_GOLF_HOLE`
  
- Implement win detection for both games

#### 5.6 Game Screen Integration
Update `src/pages/GameScreen.tsx`:

- For Prisoner:
  - Render `PrisonerBoard`
  - Handle hit/prisoner/miss actions
  
- For Golf:
  - Render `GolfScorecard`
  - Handle stroke increment and hole completion

**Deliverable:** Fully functional Prisoner and Golf games, completing all 5 game types.

---

## Step 6: Polish, Responsiveness & Accessibility

**Goal:** Refine UI/UX, ensure mobile responsiveness, improve accessibility, and add finishing touches.

### Tasks:

#### 6.1 Responsive Design Pass
- Test all screens on mobile (375px), tablet (768px), desktop (1024px+)
- Adjust layouts for small screens:
  - Stack elements vertically on mobile
  - Use horizontal scrolling for player lists if needed
  - Ensure tap targets ≥ 44x44px
  - Optimize font sizes for readability
  
- Update components with responsive CSS:
  - Use CSS media queries
  - Flexbox/Grid for flexible layouts
  - Adjust spacing and padding per breakpoint

#### 6.2 Interaction Feedback & Animations
Add subtle animations for better UX:

- **Button interactions:**
  - Scale down on press (active state)
  - Color transition on hover
  - Disabled state styling
  
- **Score updates:**
  - Number count-up animation when score changes
  - Flash animation for new marks/hits
  - Shake animation for bust/error
  
- **Transitions:**
  - Fade transitions between pages (200ms)
  - Slide-up animation for modal
  - Smooth highlight transition for current player

**Implementation:**
- CSS transitions for simple effects
- `framer-motion` library for complex animations (optional)
- Keep animations fast (<300ms) to maintain gameplay speed

#### 6.3 Accessibility Improvements
- **Keyboard Navigation:**
  - Ensure all interactive elements focusable (tabindex)
  - Add focus visible styles (outline, ring)
  - Implement keyboard shortcuts for common actions (optional)
  
- **Screen Reader Support:**
  - Add ARIA labels to all buttons
  - Use semantic HTML (button, nav, main, etc.)
  - Announce score changes to screen readers (aria-live regions)
  
- **Color & Contrast:**
  - Verify all text meets WCAG AA contrast ratios (4.5:1)
  - Don't rely solely on color for information
  - Add visual indicators beyond color (icons, text)
  
- **Touch Targets:**
  - Ensure all buttons ≥ 44x44px
  - Add adequate spacing between tap targets

#### 6.4 Error Handling & Edge Cases
- **Input Validation:**
  - Prevent invalid dart selections
  - Disable actions when game finished
  - Confirm before ending game early
  
- **Empty States:**
  - Message when no players added yet
  - Helpful prompts for first-time users
  
- **Error Messages:**
  - Clear, friendly error messages
  - Auto-dismiss after few seconds
  - Toast notification system (optional)

#### 6.5 Visual Polish
- **Header:**
  - Add subtle wood texture background
  - Brass-colored border at bottom
  - Responsive logo/title sizing
  
- **Cards:**
  - Subtle shadow on hover
  - Smooth transitions
  - Consistent padding and spacing
  
- **Typography:**
  - Ensure readability (line height, letter spacing)
  - Consistent heading hierarchy
  - Tabular numbers for score displays
  
- **Icons & Emojis:**
  - Add relevant icons/emojis for visual interest
  - Keep it subtle (don't overdo it)

#### 6.6 Loading & Performance
- **Code Splitting:**
  - Lazy load game-specific components
  - Only load required game logic module
  
- **Image Optimization:**
  - Compress any images used
  - Use SVG for icons where possible
  
- **Bundle Size:**
  - Audit bundle with `vite-bundle-analyzer`
  - Remove unused dependencies
  - Tree-shake where possible

**Deliverable:** Polished, responsive, accessible app ready for production deployment.

---

## Step 7: Testing, Documentation & Deployment

**Goal:** Finalize app with testing, update documentation, and deploy to Netlify.

### Tasks:

#### 7.1 Manual Testing
Create testing checklist and verify:

**Game Functionality:**
- [ ] Cricket: Mark tracking, point calculation, win detection
- [ ] 301: Score subtraction, bust detection, win detection
- [ ] 501: Same as 301 with different starting score
- [ ] Prisoner: Sequential targeting, prisoners, win detection
- [ ] Golf: Stroke tracking, hole advancement, win detection

**Core Features:**
- [ ] Player management (add, remove)
- [ ] Turn rotation (correct order)
- [ ] Undo functionality (all games)
- [ ] Win modal display and actions
- [ ] Navigation (all routes work)

**Responsive Design:**
- [ ] Mobile (375px): Layout, tap targets, readability
- [ ] Tablet (768px): Layout optimization
- [ ] Desktop (1024px+): Full experience

**Edge Cases:**
- [ ] Minimum players (2)
- [ ] Maximum players (6)
- [ ] Bust on first dart of turn
- [ ] Multiple rapid undos
- [ ] Win with exact score
- [ ] Tie games (Cricket, Golf)

#### 7.2 Automated Testing (Optional)
If time permits, add basic tests:

- **Unit Tests:**
  - Game logic functions (cricketLogic, scoreCountdownLogic, etc.)
  - Utility functions
  - Use Jest
  
- **Component Tests:**
  - Button, Modal, Input components
  - Use React Testing Library
  
- **Integration Tests:**
  - Complete game flow (setup → play → win)
  - Player addition/removal
  
**Test Coverage Goal:** > 70% for logic modules

#### 7.3 Documentation Updates
Update project documentation:

- **README.md:**
  - Update with project description
  - Add "How to Play" section for each game
  - Include screenshots (optional)
  - Development setup instructions
  - Deployment instructions
  - Tech stack summary
  
- **Code Comments:**
  - Add JSDoc comments to all exported functions
  - Document complex game logic
  - Add inline comments for non-obvious code

#### 7.4 Final Code Cleanup
- Remove console.logs
- Remove unused imports and variables
- Format all code with Prettier
- Run ESLint and fix all warnings
- Remove commented-out code
- Ensure consistent naming conventions

#### 7.5 Deployment Setup
- **Verify netlify.toml:**
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
  
- **Environment Variables:**
  - None required for V1 (fully client-side)
  
- **Build Test:**
  - Run `npm run build` locally
  - Verify `dist/` folder generated correctly
  - Test built version with `npm run preview`

#### 7.6 Deploy to Netlify
**Option A: Manual Deploy**
1. Build project: `npm run build`
2. Drag `dist` folder to Netlify dashboard
3. Test deployed URL

**Option B: Git-Based Deploy (Recommended)**
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Trigger deploy
5. Set up continuous deployment (auto-deploy on push)

**Post-Deploy:**
- Test all functionality on live URL
- Test on real mobile devices
- Share with friends for feedback
- Monitor Netlify logs for errors

#### 7.7 Final Checklist
- [ ] All 5 games working correctly
- [ ] No console errors in production build
- [ ] Responsive on all device sizes
- [ ] Accessible (keyboard nav, screen readers)
- [ ] Fast load time (< 3s)
- [ ] Documentation updated
- [ ] Deployed to Netlify successfully
- [ ] Live URL tested and working

**Deliverable:** Fully deployed, production-ready DartKeeper application accessible via Netlify URL.

---

## Implementation Timeline Estimate

- **Step 1 (Foundation):** 4-6 hours
- **Step 2 (Home & Setup):** 3-4 hours
- **Step 3 (301/501):** 5-6 hours
- **Step 4 (Cricket):** 4-5 hours
- **Step 5 (Prisoner & Golf):** 6-8 hours
- **Step 6 (Polish):** 4-5 hours
- **Step 7 (Testing & Deploy):** 2-3 hours

**Total:** ~28-37 hours for complete implementation

---

## Development Tips

### For AI Implementation:
1. **Start simple, iterate:** Get basic functionality working before adding polish
2. **Type-safety first:** Define types before implementing features
3. **Component reuse:** Use established components (Button, Card, Modal) consistently
4. **Test as you go:** Manually test each feature immediately after implementing
5. **One game at a time:** Complete each game fully before moving to next
6. **State management:** Keep state updates in reducer, keep components presentational
7. **Responsive from start:** Don't wait until end to make responsive

### Common Pitfalls to Avoid:
- ❌ Implementing all games simultaneously (confusing)
- ❌ Skipping type definitions (causes errors later)
- ❌ Ignoring mobile layout until end (requires refactoring)
- ❌ Over-animating (slows down gameplay)
- ❌ Complex state management (keep it simple with useReducer)
- ❌ Forgetting undo history (implement with each feature)

### Success Indicators:
- ✅ Can play a full game without confusion
- ✅ Undo catches user mistakes effectively
- ✅ Win detection is accurate and instant
- ✅ App feels fast and responsive
- ✅ Works smoothly on mobile devices
- ✅ UI is pleasant and "pub-like"

---

**End of Implementation Roadmap**

