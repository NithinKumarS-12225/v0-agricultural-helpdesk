# Quick Start Guide - Kisan Call Centre

## 5-Minute Setup

### Step 1: Get Your Groq API Key
1. Visit https://console.groq.com
2. Sign up or log in
3. Create a new API key
4. Copy the key

### Step 2: Set Environment Variable
Create `.env.local` in the project root:
```
GROQ_API_KEY=your_key_here
```

### Step 3: Install & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Step 4: Open in Browser
Navigate to: `http://localhost:3000`

---

## Key Features Quick Access

| Feature | URL | Purpose |
|---------|-----|---------|
| Farmer Chat | `/en/farmer` | Ask farming questions via AI |
| Experts | `/en/experts` | Find agricultural specialists |
| Marketplace | `/en/marketplace` | List and sell farm products |
| Weather | `/en/weather` | Real-time weather for farming |
| Schemes | `/en/schemes` | Government subsidies & loans |
| Account | `/en/account` | Profile & settings |

## Testing the AI Feature

1. Go to `/en/farmer`
2. Ask: "How to control powdery mildew in wheat?"
3. Get instant AI-powered response from Groq Llama 3.3

## Switching Languages

Click the globe icon (🌐) in the top navigation:
- English (`en`)
- हिन्दी (`hi`)
- ಕನ್ನಡ (`kn`)

## Theme Toggle

Click the sun/moon icon to toggle between light and dark modes.

## Sample Marketplace Data

Try adding a product:
- Crop: Rice
- Land Size: 2-5 acres
- Location: Bangalore
- Quantity: 100 bags
- Price: ₹2,500

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Troubleshooting

### "GROQ_API_KEY is not set"
- Make sure `.env.local` file exists
- Verify the API key is correct
- Restart the dev server

### AI responses not working
- Check your Groq API quota
- Verify internet connection
- Check browser console for errors

### Language changes not persisting
- Clear browser localStorage and refresh
- Check if browser allows localStorage

## File Locations

- **Data files**: `/data/` folder
- **Translations**: `/translations/` folder
- **Components**: `/components/` folder
- **Pages**: `/app/[locale]/` folder

## Next Steps

1. Customize the color palette in `app/globals.css`
2. Add more experts in `data/experts.json`
3. Update government schemes in `data/schemes.json`
4. Deploy to Vercel for free hosting

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard after deployment.

---

**Need Help?** Check the full README.md for detailed documentation.
