/**
 * Client-side Gemini API utility functions.
 * All requests are safely proxied through server-side endpoints (/api/gemini/*).
 * The GEMINI_API_KEY remains strictly secret on the server and is never exposed to the browser.
 */

export interface GeminiGenerateOptions {
  systemInstruction?: string;
  model?: string;
  temperature?: number;
}

export interface GeminiChatMessage {
  role: 'user' | 'model' | 'assistant';
  text: string;
}

export interface GeminiStatusResponse {
  configured: boolean;
  model: string;
  server_side: boolean;
}

/**
 * Check if the Gemini API is configured on the server.
 */
export async function checkGeminiStatus(): Promise<GeminiStatusResponse> {
  try {
    const res = await fetch('/api/gemini/status');
    if (!res.ok) {
      return { configured: false, model: 'gemini-3.8-flash', server_side: true };
    }
    return await res.json();
  } catch {
    return { configured: false, model: 'gemini-3.8-flash', server_side: true };
  }
}

/**
 * Request content generation through the server-side Gemini API proxy.
 */
export async function generateWithGemini(
  prompt: string,
  options?: GeminiGenerateOptions
): Promise<string> {
  const res = await fetch('/api/gemini/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      systemInstruction: options?.systemInstruction,
      model: options?.model || 'gemini-3.8-flash',
      temperature: options?.temperature,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.details || 'Failed to generate content with Gemini API');
  }

  return data.text || '';
}

/**
 * Send a multi-turn chat through the server-side Gemini API proxy.
 */
export async function chatWithGemini(
  messages: GeminiChatMessage[],
  prompt?: string,
  options?: GeminiGenerateOptions
): Promise<string> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      prompt,
      systemInstruction: options?.systemInstruction,
      model: options?.model || 'gemini-3.8-flash',
      temperature: options?.temperature,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.details || 'Failed to complete chat with Gemini API');
  }

  return data.text || '';
}
