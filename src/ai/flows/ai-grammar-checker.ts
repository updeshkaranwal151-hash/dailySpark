
'use server';

/**
 * @fileOverview An AI-powered grammar and spell checker.
 *
 * - checkGrammar - A function that corrects grammar and spelling in a given text.
 * - CheckGrammarInput - The input type for the checkGrammar function.
 * - CheckGrammarOutput - The return type for the checkGrammar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckGrammarInputSchema = z.object({
  text: z.string().describe('The text to be checked for grammar and spelling.'),
});
export type CheckGrammarInput = z.infer<typeof CheckGrammarInputSchema>;

const CheckGrammarOutputSchema = z.object({
  correctedText: z.string().describe('The text with corrected grammar and spelling.'),
});
export type CheckGrammarOutput = z.infer<typeof CheckGrammarOutputSchema>;

export async function checkGrammar(input: CheckGrammarInput): Promise<CheckGrammarOutput> {
  return checkGrammarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkGrammarPrompt',
  input: {schema: CheckGrammarInputSchema},
  output: {schema: CheckGrammarOutputSchema},
  prompt: `You are a helpful proofreader. Correct any grammar and spelling mistakes in the following text.
If there are no errors, return the original text.

Text: {{{text}}}`,
});

const checkGrammarFlow = ai.defineFlow(
  {
    name: 'checkGrammarFlow',
    inputSchema: CheckGrammarInputSchema,
    outputSchema: CheckGrammarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
