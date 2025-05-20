
# Arden: Your Personal AI Assistant

## Vision & Mission

Arden is a comprehensive personal AI assistant designed to transform how you manage your day-to-day life. By combining intelligent note-taking, schedule management, emotional support, and accountability tools in one seamless experience, Arden becomes your trusted companion for personal growth and productivity.

Our mission is to create an AI assistant that truly understands you, adapts to your needs, and helps you achieve your goals while maintaining your privacy and security.

## Key Features

- **Intelligent Note-Taking**: Transform thoughts into organized knowledge with AI-powered organization and semantic search
- **Smart Schedule Management**: Effortlessly manage your calendar with natural language processing
- **Emotional Support & Growth**: Receive personalized motivation and progress visualization
- **Accountability Partner**: Stay on track with your goals through adaptive reminders and habit tracking
- **Seamless Experience**: Access your personal AI assistant across devices with perfect synchronization

## Technology Stack

### Frontend
- **React Native & Expo**: Cross-platform mobile development
- **Expo Router**: File-system based navigation
- **StyleSheet API**: App-wide consistent styling
- **Lucide Icons**: Beautiful iconography
- **Moti**: Declarative animations

### State Management
- **Zustand**: Lightweight state management
- **MMKV**: High-performance local storage
- **TanStack Query**: Data fetching and synchronization
- **TanStack Form**: Type-safe form handling

### Backend
- **Convex**: Real-time data synchronization with built-in authentication
- **Vector Embeddings**: Personalized knowledge graph
- **Claude 3.7 Sonnet**: Advanced language model integration

## Getting Started

### Prerequisites
- Node.js 18+ and Bun
- iOS Simulator or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/Jai-Dhiman/Arden.git
cd Arden

# Install dependencies
bun install

# Start the development server
bun run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```
CONVEX_DEPLOYMENT=your-convex-deployment-url
CLAUDE_API_KEY=your-claude-api-key
```

## Project Structure

```
Arden/
├── packages/          # Shared code packages
│   ├── core/          # Business logic
│   └── ui/            # UI components
├── apps/
│   ├── mobile/        # Expo React Native app
│   │   ├── app/       # Expo Router directory
│   │   └── src/       # Application source code
│   └── server/        # Backend services
└── README.md          # You are here
```

## Development Workflow

- **Development**: `bun run dev` (starts Expo dev server)
- **Build**: `bun run build` (builds production-ready app)
- **Deploy**: `bun run deploy` (deploys to EAS)

## Privacy & Security

Arden implements:
- End-to-end encryption for all personal data
- LLM calls sanitized of personal identifiers
- No data sharing with third parties
