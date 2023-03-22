import { BehaviorSubject, fromEvent, map, Observable, of, Subject } from "rxjs";
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

  public start(): void {
    this.recognition.start();
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
  }
}
