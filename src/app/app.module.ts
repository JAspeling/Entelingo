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
import { LoaderModule } from "./components/loader-recording/loader.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AppRoutingModule,
    NgxGaugeModule,
    SwiperModule,

    SpeechCardModule,
    FormsModule,
    SharedModule,
    LoaderModule,
  ],
  providers: [],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
