
'use server';

/**
 * @fileOverview An AI-powered smart search tool.
 *
 * - smartSearch - A function that provides a direct answer to a query using web search.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {defineTool} from 'genkit';

const SmartSearchInputSchema = z.object({
  query: z.string().describe('The search query.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  answer: z.string().describe('A direct answer to the search query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  tools: [ai.googleSearch],
  prompt: `Answer the following query: {{{query}}}`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      auth: input.apiKey,
    });
    return output!;
  }
);
