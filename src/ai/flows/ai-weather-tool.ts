
'use server';

/**
 * @fileOverview An AI-powered weather tool.
 *
 * - getWeather - A function that gets the current weather for a specified location.
 * - GetWeatherInput - The input type for the getWeather function.
 * - GetWeatherOutput - The return type for the getWeather function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Mock function to simulate fetching weather data.
// In a real application, this would call a weather API.
const getRealtimeWeather = ai.defineTool(
  {
    name: 'getRealtimeWeather',
    description: 'Gets the current weather for a specified location.',
    inputSchema: z.object({
      city: z.string().describe('The city, e.g., San Francisco, CA'),
    }),
    outputSchema: z.object({
      temperature: z.number().describe('The current temperature in Celsius.'),
      condition: z.string().describe('A brief description of the weather conditions (e.g., "Sunny", "Cloudy", "Rainy").'),
      humidity: z.number().describe('The current humidity percentage.'),
      windSpeed: z.number().describe('The current wind speed in km/h.'),
    }),
  },
  async ({city}) => {
    console.log(`Fetching weather for ${city} (mocked)`);
    // This is mock data. A real implementation would use a weather API.
    const temp = Math.floor(Math.random() * 25) + 5; // Temp between 5°C and 30°C
    const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Windy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const humidity = Math.floor(Math.random() * 50) + 40; // Humidity between 40% and 90%
    const windSpeed = Math.floor(Math.random() * 20) + 5; // Wind speed between 5 and 25 km/h
    return { temperature: temp, condition, humidity, windSpeed };
  }
);


const GetWeatherInputSchema = z.object({
  city: z.string().describe('The city to get the weather for.'),
});
export type GetWeatherInput = z.infer<typeof GetWeatherInputSchema>;

const GetWeatherOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('A brief description of the weather conditions.'),
  humidity: z.number().describe('The current humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
});
export type GetWeatherOutput = z.infer<typeof GetWeatherOutputSchema>;

export async function getWeather(input: GetWeatherInput): Promise<GetWeatherOutput> {
  return getWeatherFlow(input);
}


const prompt = ai.definePrompt({
    name: 'getWeatherPrompt',
    input: {schema: GetWeatherInputSchema},
    output: {schema: GetWeatherOutputSchema},
    tools: [getRealtimeWeather],
    prompt: `Get the current weather for {{{city}}}.`,
});


const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: GetWeatherInputSchema,
    outputSchema: GetWeatherOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const toolResponse = llmResponse.toolRequest?.output;
    
    if (!toolResponse) {
        throw new Error('The model did not return weather information.');
    }

    return toolResponse;
  }
);
