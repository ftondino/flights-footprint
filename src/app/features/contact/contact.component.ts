import { Component } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  constructor(private snackBar: MatSnackBar) {}

  sendEmail(e: Event) {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_1u1pm15',
        'template_laiec6u',
        e.target as HTMLFormElement,
        '_qu3nhnhkLh2m8oOp'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result.text);
          if (e.target) {
            (e.target as HTMLFormElement).reset();
          }
          this.snackBar.open('Email inviata con successo!', 'Chiudi', {
            duration: 2000,
          });
        },
        (error) => {
          console.log(error.text);
          this.snackBar.open("Errore durante l'invio dell'email.", 'Chiudi', {
            duration: 2000,
          });
        }
      );
  }
}
