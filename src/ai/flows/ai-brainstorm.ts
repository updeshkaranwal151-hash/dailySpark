
'use server';

/**
 * @fileOverview An AI-powered brainstorming and idea generator.
 *
 * - brainstormIdeas - A function that generates ideas based on a topic.
 * - BrainstormIdeasInput - The input type for the brainstormIdeas function.
 * - BrainstormIdeasOutput - The return type for the brainstormIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrainstormIdeasInputSchema = z.object({
  topic: z.string().describe('The topic to brainstorm ideas for.'),
});
export type BrainstormIdeasInput = z.infer<typeof BrainstormIdeasInputSchema>;

const BrainstormIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of generated ideas.'),
});
export type BrainstormIdeasOutput = z.infer<typeof BrainstormIdeasOutputSchema>;

export async function brainstormIdeas(input: BrainstormIdeasInput): Promise<BrainstormIdeasOutput> {
  return brainstormIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brainstormIdeasPrompt',
  input: {schema: BrainstormIdeasInputSchema},
  output: {schema: BrainstormIdeasOutputSchema},
  prompt: `You are a creative assistant that helps with brainstorming.
Generate a list of 5 creative and diverse ideas for the following topic:

Topic: {{{topic}}}`,
});

const brainstormIdeasFlow = ai.defineFlow(
  {
    name: 'brainstormIdeasFlow',
    inputSchema: BrainstormIdeasInputSchema,
    outputSchema: BrainstormIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
