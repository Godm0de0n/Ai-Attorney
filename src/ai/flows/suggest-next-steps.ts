'use server';

/**
 * @fileOverview Suggests potential next steps after a legal document summary.
 *
 * - suggestNextSteps - A function that suggests next steps based on a legal document summary.
 * - SuggestNextStepsInput - The input type for the suggestNextSteps function.
 * - SuggestNextStepsOutput - The return type for the suggestNextSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextStepsInputSchema = z.object({
  documentSummary: z
    .string()
    .describe('A summary of the legal document provided by the user.'),
});

export type SuggestNextStepsInput = z.infer<typeof SuggestNextStepsInputSchema>;

const SuggestNextStepsOutputSchema = z.object({
  suggestedNextSteps: z
    .array(z.string())
    .describe('A list of potential next steps for the user to consider.'),
});

export type SuggestNextStepsOutput = z.infer<typeof SuggestNextStepsOutputSchema>;

export async function suggestNextSteps(input: SuggestNextStepsInput): Promise<SuggestNextStepsOutput> {
  return suggestNextStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStepsPrompt',
  input: {schema: SuggestNextStepsInputSchema},
  output: {schema: SuggestNextStepsOutputSchema},
  prompt: `Based on the following summary of a legal document, suggest potential next steps the user should consider:\n\nSummary: {{{documentSummary}}}\n\nConsider steps related to legal action, further investigation, seeking advice, gathering evidence, or any other relevant actions.  Provide a list of possible next steps. Be as specific as possible.`,
});

const suggestNextStepsFlow = ai.defineFlow(
  {
    name: 'suggestNextStepsFlow',
    inputSchema: SuggestNextStepsInputSchema,
    outputSchema: SuggestNextStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
