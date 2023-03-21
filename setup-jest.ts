import 'jest-preset-angular/setup-jest';
import { MockWebkitSpeechRecognition } from "./src/app/mocks/webkitSpeechRecognition.mock";


// @ts-ignore
window.webkitSpeechRecognition = MockWebkitSpeechRecognition;
