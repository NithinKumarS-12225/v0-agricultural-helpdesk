# AI Call Agent - Complete Implementation Guide

## Overview
The AI Call Agent is a fully-functional live chat system with complete offline support, voice input/output, and automatic synchronization when internet returns.

## Architecture

### Core Components

1. **AICallAgentModal** (`/components/AICallAgentModal.tsx`)
   - Main UI component for the call agent interface
   - Handles message display, input, voice controls
   - Manages online/offline status
   - Integrates all utilities

2. **IndexedDB Manager** (`/lib/indexeddb.ts`)
   - Database: `kisan-ai-db`
   - Object Stores:
     - `queries`: Stores all user queries (pending/completed)
     - `responses`: Stores AI responses linked to queries
   - Handles CRUD operations for offline persistence

3. **Voice Assistant** (`/lib/voice-assistant.ts`)
   - Web Speech API wrapper
   - SpeechRecognition for voice input
   - SpeechSynthesis for voice output
   - Multi-language support (8 languages)
   - Mute functionality

4. **Offline Sync Manager** (`/lib/offline-sync.ts`)
   - Monitors online/offline status
   - Automatic processing of pending queries when internet returns
   - Sequential API calls for queued messages

## Features

### 1. Online Mode
- Immediate response when internet is available
- Query sent to Groq API via `/api/groq-query` endpoint
- Response displayed immediately
- Automatic voice response (if not muted)
- Both query and response saved to IndexedDB

### 2. Offline Mode
- Queries stored in IndexedDB with `status: "pending"`
- User sees confirmation message: "Stored offline. Will process when online."
- No API calls attempted
- Data persists locally

### 3. Automatic Reconnection
- Listens for `window.online` event
- On reconnection:
  - Automatically fetches all pending queries from IndexedDB
  - Sends them sequentially to Groq API
  - Updates status to "completed"
  - Automatically speaks responses
  - Updates UI dynamically

### 4. Voice Features
- **Voice Input**: Click "Voice" button, speak query in any of 8 languages
- **Voice Output**: AI response automatically spoken (unless muted)
- **Mute Toggle**: Prevents audio output while keeping chat functional
- **Language Support**: Detects locale and sets speech language automatically

### 5. Language Support
All 8 regional languages supported:
- English (en-US)
- Hindi (hi-IN)
- Kannada (kn-IN)
- Tamil (ta-IN)
- Telugu (te-IN)
- Bengali (bn-IN)
- Malayalam (ml-IN)
- Urdu (ur-PK)

## Usage Flow

### Text Query
1. User enters question in input field
2. Clicks Send or presses Enter
3. If online:
   - API called immediately
   - Response shown
   - Voice output (if not muted)
4. If offline:
   - Stored in IndexedDB
   - Status message shown
   - Automatic processing on reconnection

### Voice Query
1. User clicks "Voice" button
2. Browser requests microphone permission
3. User speaks query
4. Speech recognized and shown in input field
5. Same flow as text query (online/offline)
6. AI response spoken automatically

### Offline-to-Online Flow
1. User goes offline, submits queries
2. Queries stored as "pending"
3. Internet returns
4. Automatic detection via `window.online` event
5. All pending queries processed sequentially
6. Responses shown with timestamps
7. Voice responses spoken automatically
8. Status indicator shows "Processing..."

## Database Schema

### Queries Table
```typescript
interface Query {
  id?: number;               // Auto-increment
  prompt: string;            // The user's query
  type: 'text' | 'voice';    // Input type
  status: 'pending' | 'completed';
  createdAt: number;         // Timestamp
}
```

### Responses Table
```typescript
interface Response {
  id?: number;               // Auto-increment
  queryId: number;           // Foreign key to queries.id
  response: string;          // AI response text
  createdAt: number;         // Timestamp
}
```

## Environment Setup

Required environment variables (already configured):
- `NEXT_PUBLIC_OPENWEATHER_API_KEY` (for weather, not used in call agent)
- `GROQ_API_KEY` (for Groq API calls)

## Integration Points

### API Endpoint
- **Route**: `/api/groq-query`
- **Method**: POST
- **Body**: `{ prompt: string, language: Locale }`
- **Response**: `{ response: string }`

### Groq Integration
Uses existing Groq setup with system prompt for agricultural context.

## Browser Support

### Required APIs
- IndexedDB (all modern browsers)
- Web Speech API (Chrome, Edge, Safari 15+)
- Online/Offline Events (all modern browsers)

### Fallback Support
- Voice: Gracefully disabled if not supported
- Offline: Works on all IndexedDB-capable browsers
- Speech Synthesis: Automatically skipped if unavailable

## Testing Checklist

- [ ] Send text query online → immediate response + save
- [ ] Send text query offline → stored with pending status
- [ ] Go offline with pending query → message shown
- [ ] Reconnect internet → query auto-processes
- [ ] Voice input in different languages
- [ ] Voice output in different languages
- [ ] Mute button works correctly
- [ ] Multiple queries queued → all process sequentially
- [ ] Status indicator shows online/offline
- [ ] Message timestamps display correctly

## Future Enhancements

1. Export chat history as PDF
2. Search query history
3. Rate AI responses
4. Custom voice speed/pitch
5. Chat context memory
6. User preferences storage
7. Analytics integration

## Troubleshooting

### Voice not working
- Check browser permissions (microphone)
- Verify Web Speech API support
- Check console for errors

### Offline queries not syncing
- Verify IndexedDB is available
- Check browser storage quota
- Review console logs for sync errors

### API calls failing
- Verify Groq API key is set
- Check network connectivity
- Review API response format

## File Structure
```
/lib
  ├── indexeddb.ts          # IndexedDB management
  ├── voice-assistant.ts    # Web Speech API wrapper
  └── offline-sync.ts       # Reconnection handler

/components
  └── AICallAgentModal.tsx   # Main UI component

/app/[locale]
  └── page.tsx              # Homepage integration
```

This implementation is production-ready with complete offline support and automatic synchronization.
