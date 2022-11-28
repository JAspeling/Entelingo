import { Component, ViewChild } from '@angular/core';
import { SpeechService } from "./services/speech/speech.service";
import { SwiperOptions } from "swiper";

import { FlattenedQuestion } from "./models/question";
import { QuestionsBuilderService } from "./services/questions-builder.service";
import { SpeechCardComponent } from "./components/speech-card/speech-card.component";
import Speech from 'speak-tts';


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

  questions_v1: any[] = [
    {
      word: 'Beginnen',
      forms: [
        {
          form: 'ik',
          tenses: [
            {
              tense: 'Tegenwoordige tijd',
              value: 'begin'
            },
            {
              tense: 'Verleden tijd',
              value: 'begon'
            },
            {
              tense: 'Perfectum',
              value: 'ben begonnen'
            },
            {
              tense: 'Plusquamperfectum (Voltooid)',
              value: 'was begonnen'
            }
          ]
        },
        {
          form: 'Jij / je / U',
          tenses: [
            {
              tense: 'Tegenwoordige tijd',
              value: 'begint'
            },
            {
              tense: 'Verleden tijd',
              value: 'begon'
            },
            {
              tense: 'Perfectum',
              value: 'bent begonnen'
            },
            {
              tense: 'Plusquamperfectum (Voltooid)',
              value: 'was begonnen'
            }
          ]
        },
        {
          form: 'Hij / zij / ze / het',
          tenses: [
            {
              tense: 'Tegenwoordige tijd',
              value: 'begint'
            },
            {
              tense: 'Verleden tijd',
              value: 'begon'
            },
            {
              tense: 'Perfectum',
              value: 'is begonnen'
            },
            {
              tense: 'Plusquamperfectum (Voltooid)',
              value: 'was begonnen'
            }
          ]
        },
        {
          form: 'Wij / we / Jullie / Ze',
          tenses: [
            {
              tense: 'Tegenwoordige tijd',
              value: 'beginnen'
            },
            {
              tense: 'Verleden tijd',
              value: 'begonnen'
            },
            {
              tense: 'Perfectum',
              value: 'zijn begonnen'
            },
            {
              tense: 'Plusquamperfectum (Voltooid)',
              value: 'waren begonnen'
            }
          ]
        }
      ]
    }
  ]

  questions_v2 = [
    {
      word: 'begin',
      form: 'ik',
      tense: 'Tegenwoordige tijd',
      value: 'begin'
    }, {
      word: 'begin',
      form: 'ik',
      tense: 'Verleden tijd',
      value: 'begon'
    }, {
      word: 'begin',
      form: 'ik',
      tense: 'Perfectum',
      value: 'ben begonnen'
    }, {
      word: 'begin',
      form: 'ik',
      tense: 'Plusquamperfectum (Voltooid)',
      value: 'was begonnen'
    },

    {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Tegenwoordige tijd',
      value: 'begint'
    }, {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Verleden tijd',
      value: 'begon'
    }, {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Perfectum',
      value: 'bent begonnen'
    }, {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Plusquamperfectum (Voltooid)',
      value: 'was begonnen'
    },

    {
      word: 'begin',
      form: 'hij / zij / het',
      tense: 'Tegenwoordige tijd',
      value: 'begint'
    }, {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Verleden tijd',
      value: 'begon'
    }, {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Perfectum',
      value: 'is begonnen'
    }, {
      word: 'begin',
      form: 'jij / je / u',
      tense: 'Plusquamperfectum (Voltooid)',
      value: 'was begonnen'
    },

    {
      word: 'begin',
      form: 'Wij / we / Jullie / Ze',
      tense: 'Tegenwoordige tijd',
      value: 'beginnen'
    }, {
      word: 'begin',
      form: 'Wij / we / Jullie / Ze',
      tense: 'Verleden tijd',
      value: 'begonnen'
    }, {
      word: 'begin',
      form: 'Wij / we / Jullie / Ze',
      tense: 'Perfectum',
      value: 'zijn begonnen'
    }, {
      word: 'begin',
      form: 'Wij / we / Jullie / Ze',
      tense: 'Plusquamperfectum (Voltooid)',
      value: 'waren begonnen'
    },
  ];

  speech: any;
  speechData: any;

  currentQuestion: FlattenedQuestion;
  questions: FlattenedQuestion[] = [];
  recognizedSpeech: string;

  constructor(private speechService: SpeechService, private readonly questionsService: QuestionsBuilderService) {
    this.initSpeech();

    this.questions = this.questionsService.getFlattenedQuestions();
    console.log(this.questions)
    this.setActive(0);
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
    currentForms.forEach(form => form.tenses.forEach(tense => { skipAmount++ }));
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
            listeners: {
              onvoiceschanged: (voices: any) => {
                console.log('Event voiceschanged', voices);
              },
            },
          })
          .then((data: any) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log('Speech is ready, voices are available', data);
            this.speechData = data;
            data.voices.forEach((voice: any) => {
              console.log(voice.name + ' ' + voice.lang);
            });
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

  start() {
    this.speechService.start();
  }

  stop() {
    this.speechService.stop();
  }

  listen(tense: any) {
    tense.isRecording = true;
    let sub = this.speechService.start().subscribe((result) => {
      tense.speech = result;
      tense.isRecording = false;
      sub.unsubscribe();
    });
  }

  fixSpeech(speech: string): string {
    // Remove the first occurrence of the form word (ik, hij, zij, etc)
    const recognized = speech.toLowerCase().replace(this.currentQuestion.form.toLowerCase(), '');
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
