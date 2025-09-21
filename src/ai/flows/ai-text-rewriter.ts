
'use server';

/**
 * @fileOverview An AI-powered text rewriter and paraphraser.
 *
 * - rewriteText - A function that rewrites text based on a given tone.
 * - RewriteTextInput - The input type for the rewriteText function.
 * - RewriteTextOutput - The return type for the rewriteText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteTextInputSchema = z.object({
  text: z.string().describe('The text to be rewritten.'),
  tone: z.string().describe('The desired tone for the rewritten text (e.g., formal, casual, confident, witty).'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type RewriteTextInput = z.infer<typeof RewriteTextInputSchema>;

const RewriteTextOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten text in the specified tone.'),
});
export type RewriteTextOutput = z.infer<typeof RewriteTextOutputSchema>;

export async function rewriteText(input: RewriteTextInput): Promise<RewriteTextOutput> {
  return rewriteTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteTextPrompt',
  input: {schema: RewriteTextInputSchema},
  output: {schema: RewriteTextOutputSchema},
  prompt: `You are an expert editor. Rewrite the following text in a {{{tone}}} tone.

Original Text:
"{{{text}}}"

Respond with only the rewritten text.`,
});

const rewriteTextFlow = ai.defineFlow(
  {
    name: 'rewriteTextFlow',
    inputSchema: RewriteTextInputSchema,
    outputSchema: RewriteTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      auth: input.apiKey,
    });
    return output!;
  }
);
