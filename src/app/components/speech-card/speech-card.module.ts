import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechCardComponent } from "./speech-card.component";
import { SpeechModule } from "../../services/speech/speech.module";
import { LoaderModule } from "../loader-recording/loader.module";
import { SharedModule } from "../../shared.module";

@NgModule({
  declarations: [
    SpeechCardComponent
  ],
  exports: [
    SpeechCardComponent
  ],
  imports: [
    CommonModule,
    SpeechModule,
    LoaderModule,

    SharedModule,
  ]
})
export class SpeechCardModule { }
