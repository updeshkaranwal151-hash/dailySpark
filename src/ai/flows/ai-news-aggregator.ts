
'use server';

/**
 * @fileOverview An AI-powered news aggregator.
 *
 * - getNews - A function that fetches recent news articles on a given topic.
 * - GetNewsInput - The input type for the getNews function.
 * - GetNewsOutput - The return type for the getNews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ArticleSchema = z.object({
  title: z.string().describe('The headline of the news article.'),
  source: z.string().describe('The name of the news source or publication.'),
  url: z.string().url().describe('The direct URL to the news article.'),
  summary: z.string().describe('A brief, one-sentence summary of the article.'),
});

const GetNewsInputSchema = z.object({
  topic: z.string().describe('The topic to search news articles for.'),
  apiKey: z.string().optional().describe('The user provided API key.'),
});
export type GetNewsInput = z.infer<typeof GetNewsInputSchema>;

const GetNewsOutputSchema = z.object({
  articles: z.array(ArticleSchema).describe('A list of recent news articles related to the topic.'),
});
export type GetNewsOutput = z.infer<typeof GetNewsOutputSchema>;


export async function getNews(input: GetNewsInput): Promise<GetNewsOutput> {
  return getNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getNewsPrompt',
  input: { schema: GetNewsInputSchema },
  output: { schema: GetNewsOutputSchema },
  tools: [ai.googleSearch],
  prompt: `You are a news summarizer. Your task is to find the 5 most recent and relevant news articles for the given topic using the provided search tool.
  
For each article, provide the headline, the name of the source, the URL, and a concise one-sentence summary.

Topic: {{{topic}}}`,
});

const getNewsFlow = ai.defineFlow(
  {
    name: 'getNewsFlow',
    inputSchema: GetNewsInputSchema,
    outputSchema: GetNewsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input, {
      auth: input.apiKey,
    });
    return output!;
  }
);
