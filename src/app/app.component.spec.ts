import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SpeechService } from "./services/speech/speech.service";

describe('AppComponent', () => {
  beforeEach(() => {
    jest.mock('webkitSpeechRecognition', () => {
      return {
        start: jest.fn(),
        stop: jest.fn(),
        onresult: jest.fn(),
        onend: jest.fn(),
        onerror: jest.fn(),
        onstart: jest.fn(),
        onspeechend: jest.fn(),
        onnomatch: jest.fn(),
        onaudioend: jest.fn(),
        onaudiostart: jest.fn(),
        onsoundend: jest.fn(),
        onsoundstart: jest.fn(),
        onspeechstart: jest.fn(),
      }
    });
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [SpeechService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'onregelmatig'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('onregelmatig');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('onregelmatig app is running!');
  });
});
