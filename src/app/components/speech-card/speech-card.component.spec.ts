import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechCardComponent } from './speech-card.component';

describe('SpeechCardComponent', () => {
  let component: SpeechCardComponent;
  let fixture: ComponentFixture<SpeechCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeechCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
