# 🎯 DartKeeper

A modern, intuitive web application for tracking scores in popular darts games. Built for players who want a simple, efficient way to keep score on their mobile devices while playing on traditional felt dartboards.

## 🎮 Supported Games

- **Cricket** - Mark tracking with point calculation (15-20 + Bull)
- **301** - Classic countdown with bust detection
- **501** - Extended countdown with bust detection
- **Prisoner** - Sequential targeting (1-20) with prisoner mechanics
- **Golf** - 9-hole stroke play with scorecard

## ✨ Features

- 🎯 **Simple & Intuitive** - Easy-to-use interfaces designed for quick scoring
- 📱 **Mobile-First** - Optimized for phones and tablets
- 👥 **2-6 Players** - Supports multiple players per game
- ↩️ **Undo Functionality** - Easily correct mistakes
- 🏆 **Automatic Win Detection** - Instant winner announcements
- 🎨 **Pub-Themed Design** - Clean, modern aesthetic with darts/pub vibes
- ⚡ **Fast & Responsive** - Optimized performance with code splitting
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation
- 🔒 **Privacy-Focused** - No signup, no tracking, fully client-side

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 How to Play

### Cricket
**Objective:** Close all numbers (15-20 + Bull) and have the most points.

1. Hit each number 3 times to "close" it (/, X, ⊗)
2. After closing, additional hits score points (if opponent hasn't closed)
3. First to close all numbers with highest points wins
4. Tap a number to add a mark, tap again to remove

### 301 / 501
**Objective:** Count down from 301/501 to exactly 0.

1. Select the number and multiplier (single/double/triple) for each dart
2. Score is subtracted from your total
3. **Bust** if you go below 0 or land on 1 (turn reverts)
4. Must hit exactly 0 to win
5. Checkout suggestions shown when possible

### Prisoner
**Objective:** Hit numbers 1-20 in sequence.

1. Start at 1, progress through 2, 3, ... up to 20
2. **Valid Hit:** Outer single, double, or triple (advance to next number)
3. **Prisoner:** Inner single or bullseye (number becomes "prisoner")
4. Prisoners are freed when ANY player hits that number validly
5. First to complete all 20 numbers wins

### Golf
**Objective:** Complete 9 holes with the lowest stroke count.

1. Each hole = one number (1-9), Par 3 per hole
2. Count strokes (misses) until you hit the target
3. Tap "+1 Stroke" for each miss
4. Tap "✓ Hit Target" when you hit (adds final stroke)
5. Lowest total strokes after 9 holes wins

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **CSS Modules** - Scoped styling
- **Context API + useReducer** - State management

## 📁 Project Structure

```
dartkeeper/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── game/            # Game-specific components
│   │   └── layout/          # Layout components
│   ├── context/
│   │   └── GameContext.tsx  # Global state management
│   ├── logic/
│   │   ├── cricketLogic.ts
│   │   ├── scoreCountdownLogic.ts
│   │   ├── prisonerLogic.ts
│   │   └── golfLogic.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PlayerSetup.tsx
│   │   └── GameScreen.tsx
│   ├── styles/
│   │   ├── theme.ts         # Design tokens
│   │   ├── global.css       # Global styles
│   │   └── animations.css   # Animation utilities
│   └── types/
│       └── game.types.ts    # TypeScript definitions
├── netlify.toml             # Netlify configuration
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary:** Dark wood brown (#2C1810)
- **Secondary:** Muted brass/gold (#D4AF37)
- **Accent:** Dartboard green (#1B5E20)
- **Background:** Warm cream (#F5F1E8)
- **Success:** Green (#4CAF50)
- **Error:** Red (#E53935)

### Typography
- **Headings:** Oswald (bold, uppercase)
- **Body:** Open Sans (clean, readable)
- **Scores:** Roboto Mono (tabular numbers)

## 🧪 Testing

The app has been manually tested across:
- ✅ All 5 game types (complete game flows)
- ✅ Player management (add/remove, 2-6 players)
- ✅ Undo functionality (all games)
- ✅ Win detection and modals
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Edge cases (bust detection, ties, rapid actions)

## 🚀 Deployment

### Deploy to Netlify

**Option 1: Git-Based (Recommended)**
1. Push code to GitHub
2. Connect repository to Netlify
3. Build settings are auto-detected from `netlify.toml`
4. Deploy!

**Option 2: Manual Deploy**
1. Run `npm run build`
2. Drag `dist/` folder to Netlify dashboard
3. Done!

The app is fully static and requires no backend or environment variables.

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 🎯 Future Enhancements

Potential features for future versions:
- Game statistics and history
- Custom game rules/variants
- Dark mode toggle
- Sound effects (optional)
- PWA support (offline play)
- More game types (Around the Clock, Shanghai, etc.)

---

**Built with ❤️ for dart players everywhere**

Enjoy your games! 🎯
