import { BehaviorSubject, fromEvent, map, Observable, of, Subject } from "rxjs";
import { Guid } from "../../models/guid";
import { FlattenedWordMeta } from "../../models/flattened-word-meta";

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
declare var webkitSpeechRecognition: any;
declare var webkitSpeechGrammarList: any;

export class SpeechService {

  id: string = Guid.newGuid();

  currentText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  stoppedRecording$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  startedRecording$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  final$: Subject<string> = new Subject<string>();

  isStopped = false;
  public text: string = '';

  private recognition = new webkitSpeechRecognition();

  constructor() {
    this.initSpeechRecognition();
  }

  /**
   *
   * @param event SpeechRecognitionEvent The results from the active transcription
   */
  public onResult(event: any) {
    const results: SpeechRecognitionResultList = event.results;
    let shouldStop = false;

    const transcript = Array.from(results)
      .map((result: SpeechRecognitionResult) => {
        if (result.isFinal) {
          shouldStop = true;
        }
        return result[0];
      })
      .map((result: SpeechRecognitionAlternative) => result.transcript)
      .join('')
      .trim();

    if (shouldStop) {
      this.text = transcript;
      this.stop();
    }
    this.currentText$.next(transcript);
  }

  public onSpeechEnd(event: any) {
    // TODO: Might need to add conditional checking and an observable pipe here to delay the stop() call.
    this.stop();
  }

  public start(meta?: FlattenedWordMeta): void {
    if (meta) {
      // @ts-ignore
      const expected = `${meta.personalPronoun.split(' ')[0]} ${meta.expected}`;

      const languageModel: any = {};
      languageModel[expected] = [...expected.split(' ')];

      const similar: any = {
        "weet": ["weet"],
        "peet": ["peet"],
        "peit": ["peit"],
      };

      const grammarString = `#JSGF V1.0; grammar custom; public <phrase> = (${Object.keys(languageModel).join(") | (")}) ;`;
      const newGrammar = ""

      const recognitionParams_old = {
        grammar: [
          {
            src: `data:application/x-jsgf;base64,${btoa("")}`,
            weight: 10
          },
        ],
        lang: 'nl-NL'
      };

      const grammar = `#JSGF V1.0;
      grammar custom;
      public <phrase> = ik beet ! (ik peet | ik weet | ik peit | ik pe | ik peed);`

      const grammarList = new webkitSpeechGrammarList();
      grammarList.addFromString(grammar, 1);
      this.recognition.grammars = grammarList;
      console.log(grammarList[0].src); // should return the same as the contents of the grammar variable
      console.log(grammarList[0].weight); // should return 1 - the same as the weight set in line 4.

      const recognitionParams = {
        grammar: {
          src: `data:application/x-jsgf;base64,${btoa(`
          #JSGF V1.0;
          grammar custom;
          public <phrase> = beet ! (peet | weet | peit | pe | peed | eet);
        `)}`,
          weight: 1
        },
        lang: 'nl-NL'
      };

      this.recognition.start();
    } else {
      this.recognition.start();
    }
    this.isStopped = false;
  }

  public stop() {
    if (!this.isStopped) {
      this.isStopped = true;
      this.stoppedRecording$.next(true);
      this.recognition.stop();
      this.final$.next(this.text);
      console.log("[speech] stop:", this.text)
    }
  }

  private initSpeechRecognition() {
    this.recognition.interimResults = true;
    this.recognition.continuous = false;
    this.recognition.lang = 'nl-NL';

    this.recognition.addEventListener('result', (event: any) => this.onResult(event));
    this.recognition.addEventListener('speechend', (event: any) => this.onSpeechEnd(event));
    this.recognition.addEventListener('start', (event: any) => {
      console.log("[speech] start", event);
    });
  }
}
