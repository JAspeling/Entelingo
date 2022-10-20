declare module 'webkitSpeechRecognition' {
  class WebkitSpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    grammars: SpeechGrammarList;
    serviceURI: string;

    onaudioend: Function | null;
    onaudiostart: Function | null;
    onend: Function | null;
    onerror: Function | null;
    onnomatch: Function | null;
    onresult: Function | null;
    onsoundend: Function | null;
    onsoundstart: Function | null;
    onspeechend: Function | null;
    onspeechstart: Function | null;
    onstart: Function | null;
    abort(): void;

    addEventListener<K>(type: K, listener: Function, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    dispatchEvent(event: Event): boolean;
    removeEventListener<K>(type: K, listener: Function, options?: boolean | EventListenerOptions): void
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
    start(): void;
    stop(): void;
  }

  interface SpeechGrammarList {
    [index: number]: SpeechGrammar;
    length: number;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    item(index: number): SpeechGrammar
  }

  interface SpeechGrammar {
    src: string;
    weight?: number;
  }
}
