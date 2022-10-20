import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { NgxGaugeModule } from 'ngx-gauge';
import { SpeechCardModule } from "./components/speech-card/speech-card.module";
import { SwiperModule } from 'swiper/angular';
import { FormsModule } from "@angular/forms";
import { SharedModule } from "./shared.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,

    AppRoutingModule,
    NgxGaugeModule,
    SwiperModule,

    SpeechCardModule,
    FormsModule,
    SharedModule,
  ],
  providers: [],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
