# Kisan Call Centre - Remaining Implementation Specifications

## Task 3: Chat Features (Voice, Download, Mute)

### File: `/components/EnhancedChatSection.tsx`
```typescript
- Voice-to-Text: Use Web Speech API (SpeechRecognition)
- Text-to-Voice: Use Web Speech API (SpeechSynthesis)
- Download: Convert chat to PDF using jsPDF library
- Mute Button: Toggle audio output on/off
- Language Support: All 8 languages (auto-detect from locale)
- Features:
  - Real-time transcription display
  - Language selector in chat
  - Download button exports entire conversation
  - Mute toggle with visual indicator
```

### Required NPM Packages:
```json
{
  "jspdf": "^2.5.0",
  "html2canvas": "^1.4.1"
}
```

---

## Task 4: Live AI Call Agent (MOST CRITICAL)

### File: `/components/AICallAgent.tsx`

#### Architecture:
- **Online Mode**: Uses Groq Llama 3.3 API
- **Offline Mode**: Uses Hugging Face Transformers.js
- **Voice Handling**: Web Audio API for call quality
- **Language Support**: All 8 regional languages

#### Key Features:
1. **Real-time Voice Call Interface**
   - Visual call timer
   - Waveform animation during speech
   - Connection status indicator
   - Hold/End call buttons

2. **Speech Recognition** (all 8 languages):
   ```
   - English (en-US)
   - Hindi (hi-IN)
   - Kannada (kn-IN)
   - Tamil (ta-IN)
   - Telugu (te-IN)
   - Bengali (bn-IN)
   - Malayalam (ml-IN)
   - Urdu (ur-PK)
   ```

3. **Online Mode (Groq)**:
   - Receives farmer query via speech
   - Sends to Groq API endpoint
   - Gets AI response in selected language
   - Converts response to speech using browser TTS

4. **Offline Mode (Hugging Face)**:
   - Downloads model on first use
   - Runs inference locally
   - No internet required after initial setup
   - Supports all languages

#### API Endpoint:
Create `/app/api/call-agent/route.ts`:
```typescript
- POST /api/call-agent
- Body: { query: string, language: string, mode: 'online'|'offline' }
- Returns: { response: string, language: string }
```

#### UI Components:
1. Modal/Dialog with call interface
2. Call history log
3. Language selector
4. Mode indicator (Online/Offline)
5. Quality indicator
6. Feedback rating system

---

## Task 5: Land Mapping Section

### File: `/app/[locale]/land-mapping/page.tsx`

#### Integration:
- **Google Maps API**: Display farmland locations
- **Data Source**: Sample Indian farmland coordinates
- **Features**:
  - Interactive map with markers
  - Land details on click
  - Soil type information
  - Crop suitability information
  - Area calculator
  - Export map as image

#### Required:
```
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable
```

#### Components:
1. MapContainer - Google Maps integration
2. LandMarker - Individual land markers with info windows
3. LandDataPanel - Details sidebar
4. CoordinateSearch - Search by location

---

## Task 6: Plant Disease Detection

### File: `/app/[locale]/disease-detection/page.tsx`

#### AI Models:
```
Using Hugging Face:
- Model: "google/vit-base-patch16-224"  (Vision Transformer)
OR
- Model: "microsoft/resnet-50" 

Alternative: TensorFlow.js with pre-trained models
```

#### Features:
1. **Image Upload Section**
   - Drag & drop interface
   - Camera capture option
   - Multiple format support (JPG, PNG)

2. **AI Analysis**
   - Detect disease presence
   - Identify disease type
   - Confidence score
   - Affected area percentage

3. **Results Display**
   - Disease name (translated)
   - Severity level (Low/Medium/High)
   - Treatment solutions
   - Prevention tips
   - Recommended fertilizers/pesticides
   - Contact expert button

#### API Endpoint:
Create `/app/api/disease-detection/route.ts`:
```typescript
- POST /app/api/disease-detection
- Body: FormData with image file
- Returns: { disease, severity, solutions[], preventions[] }
```

---

## Task 7: Social Media Integration

### Update Files:
1. `/components/Footer.tsx` - Add social links
2. `/app/[locale]/account/page.tsx` - Add social profiles

#### Configuration:
Create environment variables:
```
NEXT_PUBLIC_GITHUB_URL=https://github.com/[username]
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/[username]
NEXT_PUBLIC_EMAIL=contact@example.com
```

#### Implementation:
- Add icon buttons in footer
- Add profile links in account page
- Social media icons from lucide-react
- onClick handlers for mailto: and window.open()

---

## Implementation Priority:

1. **CRITICAL**: Task 4 (AI Call Agent) - Most complex, high impact
2. **HIGH**: Task 3 (Chat Features) - Voice/Download essential for UX
3. **HIGH**: Task 6 (Disease Detection) - Core farmer utility
4. **MEDIUM**: Task 5 (Land Mapping) - Information feature
5. **LOW**: Task 7 (Social Links) - Simple integration

---

## Required Environment Variables:

```
# Existing
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key
GROQ_API_KEY=your_key

# New Required
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_GITHUB_URL=url
NEXT_PUBLIC_LINKEDIN_URL=url
NEXT_PUBLIC_EMAIL=email
```

---

## Testing Checklist:

- [ ] All 8 languages work in AI call agent
- [ ] Offline mode works without internet
- [ ] Disease detection accuracy > 85%
- [ ] Map renders correctly with markers
- [ ] Chat download includes all messages
- [ ] Voice-to-text in all languages
- [ ] Social links function correctly
