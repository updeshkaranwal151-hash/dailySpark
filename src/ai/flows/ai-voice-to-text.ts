
'use server';
/**
 * @fileOverview Transcribes audio to text using an AI model.
 *
 * - voiceToText - A function that handles the audio transcription.
 * - VoiceToTextInput - The input type for the voiceToText function.
 * - VoiceToTextOutput - The return type for the voiceToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio file to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type VoiceToTextInput = z.infer<typeof VoiceToTextInputSchema>;

const VoiceToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type VoiceToTextOutput = z.infer<typeof VoiceToTextOutputSchema>;

export async function voiceToText(input: VoiceToTextInput): Promise<VoiceToTextOutput> {
  return voiceToTextFlow(input);
}

const prompt = ai.definePrompt({
    name: 'voiceToTextPrompt',
    input: {schema: z.object({
        audio: z.any(),
    })},
    output: {schema: VoiceToTextOutputSchema},
    prompt: `Transcribe the following audio recording to text.
    
    {{media url=audio}}
    `,
    model: 'googleai/gemini-2.5-pro',
});


const voiceToTextFlow = ai.defineFlow(
  {
    name: 'voiceToTextFlow',
    inputSchema: VoiceToTextInputSchema,
    outputSchema: VoiceToTextOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({audio: input.audioDataUri}, {
      auth: input.apiKey,
    });
    return output!;
  }
);
