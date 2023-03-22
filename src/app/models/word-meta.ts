import { PersonalPronoun } from "./personal-pronoun";
import { Tenses } from "./tenses";
import { FlattenedWordMeta } from "./flattened-word-meta";
import { WordMetaBuilder } from "./word-meta-builder";
import { Tense } from "./tense";

export class QuestionForm {
  tenses: Tense[] = [];
  personalPronoun: PersonalPronoun;
  builder: WordMetaBuilder;

  constructor(personalPronoun: PersonalPronoun, builder: WordMetaBuilder) {
    this.personalPronoun = personalPronoun;
    this.builder = builder;
  }

  addTenses(present: string, imperfectum: string, perfectum: string, plusquamPerfectum: string): WordMetaBuilder {
    this.tenses.push({ tense: Tenses.Present, value: present });
    this.tenses.push({ tense: Tenses.Imperfectum, value: imperfectum });
    this.tenses.push({ tense: Tenses.Perfectum, value: perfectum });
    this.tenses.push({ tense: Tenses.PlusquamPerfecturm, value: plusquamPerfectum });

    return this.builder;
  }

  addTensesArray(tenses: string[]): WordMetaBuilder {
    tenses.forEach((tense, index) => {
      let current: Tenses = Tenses.Present;
      switch(index) {
        case 0: current = Tenses.Present; break;
        case 1: current = Tenses.Imperfectum; break;
        case 2: current = Tenses.Perfectum; break;
        case 3: current = Tenses.PlusquamPerfecturm; break;
      }
      this.tenses.push({ tense: current, value: tense });
    });

    return this.builder;
  }

}

// TODO: Kind of need this to be a flat structure to work with all the different tenses in the current form.
export class WordMeta {
  constructor(word: string) {
    this.word = word;
  }

  forms: QuestionForm[] = []
  word: string = '';

  // TODO: add level in here.
  //    Specify form & tense to be filtered on.
  buildQuestions(): FlattenedWordMeta[] {
    const result: FlattenedWordMeta[] = [];
    this.forms.forEach(form => {
      form.tenses.forEach(tense => {
        result.push(new FlattenedWordMeta({
            werkwoord: this.word,
            tense: tense.tense,
            personalPronoun: form.personalPronoun,
            isActive: false,
            recognizedSpeech: '',
            expected: tense.value
          })
        );
      })
    })

    return result;
  }
}

