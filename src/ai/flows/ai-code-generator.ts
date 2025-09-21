'use server';

/**
 * @fileOverview Generates code from a description of a program.
 *
 * - generateCode - A function that generates code based on a program description.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  programDescription: z
    .string()
    .describe('A description of the program to generate code for.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code for the program.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer.  You will generate functional code based on the description of the program provided by the user.  Include comments in the code.

Description: {{{programDescription}}}`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
