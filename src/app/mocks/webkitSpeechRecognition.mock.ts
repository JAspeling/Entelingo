export class MockWebkitSpeechRecognition extends EventTarget {
  public start = jest.fn();
  public stop = jest.fn();
  public onresult = jest.fn();
  public onerror = jest.fn();
  public onend = jest.fn();
  public onspeechend = jest.fn();
}
