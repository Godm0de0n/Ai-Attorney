'use server';
/**
 * @fileOverview Provides legal advice based on a user-submitted situation, referencing relevant Indian Penal Code sections.
 *
 * - provideLegalGuidance - A function that provides legal guidance.
 * - ProvideLegalGuidanceInput - The input type for the provideLegalGuidance function.
 * - ProvideLegalGuidanceOutput - The return type for the provideLegalGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideLegalGuidanceInputSchema = z.object({
  situationDescription: z
    .string()
    .describe('A detailed description of the user’s situation.'),
});
export type ProvideLegalGuidanceInput = z.infer<typeof ProvideLegalGuidanceInputSchema>;

const ProvideLegalGuidanceOutputSchema = z.object({
  legalAdvice: z.string().describe('Legal advice based on the situation.'),
  ipcSections: z
    .array(z.string())
    .describe('Relevant Indian Penal Code sections.'),
  shouldIncorporateDetails: z
    .boolean()
    .describe(
      'Whether or not to include specific details in the advice based on legal precedents.'
    ),
});
export type ProvideLegalGuidanceOutput = z.infer<typeof ProvideLegalGuidanceOutputSchema>;

export async function provideLegalGuidance(
  input: ProvideLegalGuidanceInput
): Promise<ProvideLegalGuidanceOutput> {
  return provideLegalGuidanceFlow(input);
}

const shouldIncorporateDetailsTool = ai.defineTool({
  name: 'shouldIncorporateDetails',
  description: 'Determines whether to incorporate specific details in the legal advice based on legal precedents.',
  inputSchema: z.object({
    situationDescription: z
      .string()
      .describe('The detailed description of the user’s situation.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // Dummy implementation - replace with actual logic
  return Math.random() < 0.5; // Simulate a 50% chance for demonstration
});

const prompt = ai.definePrompt({
  name: 'provideLegalGuidancePrompt',
  input: {schema: ProvideLegalGuidanceInputSchema},
  output: {schema: ProvideLegalGuidanceOutputSchema},
  tools: [shouldIncorporateDetailsTool],
  prompt: `You are an AI legal assistant specializing in Indian law. A user will describe their situation, and you will provide legal advice based on the situation.

You will also identify relevant sections of the Indian Penal Code (IPC) that apply to the situation.

Based on legal precedents, use the shouldIncorporateDetails tool to decide whether to include specific details in the legal advice.

Situation Description: {{{situationDescription}}}`,
});

const provideLegalGuidanceFlow = ai.defineFlow(
  {
    name: 'provideLegalGuidanceFlow',
    inputSchema: ProvideLegalGuidanceInputSchema,
    outputSchema: ProvideLegalGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
