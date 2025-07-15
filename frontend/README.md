# AI Avatar Frontend

A Next.js frontend for the AI Avatar MVP that allows users to create talking avatars through AI-powered conversations.

## Features

- Modern, responsive UI built with Next.js 14 and Tailwind CSS
- TypeScript for type safety
- Chat interface for user interactions
- Video player for AI-generated avatar videos
- Production-ready Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── ChatInterface.tsx  # Main chat component
│   ├── VideoPlayer.tsx    # Video display component
│   └── InputArea.tsx      # Message input component
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript definitions
│   └── utils.ts           # Helper functions
└── package.json
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel