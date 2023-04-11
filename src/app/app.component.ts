import { Component, ViewChild } from '@angular/core';
import { SpeechService } from "./services/speech/speech.service";
import { SwiperOptions } from "swiper";

import { QuestionsBuilderService } from "./services/questions-builder.service";
import { SpeechCardComponent } from "./components/speech-card/speech-card.component";
import Speech from 'speak-tts';
import { FlattenedWordMeta } from "./models/flattened-word-meta";
import { Observable } from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild(SpeechCardComponent) speechCard: SpeechCardComponent;
  title = 'onregelmatig';

  // percentageCompleted: number = 0;

  public progress: number = 0;

  progressUpper = 0;

  config: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 5,
    navigation: true,
    scrollbar: { draggable: true },

  };

  speech: any;
  speechData: any;

  currentQuestion: FlattenedWordMeta;
  questions: FlattenedWordMeta[] = [];
  questions$: Observable<FlattenedWordMeta[]>;
  recognizedSpeech: string;

  constructor(private speechService: SpeechService,
    private readonly questionsService: QuestionsBuilderService) {
    this.initSpeech();

    // this.questions = this.questionsService.getFlattenedQuestions();
    this.questionsService.getQuestions().subscribe(questions => {
      this.questions = questions;
      console.log(this.questions)
      this.setActive(0);
    });
  }

  nextWord(): void {
    const currentWordStartingIndex = this.questions.findIndex(q => q.werkwoord === this.currentQuestion.werkwoord);
    const index = currentWordStartingIndex + this.formTensesAmount();

    if (this.questions[index]) {
      this.setActive(index);
    }
  }

  private formTensesAmount(): number {
    let skipAmount = 0;

    const currentWord = this.currentQuestion.werkwoord;
    const currentForms = this.questionsService.forms[currentWord].forms;
    currentForms.forEach(form => form.tenses.forEach(tenses => { skipAmount++ }));
    return skipAmount;
  }

  private initSpeech(): void {
    console.log('Initializing Speech');
    try {
      this.speech = new Speech();
      if (this.speech.hasBrowserSupport()) {
        this.speech
          .init({
            volume: 1,
            lang: 'nl-NL',
            rate: 1,
            pitch: 0.75,
            voice: 'Google Nederlands',
            splitSentences: true,
          })
          .then((data: any) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log('Speech is ready, voices are available', data);
            this.speechData = data;
          })
          .catch((e: any) => {
            console.error('An error occurred while initializing : ', e);
          });
      }
    } catch (e) {
      console.error('Speech not supported');
    }
  }

  speak(text: string): void {
    // const textToSpeak = text;
    this.speech
      .speak({
        text: text,
      })
      .then(() => {
        console.log('Success !');
      })
      .catch((e: any) => {
        console.error('An error occurred :', e);
      });

  }

  previousWord(): void {
    // Need to group by the current word.
    const currentWordStartingIndex = this.questions.findIndex(q => q.werkwoord === this.currentQuestion.werkwoord);
    const index = currentWordStartingIndex - this.formTensesAmount();

    if (this.questions[index]) {
      this.setActive(index);
    } else {
      this.setActive(0);
    }
  }

  setActive(index: number) {
    this.questions.filter((q, i) => q.isActive && i != index).forEach(q => q.isActive = false);
    this.questions[index].isActive = true;
    this.currentQuestion = this.questions[index];
    this.recognizedSpeech = this.fixSpeech(this.currentQuestion.recognizedSpeech);
    this.updateProgress();
  }

  updateProgress() {
    // const completed = this.questions.filter(q => q.werkwoord == this.currentQuestion.werkwoord && q.completed).length;
    const correct = this.questions.filter(q => q.werkwoord == this.currentQuestion.werkwoord && q.isCorrect).length;
    const total = this.formTensesAmount();
    this.progress = Math.round((correct / total) * 100);
  }

  result(result: boolean): void {
    if (result && !this.currentQuestion.isCorrect ) {
      this.currentQuestion.isCorrect = true;
    }
    this.updateProgress();
  }

  fixSpeech(speech: string): string {
    // Remove the first occurrence of the form word (ik, hij, zij, etc)
    const recognized = speech.toLowerCase().replace(this.currentQuestion.personalPronoun.toLowerCase(), '');
    this.currentQuestion.recognizedSpeech = recognized;
    this.recognizedSpeech = recognized;
    return this.recognizedSpeech;
  }

  canNext(arr: any[], current: any): boolean {
    return arr.indexOf(current) < arr.length - 1;
  }

  canPrevious(arr: any[], current: any): boolean {
    return arr.indexOf(current) > 0;
  }

  nextQuestion(): void {
    if (this.canNext(this.questions, this.currentQuestion)) {
      const activeQuestionIndex = this.questions.findIndex(q => q.isActive);
      this.speechCard.reset();
      this.recognizedSpeech = '';
      this.currentQuestion.completed = true;
      this.setActive(activeQuestionIndex + 1);
    }
  }

  previousQuestion() {
    if (this.canPrevious(this.questions, this.currentQuestion)) {
      const activeQuestionIndex = this.questions.findIndex(q => q.isActive);
      this.speechCard.reset();
      this.recognizedSpeech = '';

      this.setActive(activeQuestionIndex - 1);
    }
  }
}
