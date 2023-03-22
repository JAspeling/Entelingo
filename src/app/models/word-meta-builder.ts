import { PersonalPronoun } from "./personal-pronoun";
import { QuestionForm, WordMeta } from "./word-meta";

export class WordMetaBuilder {
  constructor(data?: any) {
    // TODO: Make sure this works.
    if (data) {
      // Iterate over the words
      data.words.forEach((word: any) => {

        // Iterate over the forms
        word.forms.forEach((form: any) => {

          // Iterate over the tenses
          form.tenses.forEach((tense: any) => {
            this.addWord(word.word)
              .withPronoun(form.form)
              .addTenses(tense.tense, tense.imperfectum, tense.perfectum, tense.plusquamPerfectum);
          });
        });
      });
    }
  }

  currentWord: string = '';

  /**
   * Dictionary of words, containing the information about the word.
   */
  meta: { [key: string]: WordMeta } = {};


  addWord(word: string, isActive?: boolean): WordMetaBuilder {
    // Skip from adding the same word
    if (this.meta[word]?.word === word) {
      return this;
    }

    this.currentWord = word;
    const meta = new WordMeta(word);
    meta.word = word;

    this.meta[word] = meta;

    return this;
  }

  withPronoun(personalPronoun: PersonalPronoun): QuestionForm {
    const newForm = new QuestionForm(personalPronoun, this);
    this.meta[this.currentWord].forms.push(newForm);
    return newForm;
  }

  build(): WordMeta[] {
    return Object.values(this.meta);
  }
}
