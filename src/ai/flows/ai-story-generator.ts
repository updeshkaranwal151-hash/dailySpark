
'use server';

/**
 * @fileOverview An AI-powered story generator.
 *
 * - generateStory - A function that generates a short story based on a prompt.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  prompt: z.string().describe('A short prompt or idea for the story.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  title: z.string().describe('A creative title for the story.'),
  story: z.string().describe('The full text of the generated story.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: GenerateStoryOutputSchema},
  prompt: `You are a master storyteller. Write a compelling short story based on the following prompt. The story should be imaginative and well-structured.

Prompt: {{{prompt}}}

Generate a suitable title for the story.`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      auth: input.apiKey,
    });
    return output!;
  }
);
