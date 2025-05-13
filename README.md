# Orbit - Your Personal AI Assistant

## Overview

Orbit is a comprehensive personal AI assistant designed to transform how you manage your day-to-day life. By combining intelligent note-taking, schedule management, emotional support, and accountability tools in one seamless experience, Orbit becomes your trusted companion for personal growth and productivity.

## Features

### Intelligent Note-Taking

- AI-powered note organization
- Semantic search capabilities
- Smart connections between related ideas
- Rich text editing

### Smart Schedule Management

- Natural language calendar management
- Event creation and reminders
- Appointment tracking through conversation
- Google Calendar integration

### Emotional Support & Growth

- Personalized motivation
- Emotional check-ins
- Progress visualization
- Adaptive feedback based on your communication style

### Accountability Partner

- Adaptive reminder system
- Habit tracking
- Goal management
- Response pattern learning

### Seamless Multi-Platform Experience

- Cross-device synchronization
- Offline capabilities
- Consistent UI/UX across platforms

## Tech Stack

### Frontend

- **Mobile**: Lynx Framework for native-like components and performance
- **Web**: Vite + React Router for fast, optimized CSR experience
- **Shared UI**: Tailwind CSS and Shadcn UI for beautiful, consistent design

### Backend

- Convex for real-time data synchronization
- Built-in authentication and serverless functions
- TanStack Query for sophisticated data fetching
- Vector embeddings for personalized knowledge graphs

### State Management

- Zustand for lightweight, performance-focused state management
- TanStack Form for type-safe form handling
- Adaptive notification system

## Monorepo Structure

This project uses a monorepo architecture to share code between web and mobile platforms:

- `/packages/core` - Shared business logic
- `/packages/ui` - Shared UI components
- `/apps/web` - Web application (Vite + React Router)
- `/apps/mobile` - Mobile application (Lynx)
- `/apps/server` - Backend server (Convex)

## Development

### Prerequisites

- Node.js 18 or higher
- [Bun](https://bun.sh/) package manager

### Installation

```bash
bun install
```

### Running the applications

To run all applications:

```bash
bun run dev
```

To run specific applications:

```bash
# Web app only (Vite + React Router)
bun run dev:web

# Mobile app only (Lynx)
bun run dev:mobile
```

### Mobile Development

When running the mobile app, scan the QR code with the Lynx Explorer App to see the mobile version on your device.

### Web Development

The web app is available at http://localhost:3000 when running. The web version uses:

- **Vite** - For lightning-fast development and optimized production builds
- **React Router** - For intuitive navigation and routing
- **Client-Side Rendering** - Optimized for authenticated user experiences

## Building for Production

```bash
bun run build
```

## Project Structure

The project is organized as a monorepo using Turborepo:

- `apps/mobile` - React Native mobile application
- `apps/convex` - Convex backend and serverless functions

## Privacy & Security

Orbit prioritizes user privacy with:

- End-to-end encryption for personal data
- LLM calls sanitized of personal identifiers
- Transparent AI processing
- No third-party data sharing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or feedback, please reach out to jaidhiman2000@gmail.com.
