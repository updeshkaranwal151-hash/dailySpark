
'use server';
/**
 * @fileOverview Summarizes video to text using an AI model.
 *
 * - summarizeVideo - A function that handles the video summarization.
 * - SummarizeVideoInput - The input type for the summarizeVideo function.
 * - SummarizeVideoOutput - The return type for the summarizeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The video file to summarize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type SummarizeVideoInput = z.infer<typeof SummarizeVideoInputSchema>;

const SummarizeVideoOutputSchema = z.object({
  summary: z.string().describe('The summary of the video.'),
});
export type SummarizeVideoOutput = z.infer<typeof SummarizeVideoOutputSchema>;

export async function summarizeVideo(input: SummarizeVideoInput): Promise<SummarizeVideoOutput> {
  return summarizeVideoFlow(input);
}

const prompt = ai.definePrompt({
    name: 'summarizeVideoPrompt',
    input: {schema: z.object({
        video: z.any(),
    })},
    output: {schema: SummarizeVideoOutputSchema},
    prompt: `Summarize the following video.
    
    {{media url=video}}
    `,
    model: 'googleai/gemini-2.5-pro',
});


const summarizeVideoFlow = ai.defineFlow(
  {
    name: 'summarizeVideoFlow',
    inputSchema: SummarizeVideoInputSchema,
    outputSchema: SummarizeVideoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({video: input.videoDataUri}, {
      auth: input.apiKey,
    });
    return output!;
  }
);
