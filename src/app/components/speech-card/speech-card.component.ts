import { Component, EventEmitter, Input, OnInit, Output, SkipSelf } from '@angular/core';
import { SpeechService } from "../../services/speech/speech.service";
import { upperFirst } from "lodash";

@Component({
  selector: 'app-speech-card',
  templateUrl: './speech-card.component.html',
  providers: [SpeechService],
  styleUrls: ['./speech-card.component.scss']
})
export class SpeechCardComponent implements OnInit {
  @Input() header: string = '';
  @Input() expected: string = '';
  @Input() subHeader: string = '';

  @Output() text: EventEmitter<string> = new EventEmitter<string>();

  public recorded: string = '';

  public isRecording: boolean = false;
  isCorrect: boolean = false;
  public feedback?: string = '';

  constructor(private speech: SpeechService) {

    this.speech.stoppedRecording$.subscribe((val: boolean) => {
      this.isRecording = !val;
    });
    this.speech.startedRecording$.subscribe((val: boolean) => {
      this.isRecording = val;
    });

    this.speech.final$.subscribe(() => {
      if (!this.isCorrect) {
        this.feedback = `Let's try that again.`;
      } else  {
        this.feedback = upperFirst(this.expected) + ' 🎉';
      }
    });

    this.speech.currentText$.subscribe((text: string) => {
      // console.log('Within the component', text);

      if (!this.isCorrect) {
        if (this.expected.split(' ').length === 1) {
          text?.split(' ').forEach(word => {
            this.isCorrect = word?.trim() != '' && word.toLowerCase() == this.expected?.toLowerCase();
          });
        } else {
          this.isCorrect = text?.toLowerCase().includes(this.expected?.toLowerCase());
        }
      }
      if (text?.trim() != '') {
        this.text.emit(text);
        this.recorded = text;
      }
    });
  }

  ngOnInit(): void {
  }

  toggle(): void {
    this.isRecording = !this.isRecording;

    if (this.isRecording || this.speech.isStopped) {
      this.feedback = '';
      this.speech.start();
    } else {
      this.speech.stop();
    }
  }

}
