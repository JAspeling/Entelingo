import { BehaviorSubject, fromEvent, map, Observable, Subject } from "rxjs";
import { Guid } from "../../models/guid";

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
declare var webkitSpeechRecognition: any;

export class SpeechService {

  id: string = Guid.newGuid();

  currentText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  stoppedRecording$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  startedRecording$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  final$: Subject<string> = new Subject<string>();

  isStopped = false;
  public text: string = '';
  public tempWords: string = '';

  private recognition = new webkitSpeechRecognition();

  constructor() {
    // console.log('[Speech service] init', this.id);
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    this.recognition.interimResults = true;
    this.recognition.continuous = false;
    this.recognition.lang = 'nl-NL';

    this.recognition.addEventListener('result', (args: any) => this.onResult(args));
    this.recognition.addEventListener('speechend', (args: any) => this.onSpeechEnd(args));
  }

  /**
   *
   * @param results SpeechRecognitionEvent The results from the active transcription
   */
  public onResult(event: any) {
    const results: SpeechRecognitionResultList = event.results;
    this.tempWords = Array.from(results)
      .map((result: SpeechRecognitionResult) => { return result[0]; })
      .map((result: SpeechRecognitionAlternative) => {
        this.wordConcat();
        this.text = '';
        return result.transcript;
      })
      .join('');
  }

  public onSpeechEnd(event: any) {
    // TODO: Might need to add conditional checking and an observable pipe here to delay the stop() call.
    // console.log("Speech recognition stopped");
    this.stop();
  }

  public start(): Observable<string> {
    this.recognition.start();
    this.isStopped = false;

    return fromEvent(this.recognition, 'end')
      .pipe(
        map((e: any) => this.wordConcat())
      );

    // this.startedRecording$.next(true);
    // this.isStopped = false;
    // this.recognition.start();
    // // console.log("Speech recognition started")
    // this.recognition.addEventListener('end', (condition: any) => {
    //   if (this.isStopped) {
    //     this.recognition.stop();
    //     console.log("End speech recognition")
    //   } else {
    //     this.wordConcat()
    //     this.recognition.start();
    //   }
    // });
  }

  public stop() {
    this.isStopped = true;
    this.stoppedRecording$.next(true);
    this.wordConcat()
    this.recognition.stop();
    this.final$.next(this.text);
    // console.log("End speech recognition")
  }

  private wordConcat(): string {
    this.text = this.text + ' ' + this.tempWords;
    this.currentText$.next(this.text);
    this.tempWords = '';
    return this.text;
  }
}
