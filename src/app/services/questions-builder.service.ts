import { Injectable } from "@angular/core";
import { FlattenedQuestion, Form, Question, QuestionBuilder, QuestionForm } from "../models/question";

@Injectable({
  providedIn: 'root'
})
export class QuestionsBuilderService {
  constructor() {
    this._questions = this.generateQuestions();
  }
  private _questions: Question[];

  get questions(): Question[] {
    return [...this._questions ?? []];
  }

  get words(): string[] {
    return this.questions.map(q => q.word);
  }

  forms: { [key: string]: { index: number, forms: QuestionForm[] } } = {}; 

  getWordIndex(word: string): number {
    return this.words.indexOf(word);
  }

  generateQuestions(): Question[] {
    const builder = new QuestionBuilder()
      .addWord('Begin', true)
      .withForm(Form.ik).addTenses('begin', 'begon', 'ben begonnen', 'was begonnen')
      .withForm(Form.Jij_je_u).addTenses('begint', 'begon', 'bent begonnen', 'was begonnen')
      .withForm(Form.Hij_zij_ze_het).addTenses('begint', 'begon', 'bent begonnen', 'was begonnen')
      .withForm(Form.Jullie).addTenses('beginnen', 'begonnen', 'zijn begonnen', 'waren begonnen')

      .addWord('Bewust zijn (van)')
      .withForm(Form.ik).addTenses('ben me ervan bewust', 'was me ervan bewust', 'ben me ervan bewust geweest', 'was me ervan bewust geweest')
      .withForm(Form.Jij_je_u).addTenses('bent je ervan bewust', 'was je ervan bewust', 'bent je ervan bewust geweest', 'was je ervan bewust geweest')
      .withForm(Form.Hij_zij_ze_het).addTenses('is zich ervan bewust', 'was zich ervan bewust', 'is zich ervan bewust geweest', 'was zich ervan bewust geweest')
      .withForm(Form.Jullie).addTenses('zijn je ervan bewust', 'waren je ervan bewust', 'zijn je ervan bewust geweest', 'waren je ervan bewust geweest')

      .addWord('Bijten')
      .withForm(Form.ik).addTenses('bijt', 'beet', 'heb gebeten', 'had gebeten')
      .withForm(Form.Jij_je_u).addTenses('bijt', 'beet', 'hebt gebeten', 'had gebeten')
      .withForm(Form.Hij_zij_ze_het).addTenses('bijt', 'beet', 'heeft', 'had gebeten')
      .withForm(Form.Jullie).addTenses('bijten', 'beten', 'hebben gebeten', 'hadden gebeten')

      // Builds the questions, returning an array of them instead of the builder.
      .build();

    this.words.forEach((word, index) => {
      this.forms[word] = { index: index, forms: this.questions[this.getWordIndex(word)].forms };
    });

    return builder;
  }

  getFlattenedQuestions(): FlattenedQuestion[] {
    return this.generateQuestions().map(q => q.buildQuestions()).flatMap(q => q)
  }
}
