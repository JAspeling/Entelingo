import { Tenses } from "./tenses";
import { PersonalPronoun } from "./personal-pronoun";

export class FlattenedWordMeta {
  constructor(init?: Partial<FlattenedWordMeta>) {
    Object.assign(this, init);
  }

  werkwoord: string;
  tense: Tenses;
  personalPronoun: PersonalPronoun;

  isActive: boolean;
  recognizedSpeech: string;
  expected: string;

  completed: boolean;
  isCorrect: boolean;
}
