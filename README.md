# 🍽️ The Intelligent Bistro

> An AI-powered restaurant ordering experience — where natural language meets fine dining.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Overview

The Intelligent Bistro is a high-fidelity mobile-first web app that lets users browse a restaurant menu and manage their cart through a **conversational AI interface**. Type natural language like *"Add two spicy chicken sandwiches and a large water"* and watch the AI parse your intent, update your cart, and respond with personality.

### Key Highlights

- **Natural Language Processing** — Custom-built NLP engine parses complex multi-item orders with quantities, sizes, and modifications
- **Dual Interaction Model** — Order via AI chat *or* traditional menu browsing — cart stays in sync across both
- **Structured JSON Responses** — Every AI response returns intent, actions, suggestions, and rich data (items, categories)
- **Luxury Dark UI** — Warm gold accents, glass morphism, smooth animations — designed for a premium feel
- **Mobile-First** — 430px viewport with safe-area-aware layout, touch-friendly controls

---

## 🏗️ Architecture

```
intelligent-bistro/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── server.js        # REST endpoints
│   │   ├── nlp-engine.js    # AI conversation engine
│   │   └── menu.js          # Menu data + helpers
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── main.jsx         # Entry point
│   │   └── styles.css       # Full design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

### Backend: NLP Engine

The conversational engine (`nlp-engine.js`) handles 12 intent types:

| Intent | Example Input | Response |
|--------|--------------|----------|
| `add_item` | *"Add two burgers and a lemonade"* | Parses items + quantities → cart actions |
| `remove_item` | *"Remove the salmon"* | Identifies item → removal action |
| `browse_menu` | *"Show me the menu"* | Returns all categories with metadata |
| `browse_category` | *"What starters do you have?"* | Returns items in category |
| `recommendation` | *"What do you recommend?"* | Chef's picks + popular items |
| `modify_item` | *"Change the burger to 3"* | Updates quantity in cart |
| `clear_cart` | *"Start over"* | Clears all items |
| `view_cart` | *"What's in my order?"* | Summarizes cart with totals |
| `greeting` | *"Hey there!"* | Warm welcome + suggestions |
| `item_inquiry` | *"Tell me about the filet mignon"* | Item details + dietary info |
| `dietary_filter` | *"Any vegetarian options?"* | Filtered items by dietary tag |
| `unknown` | *Anything else* | Graceful fallback + suggestions |

**Key NLP Features:**
- **Fuzzy alias matching** — "burger", "wagyu", "smash burger" all resolve to the same item
- **Number word parsing** — "two", "three", "a dozen" → numeric quantities
- **Size extraction** — "large water", "small lemonade" → size variants
- **Multi-item parsing** — "fries, a burger, and two cokes" parsed in one pass
- **Position-aware sorting** — Items matched in original text order

### Frontend: React SPA

- **Three views** via bottom navigation: Chat, Menu, Cart
- **Real-time cart sync** — AI actions and UI clicks both update the same state
- **Animated transitions** — Messages slide in, toasts pop, badges pulse
- **Suggestion chips** — Contextual follow-up actions after every AI response
- **Inline item cards** — Tappable cards with emoji, description, tags, and price

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/intelligent-bistro.git
cd intelligent-bistro

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Run

```bash
# Terminal 1: Start the API
cd backend
npm start
# → API running on http://localhost:3001

# Terminal 2: Start the frontend
cd frontend
npm run dev
# → App running on http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend automatically.

### 3. Try These Conversations

```
"Show me the menu"
"What do you recommend?"
"Add two spicy chicken sandwiches and a large water"
"Any vegetarian options?"
"Remove the water"
"What's in my cart?"
"I'll have a filet mignon and truffle fries"
"Start over"
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--accent` | `#c9a96e` | Warm gold — CTAs, highlights |
| `--font-display` | Playfair Display | Headlines, brand |
| `--font-body` | DM Sans | Body text, UI |
| `--font-mono` | JetBrains Mono | Prices, codes |
| `--radius-lg` | 16px | Cards, bubbles |

---

## 📡 API Reference

### `POST /api/chat`

The core AI endpoint.

**Request:**
```json
{
  "message": "Add two burgers and a lemonade",
  "cart": [{ "id": "truffle-fries", "name": "Truffle Fries", "quantity": 1, "price": 12.99 }]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intent": "add_item",
    "message": "Adding 2x Wagyu Smash Burger and Fresh Lemonade to your order...",
    "actions": [
      { "type": "add_to_cart", "item": { "itemId": "wagyu-burger", "name": "Wagyu Smash Burger", "quantity": 2, "price": 22.99 } },
      { "type": "add_to_cart", "item": { "itemId": "fresh-lemonade", "name": "Fresh Lemonade", "quantity": 1, "price": 5.99 } }
    ],
    "suggestions": ["View my cart", "Add a side", "What desserts do you have?"],
    "timestamp": "2026-05-18T..."
  }
}
```

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Full menu with all categories |
| GET | `/api/menu/categories` | Category list with metadata |
| GET | `/api/menu/category/:id` | Items in a specific category |
| GET | `/api/menu/item/:id` | Single item details |
| GET | `/api/menu/search?q=` | Search items by name/description |
| POST | `/api/checkout` | Place order → confirmation |

---

## 🛠️ AI Tools Used

This project was built with the assistance of **Claude** (Anthropic) as an AI coding partner:
- Architecture planning and component design
- NLP engine logic with comprehensive alias maps
- CSS design system with luxury aesthetic
- React state management patterns
- Test case generation and bug fixing

---

## 📄 License

MIT — build something delicious with it.
