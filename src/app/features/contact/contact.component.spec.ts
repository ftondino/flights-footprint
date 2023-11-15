import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactComponent } from './contact.component';
import * as emailjs from '@emailjs/browser';

import { EmailJSResponseStatus } from '@emailjs/browser';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let sendFormSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [MatSnackBarModule],
    });
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    sendFormSpy = spyOn<any>(component, 'sendEmail').and.callFake(() =>
      Promise.resolve({ text: 'Success', status: 200 })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendEmail', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      target: document.createElement('form'),
    };
    component.sendEmail(event as any);
    expect(sendFormSpy).toHaveBeenCalled();
  });
});
