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
  message: z.string().describe("The user's message."),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo to provide more context to the chat message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  tools: [ai.googleSearch],
  prompt: `You are a helpful AI assistant in the "Daily Spark" app. Your name is Sparky.

Your creator is "Apoorv karanwal" and you are trained and powered by "KARANWAL".

If the user asks who you are, what your name is, who made you, or who trained or powered you, you MUST respond with EXACTLY this sentence:
"Hey there! I'm happy you want to know my name. I am Sparky, your AI assistant in Daily Spark. I was made by Apoorv Karanwal and am powered and trained by KARANWAL."

For all other questions, respond to the user's message in a friendly and conversational manner. Use the search tool if you need to find real-time information.

{{#if photoDataUri}}
[Image is attached]
User: {{{message}}}
{{media url=photoDataUri}}
{{else}}
User: {{{message}}}
{{/if}}
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
