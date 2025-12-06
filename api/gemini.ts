import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gemini API endpoint
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiRequest {
  action: string;
  model?: string;
  prompt?: string;
  config?: Record<string, unknown>;
  // For image generation
  imagePrompt?: string;
  aspectRatio?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const body = req.body as GeminiRequest;
    const { action, model = 'gemini-2.5-flash', prompt, config, imagePrompt, aspectRatio } = body;

    if (!action) {
      return res.status(400).json({ error: 'Missing action parameter' });
    }

    // Handle image generation separately (different endpoint)
    if (action === 'generateImage') {
      const imageModel = 'imagen-4.0-generate-001';
      const imageResponse = await fetch(
        `${GEMINI_API_BASE}/models/${imageModel}:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: imagePrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: aspectRatio || '4:3'
            }
          })
        }
      );

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error('Imagen API error:', errorText);
        return res.status(imageResponse.status).json({ error: 'Image generation failed' });
      }

      const imageData = await imageResponse.json();
      const base64Image = imageData.predictions?.[0]?.bytesBase64Encoded;
      return res.status(200).json({ imageBytes: base64Image });
    }

    // Standard text generation
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    const generateConfig: Record<string, unknown> = {};
    if (config?.responseMimeType) {
      generateConfig.response_mime_type = config.responseMimeType;
    }
    if (config?.tools) {
      generateConfig.tools = config.tools;
    }

    const requestBody: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    if (Object.keys(generateConfig).length > 0) {
      requestBody.generationConfig = generateConfig;
    }

    const response = await fetch(
      `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);

      // Pass through rate limit errors so client can handle them
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limited', details: errorText });
      }

      return res.status(response.status).json({ error: 'API request failed', details: errorText });
    }

    const data = await response.json();

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Include grounding metadata if present (for fact checking)
    const groundingMetadata = data.candidates?.[0]?.groundingMetadata;

    return res.status(200).json({
      text,
      groundingMetadata
    });

  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
