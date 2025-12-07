import type { Plugin } from 'vite';
import { loadEnv } from 'vite';

// Vite plugin to handle /api/gemini requests during local development
// This mimics the Vercel serverless function behavior

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export function geminiApiPlugin(): Plugin {
  let apiKey: string;

  return {
    name: 'gemini-api-plugin',
    configResolved(config) {
      // Load environment variables
      const env = loadEnv(config.mode, '.', '');
      apiKey = env.GEMINI_API_KEY || '';
      if (!apiKey) {
        console.warn('\n⚠️  GEMINI_API_KEY not found in .env.local - AI features will not work\n');
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/gemini' || req.method !== 'POST') {
          return next();
        }

        // Parse request body
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const { action, model = 'gemini-2.5-flash', prompt, config, imagePrompt, aspectRatio } = JSON.parse(body);

          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'API key not configured' }));
            return;
          }

          // Handle image generation
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
              res.statusCode = imageResponse.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Image generation failed' }));
              return;
            }

            const imageData = await imageResponse.json();
            const base64Image = imageData.predictions?.[0]?.bytesBase64Encoded;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ imageBytes: base64Image }));
            return;
          }

          // Standard text generation
          if (!prompt) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing prompt parameter' }));
            return;
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

            if (response.status === 429) {
              res.statusCode = 429;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Rate limited', details: errorText }));
              return;
            }

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'API request failed', details: errorText }));
            return;
          }

          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const groundingMetadata = data.candidates?.[0]?.groundingMetadata;

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text, groundingMetadata }));

        } catch (error) {
          console.error('Gemini proxy error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    }
  };
}
