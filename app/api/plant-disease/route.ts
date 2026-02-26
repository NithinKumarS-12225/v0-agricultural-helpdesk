import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, language = 'en' } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Using Groq for plant disease analysis
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // For now, return mock disease analysis
    // In production, integrate with actual plant disease detection model
    const analysis = {
      disease: 'Leaf Spot',
      confidence: 0.92,
      description: 'This appears to be a fungal leaf spot disease common in tomato plants.',
      symptoms: [
        'Brown circular spots on leaves',
        'Yellow halo around spots',
        'Progressive spread to other leaves',
        'Leaf yellowing and dropping'
      ],
      treatment: [
        'Remove affected leaves immediately',
        'Apply copper fungicide spray',
        'Improve air circulation',
        'Avoid overhead watering',
        'Sanitize pruning tools'
      ],
      prevention: [
        'Plant disease-resistant varieties',
        'Maintain proper spacing between plants',
        'Water at soil level only',
        'Clean up fallen leaves',
        'Use mulch to prevent soil splashing'
      ]
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('[v0] Plant disease analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
