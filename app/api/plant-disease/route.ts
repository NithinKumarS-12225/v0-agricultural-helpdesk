import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, language = 'en' } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    console.log('[v0] Starting plant disease analysis...');

    try {
      // Use Groq's vision API directly with proper formatting
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.2-11b-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are an expert plant pathologist and agricultural specialist in India. Analyze this plant/leaf image carefully and identify any diseases or health issues.

Respond ONLY with a valid JSON object (no other text before or after) in this exact format:
{
  "disease": "Disease name or 'Healthy Plant' if no disease",
  "confidence": 0.85,
  "description": "Brief description of the condition",
  "symptoms": ["symptom 1", "symptom 2"],
  "treatment": ["treatment 1", "treatment 2"],
  "prevention": ["prevention 1", "prevention 2"]
}

Confidence should be a number between 0 and 1. Be accurate and specific based on what you observe.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageBase64,
                  },
                },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[v0] Groq API error:', errorData);
        throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('[v0] Groq response received');

      const analysisContent = data.choices?.[0]?.message?.content;
      if (!analysisContent) {
        throw new Error('No content in Groq response');
      }

      console.log('[v0] Analysis content:', analysisContent.substring(0, 100));

      // Parse JSON - try multiple approaches
      let analysis;
      try {
        // Try direct parse first
        analysis = JSON.parse(analysisContent);
      } catch (e) {
        // Try extracting JSON from text
        const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON from response');
        }
      }

      // Validate analysis has required fields
      if (!analysis.disease || !Array.isArray(analysis.symptoms)) {
        throw new Error('Invalid analysis structure');
      }

      console.log('[v0] Disease detected:', analysis.disease);

      // Get detailed treatment recommendations
      console.log('[v0] Getting detailed treatment for:', analysis.disease);

      const treatmentResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert agricultural advisor from India's Ministry of Agriculture. Provide practical, actionable advice for Indian farmers.
              
Guidelines:
- Give practical, cost-effective solutions
- Mention both organic and chemical options
- Include costs in Indian Rupees (₹) when relevant
- Suggest immediate and long-term solutions
- Recommend government schemes if applicable
- Be encouraging and supportive
- Use simple, farmer-friendly language

Response language: ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English'}`,
            },
            {
              role: 'user',
              content: `A farmer detected "${analysis.disease}" with symptoms: ${analysis.symptoms.join(', ')}.

Provide:
1. Immediate actions
2. Treatment options (organic and chemical)
3. Prevention measures
4. When to contact specialists

Keep it practical and affordable.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!treatmentResponse.ok) {
        const errorData = await treatmentResponse.json();
        console.error('[v0] Treatment API error:', errorData);
        throw new Error(`Treatment API error: ${treatmentResponse.status}`);
      }

      const treatmentData = await treatmentResponse.json();
      const treatmentContent = treatmentData.choices?.[0]?.message?.content;

      console.log('[v0] Analysis complete');

      const enhancedAnalysis = {
        ...analysis,
        aiGeneratedTreatment: treatmentContent || '',
        analysisTimestamp: new Date().toISOString(),
        language: language,
      };

      return NextResponse.json(enhancedAnalysis);
    } catch (groqError) {
      console.error('[v0] Groq processing error:', groqError);
      throw groqError;
    }
  } catch (error) {
    console.error('[v0] Plant disease analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
