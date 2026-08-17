import { Card } from './card';

export interface PromptOptions {
  text: string;
  options: (Card | null)[];
}
