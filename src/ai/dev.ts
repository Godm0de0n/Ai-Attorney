import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-legal-document.ts';
import '@/ai/flows/suggest-next-steps.ts';
import '@/ai/flows/provide-legal-guidance.ts';