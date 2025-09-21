
'use server';

/**
 * @fileOverview An AI-powered emotion detector.
 *
 * - detectEmotion - A function that detects the emotion of a given text.
 * - DetectEmotionInput - The input type for the detectEmotion function.
 * - DetectEmotionOutput - The return type for the detectEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionInputSchema = z.object({
  text: z.string().describe('The text to analyze for emotion.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type DetectEmotionInput = z.infer<typeof DetectEmotionInputSchema>;

const DetectEmotionOutputSchema = z.object({
  emotion: z.string().describe('The detected emotion (e.g., Joy, Sadness, Anger, Surprise, Fear, Love, Neutral).'),
  emoji: z.string().describe('An emoji that represents the detected emotion.'),
});
export type DetectEmotionOutput = z.infer<typeof DetectEmotionOutputSchema>;

export async function detectEmotion(input: DetectEmotionInput): Promise<DetectEmotionOutput> {
  return detectEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmotionPrompt',
  input: {schema: DetectEmotionInputSchema},
  output: {schema: DetectEmotionOutputSchema},
  prompt: `Analyze the following text and determine the primary emotion being expressed.
  
You must choose one of the following emotions: Joy, Sadness, Anger, Surprise, Fear, Love, Neutral.
Also provide a single, representative emoji for the detected emotion.

Text: {{{text}}}`,
});

const detectEmotionFlow = ai.defineFlow(
  {
    name: 'detectEmotionFlow',
    inputSchema: DetectEmotionInputSchema,
    outputSchema: DetectEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      auth: input.apiKey,
    });
    return output!;
  }
);
