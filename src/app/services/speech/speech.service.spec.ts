import { SpeechService } from './speech.service';
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { EventEmitter } from "@angular/core";
import { MockWebkitSpeechRecognition } from "../../mocks/webkitSpeechRecognition.mock";

describe('SpeechService', () => {
  let spectator: SpectatorService<SpeechService>;
  const createService = createServiceFactory(SpeechService);
  let speechRecognition: MockWebkitSpeechRecognition;

  beforeEach(() => {
    spectator = createService();
    speechRecognition = spectator.service['recognition'];
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should start speech recognition', () => {
    // @ts-ignore
    const startSpy = jest.spyOn(speechRecognition, 'start');

    spectator.service.start();
    expect(startSpy).toHaveBeenCalled();
  });

  describe('Speech events', () => {
    it('should be subscribed to the result event', async () => {
      const resultSpy = jest.spyOn(spectator.service, 'onResult');

      const event = new Event('result');
      Object.defineProperty(event, 'resultIndex', { value: 0 });
      Object.defineProperty(event, 'results', {
        value: [{ isFinal: true, 0: { transcript: 'hello world' } }],
      });

      speechRecognition.dispatchEvent(event)

      expect(resultSpy).toHaveBeenCalled();
    });
  })

  it('should be subscribed to the speechEnd event', () => {
    const speechEndSpy = jest.spyOn(spectator.service, 'onSpeechEnd');

    const event = new Event('speechend');
    speechRecognition.dispatchEvent(event);
    expect(speechEndSpy).toHaveBeenCalled();
  });
});
