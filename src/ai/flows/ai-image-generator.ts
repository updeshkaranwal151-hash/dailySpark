
// src/ai/flows/ai-image-generator.ts
'use server';

/**
 * @fileOverview AI image generation flow.
 *
 * - generateImage - A function that generates an image from a text prompt.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The prompt to use to generate the image.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: input.prompt,
       config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
      auth: input.apiKey,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image.');
    }

    return {imageUrl: media.url};
  }
);
