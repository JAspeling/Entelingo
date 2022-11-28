// export type Questions = Question[];

// export class Question {
//   constructor(init?: Partial<Question>) {
//     Object.assign(this, init);
//   }
//
//   word: string = '';
//   form: string = '';
//   tense: string = '';
//   value: string = '';
// }

export enum Form {
  ik = 'Ik',
  Jij_je_u = 'Jij / Je / U',
  Hij_zij_ze_het = 'Hij / Zij / Ze / Het',
  Jullie = 'Jullie'
}

export enum Tense {
  Present = 'Tegenwoordige tijd',
  Imperfectum = 'Imperfectum',
  Perfectum = 'Perfectum',
  PlusquamPerfecturm = 'Plusquamperfectum (Voltooid)'
}

export class QuestionForm {
  constructor(form: Form, questionBuilder: QuestionBuilder) {
    this.form = form;
    this.builder = questionBuilder;
  }

  addTenses(present: string, imperfectum: string, perfectum: string, plusquamPerfectum: string): QuestionBuilder {
    this.tenses.push({ tense: Tense.Present, value: present });
    this.tenses.push({ tense: Tense.Imperfectum, value: imperfectum });
    this.tenses.push({ tense: Tense.Perfectum, value: perfectum });
    this.tenses.push({ tense: Tense.PlusquamPerfecturm, value: plusquamPerfectum });

    return this.builder;
  }

  tenses: { tense: Tense, value: string }[] = [];
  form: Form;
  builder: QuestionBuilder;
}

export class FlattenedQuestion {
  constructor(init?: Partial<FlattenedQuestion>) {
    Object.assign(this, init);
  }

  werkwoord: string;
  tense: Tense;
  form: Form;

  isActive: boolean;
  recognizedSpeech: string;
  expected: string;

  completed: boolean;
  isCorrect: boolean;

}

// TODO: Kind of need this to be a flat structure to work with all the different tenses in the current form.
export class Question {
  constructor(word: string, isActive?: boolean) {
    this.word = word;
  }

  forms: QuestionForm[] = []
  word: string = '';

  // TODO: add level in here.
  //    Specify form & tense to be filtered on.
  buildQuestions(): FlattenedQuestion[] {
    const result: FlattenedQuestion[] = [];
    this.forms.forEach(form => {
      form.tenses.forEach(tense => {
        result.push(new FlattenedQuestion({
            werkwoord: this.word,
            tense: tense.tense,
            form: form.form,
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

export class QuestionBuilder {

  constructor(word?: string) {
    // if (word) {
    //   this.currentWord = word;
    //   this.words[word] = this;
    // }
  }

  // TODO: Some sort of dictionary.
  currentWord: string = '';
  words: { [key: string]: Question } = {};


  addWord(word: string, isActive?: boolean): QuestionBuilder {
    this.currentWord = word;
    const q = new Question(word, isActive);
    q.word = word;

    this.words[word] = q;

    return this;
  }

  withForm(form: Form): QuestionForm {
    const newForm = new QuestionForm(form, this)
    this.words[this.currentWord].forms.push(newForm);
    return newForm;
  }

  build(): Question[] {
    return Object.values(this.words);
  }
}
