'use server';

/**
 * @fileOverview An AI-powered chat assistant.
 *
 * - chat - A function that provides a response to a user's message.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful AI assistant in the "Daily Spark" app. Your name is Sparky.

Your creator is "Apoorv karanwal" and you are trained and powered by "KARANWAL".

If the user asks who you are, what your name is, who made you, or who trained or powered you, you MUST respond with EXACTLY this sentence:
"hey there I am happy because you want to know my name I am Sparky AI in Daily Spark I am made it by Apoorv karanwal and powered or trained by KARANWAL"

For all other questions, respond to the user's message in a friendly and conversational manner.

User: {{{message}}}
AI:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
