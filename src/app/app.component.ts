import { Component } from '@angular/core';
import { SpeechService } from "./services/speech/speech.service";
import { SwiperOptions } from "swiper";

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'onregelmatig';

  config: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 5,
    navigation: true,
    scrollbar: { draggable: true },

  };

  questions: any[] = [
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


  current: any = {
    word: 'Beginnen',
    tense: 'Verleden tijd',
    speech: '',
    questions: [
      {
        header: 'Ik',
        expected: 'begin'
      },
      {
        header: 'Jij / U',
        expected: 'begont'
      },
      {
        header: 'Hij / Zij / Het',
        expected: 'begont'
      },
      {
        header: 'Wij / we',
        expected: 'begonnen'
      },
      {
        header: 'Jullie',
        expected: 'begonnen'
      },
      {
        header: 'Zij / ze',
        expected: 'begonnen'
      }
    ]
  }
  test: string = 'Test Johan';

  constructor(private speechService: SpeechService) {
  }

  start() {
    this.speechService.start();
  }

  stop() {

    this.speechService.stop();
  }

  setText(text: string) {
    console.log('setting text', text);
    this.current.speech = text;
  }
}
