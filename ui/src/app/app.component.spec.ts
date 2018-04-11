import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  let comp,
    fixture;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.debugElement.componentInstance;
  });

  it('should create the app', fakeAsync(() => {
    setTimeout(() => {
      expect('lala').toBe('one');
      // console.log('done');
    });
    tick();
  }));


});
