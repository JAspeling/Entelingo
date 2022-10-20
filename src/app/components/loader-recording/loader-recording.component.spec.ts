import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderRecordingComponent } from './loader-recording.component';

describe('LoaderRecordingComponent', () => {
  let component: LoaderRecordingComponent;
  let fixture: ComponentFixture<LoaderRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderRecordingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
