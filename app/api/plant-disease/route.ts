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

    const groq = getGroqClient();

    // Step 1: Use Groq vision to analyze the plant image
    console.log('[v0] Analyzing plant image with Groq vision...');
    
    const analysisResponse = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert plant pathologist. Analyze this plant/leaf image and identify any diseases or health issues.

Provide your analysis in the following JSON format (no other text):
{
  "disease": "Disease name or 'Healthy Plant' if no disease detected",
  "confidence": "Confidence level as a decimal between 0 and 1",
  "description": "Brief description of the condition (1-2 sentences)",
  "symptoms": ["List of visible symptoms observed on the plant"],
  "treatment": ["List of treatment recommendations"],
  "prevention": ["List of prevention strategies"]
}

Be specific about what you see in the image. If it's a healthy plant, mention that in the disease field.`,
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
    });

    const analysisContent = analysisResponse.choices[0]?.message?.content;
    console.log('[v0] Groq vision response:', analysisContent);

    if (!analysisContent) {
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(analysisContent);
      }
    } catch (parseError) {
      console.error('[v0] Failed to parse Groq response:', analysisContent);
      return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 });
    }

    // Step 2: Get detailed treatment advice from Groq based on the disease detected
    console.log('[v0] Getting detailed treatment recommendations for:', analysis.disease);

    const treatmentResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert agricultural advisor from India's Ministry of Agriculture specializing in plant disease management. Provide practical, actionable advice for farmers in India.

Guidelines:
1. Give practical, region-specific solutions
2. Mention organic and chemical options
3. Include costs in Indian Rupees (₹) when relevant
4. Suggest both immediate and long-term solutions
5. Mention government schemes if applicable
6. Be encouraging and supportive

Respond in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English'}.`,
        },
        {
          role: 'user',
          content: `A farmer has detected "${analysis.disease}" on their plant with these symptoms: ${analysis.symptoms.join(', ')}.

Provide detailed treatment recommendations and preventive measures in point format. Include:
1. Immediate actions to take
2. Chemical/biological treatments with application methods
3. Organic alternatives
4. Preventive measures for future
5. When to consult a specialist`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const treatmentContent = treatmentResponse.choices[0]?.message?.content;
    console.log('[v0] Treatment recommendations:', treatmentContent);

    // Enhance the analysis with AI-generated treatment details
    const enhancedAnalysis = {
      ...analysis,
      aiGeneratedTreatment: treatmentContent,
      analysisTimestamp: new Date().toISOString(),
      language: language,
    };

    return NextResponse.json(enhancedAnalysis);
  } catch (error) {
    console.error('[v0] Plant disease analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
