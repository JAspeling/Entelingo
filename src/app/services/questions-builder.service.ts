import { Injectable } from "@angular/core";
import { PersonalPronoun } from "../models/personal-pronoun";
import { FlattenedWordMeta } from "../models/flattened-word-meta";
import { WordMetaBuilder } from "../models/word-meta-builder";
import { QuestionForm, WordMeta } from "../models/word-meta";
import { map, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuestionsBuilderService {
  forms: { [key: string]: { index: number, forms: QuestionForm[] } } = {};

  constructor(private readonly http: HttpClient) {
    this._questions = this.generateWordMetaList();
  }

  private _questions: WordMeta[];

  get questions(): WordMeta[] {
    return [...this._questions ?? []];
  }

  get words(): string[] {
    return this.questions.map(q => q.word);
  }

  getWordIndex(word: string): number {
    return this.words.indexOf(word);
  }

  generateWordMetaList(): WordMeta[] {

    const builder = new WordMetaBuilder()
      .addWord('Begin', true)
      .withPronoun(PersonalPronoun.ik).addTenses('begin', 'begon', 'ben begonnen', 'was begonnen')
      .withPronoun(PersonalPronoun.Jij_je_u).addTenses('begint', 'begon', 'bent begonnen', 'was begonnen')
      .withPronoun(PersonalPronoun.Hij_zij_ze_het).addTenses('begint', 'begon', 'bent begonnen', 'was begonnen')
      .withPronoun(PersonalPronoun.Jullie).addTenses('beginnen', 'begonnen', 'zijn begonnen', 'waren begonnen')

      .addWord('Bewust zijn (van)')
      .withPronoun(PersonalPronoun.ik).addTenses('ben me ervan bewust', 'was me ervan bewust', 'ben me ervan bewust geweest', 'was me ervan bewust geweest')
      .withPronoun(PersonalPronoun.Jij_je_u).addTenses('bent je ervan bewust', 'was je ervan bewust', 'bent je ervan bewust geweest', 'was je ervan bewust geweest')
      .withPronoun(PersonalPronoun.Hij_zij_ze_het).addTenses('is zich ervan bewust', 'was zich ervan bewust', 'is zich ervan bewust geweest', 'was zich ervan bewust geweest')
      .withPronoun(PersonalPronoun.Jullie).addTenses('zijn je ervan bewust', 'waren je ervan bewust', 'zijn je ervan bewust geweest', 'waren je ervan bewust geweest')

      .addWord('Bijten')
      .withPronoun(PersonalPronoun.ik).addTenses('bijt', 'beet', 'heb gebeten', 'had gebeten')
      .withPronoun(PersonalPronoun.Jij_je_u).addTenses('bijt', 'beet', 'hebt gebeten', 'had gebeten')
      .withPronoun(PersonalPronoun.Hij_zij_ze_het).addTenses('bijt', 'beet', 'heeft', 'had gebeten')
      .withPronoun(PersonalPronoun.Jullie).addTenses('bijten', 'beten', 'hebben gebeten', 'hadden gebeten')

      // Builds the questions, returning an array of them instead of the builder.
      .build();

    this.words.forEach((word, index) => {
      this.forms[word] = { index: index, forms: this.questions[this.getWordIndex(word)].forms };
    });

    return builder;
  }

  getFlattenedQuestions(): FlattenedWordMeta[] {
    return this.generateWordMetaList().map(q => q.buildQuestions()).flatMap(q => q)
  }

  getQuestions(): Observable<FlattenedWordMeta[]> {
    return this.http.get('assets/data.json')
      .pipe(
        // Map the data to a builder
        map((data: any) => {
          let builder = new WordMetaBuilder();

          data.words.forEach((word: any) => {
            builder.addWord(word.word);
            word.pronouns.forEach((pronoun: any) => {
              builder.withPronoun(pronoun.pronoun).addTensesArray(pronoun.tenses);
            });
          })
          this._questions = builder.build();

          return this._questions;
        }),
        // Map to flattened questions
        map(builder => {
          return builder.map(q => q.buildQuestions()).flatMap(q => q);
        }),
        // As a side-effect, populate the forms dictionary
        tap(data => {
          this.words.forEach((word, index) => {
            this.forms[word] = { index: index, forms: this.questions[this.getWordIndex(word)].forms };
          });
        })
      );
  }
}
