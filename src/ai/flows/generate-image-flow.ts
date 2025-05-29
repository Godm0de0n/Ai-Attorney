
'use server';
/**
 * @fileOverview Generates an image based on a text prompt using Genkit.
 * - generateImage - A function that handles image generation.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from. Should be descriptive.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI (e.g., data:image/png;base64,...).'),
  error: z.string().optional().describe('Error message if image generation failed.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

// Define the flow that calls the image generation model
const generateImageFlowInternal = ai.defineFlow(
  {
    name: 'generateImageFlowInternal',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    try {
      const { media, text } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Crucial: Use this specific model for image generation
        prompt: `Generate a high-quality, visually appealing image based on the following description: "${input.prompt}". The image should be suitable for a professional application.`,
        config: {
          responseModalities: ['IMAGE', 'TEXT'], // Must include TEXT, even if primarily using IMAGE
          // Optional: Add safety settings if needed, though defaults are usually fine.
          // safetySettings: [{ category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' }]
        },
      });

      if (media?.url) {
        return { imageDataUri: media.url };
      } else {
        console.error('Image generation failed: No media URL returned. LLM Text Response:', text);
        return { 
          imageDataUri: `https://placehold.co/400x300.png?text=AI+Error`, // Fallback placeholder
          error: `Image generation did not return media. LLM Response: ${text}` 
        };
      }
    } catch (error) {
      console.error('Error in generateImageFlow:', error);
      return {
        imageDataUri: `https://placehold.co/400x300.png?text=Generation+Failed`, // Fallback placeholder
        error: error instanceof Error ? error.message : 'Unknown error during image generation.'
      };
    }
  }
);

// Exported wrapper function
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlowInternal(input);
}
