'use server';
/**
 * @fileOverview An AI-powered photo enhancer.
 *
 * - enhancePhoto - A function that enhances a given photo.
 * - EnhancePhotoInput - The input type for the enhancePhoto function.
 * - EnhancePhotoOutput - The return type for the enhancePhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhancePhotoInput = z.infer<typeof EnhancePhotoInputSchema>;

const EnhancePhotoOutputSchema = z.object({
  enhancedImageUrl: z.string().describe('The URL of the enhanced image.'),
});
export type EnhancePhotoOutput = z.infer<typeof EnhancePhotoOutputSchema>;

export async function enhancePhoto(input: EnhancePhotoInput): Promise<EnhancePhotoOutput> {
  return enhancePhotoFlow(input);
}

const enhancePhotoFlow = ai.defineFlow(
  {
    name: 'enhancePhotoFlow',
    inputSchema: EnhancePhotoInputSchema,
    outputSchema: EnhancePhotoOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: 'Enhance this photo to improve its quality, color, and sharpness. Make it look more professional.'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media || !media.url) {
      throw new Error('Failed to enhance photo.');
    }

    return {enhancedImageUrl: media.url};
  }
);
