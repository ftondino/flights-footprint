import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpRequestService } from '../../services/http-request.service';
import { FootprintService } from '../../services/footprint.service';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  dataForm: FormGroup;
  filteredAirports: { [key: string]: any[] } = {};
  selectedAirports: { [key: string]: any } = {};
  @ViewChild('myForm') myForm!: ElementRef;
  errore: boolean | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private httpRequest: HttpRequestService,
    private footprintService: FootprintService,
    private renderer: Renderer2
  ) {
    this.dataForm = this.formBuilder.group({
      partenza: new FormControl('', [
        Validators.required,
        this.airportValidator('partenza'),
      ]),
      destinazione: new FormControl('', [
        Validators.required,
        this.airportValidator('destinazione'),
      ]),
      classe: new FormControl('', Validators.required),
      passeggeri: new FormControl(1, Validators.required),
    });
  }

  ngOnInit(): void {
    this.setupAutocomplete('partenza');
    this.setupAutocomplete('destinazione');
    this.footprintService.resetSearchBox.subscribe(() => {
      this.reset();
    });
  }

  increment() {
    this.dataForm.controls['passeggeri'].setValue(
      this.dataForm.controls['passeggeri'].value + 1
    );
  }

  decrement() {
    if (this.dataForm.controls['passeggeri'].value > 1) {
      this.dataForm.controls['passeggeri'].setValue(
        this.dataForm.controls['passeggeri'].value - 1
      );
    }
  }

  airportValidator(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selected = this.selectedAirports[field];
      return selected && selected.code === control.value
        ? null
        : { airportNotSelected: true };
    };
  }

  setupAutocomplete(field: string) {
    this.dataForm
      ?.get(field)
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => {
          if (value === '') {
            this.filteredAirports[field] = [];
            return of([]);
          }
          return this.footprintService.searchAirports(value);
        }),
        map((airports) => airports.slice(0, 5)),
        tap((filteredAirports: any[]) => {
          this.filteredAirports[field] = filteredAirports;
        })
      )
      .subscribe();
  }

  selectAirport(field: string, airport: any) {
    this.selectedAirports[field] = airport;
    this.dataForm?.get(field)?.setValue(airport.code);
    this.filteredAirports[field] = [];
  }

  onSubmit() {
    this.httpRequest
      .footprintData(
        this.dataForm.value.partenza,
        this.dataForm.value.destinazione,
        this.dataForm.value.classe
      )
      .pipe(
        catchError((error) => {
          console.error('Si è verificato un errore:', error);
          this.errore = true;
          return of({ error: true } as any);
        })
      )
      .subscribe((data: any) => {
        if (data && !data.error) {
          const additionalData = {
            passeggeri: this.dataForm.value.passeggeri,
            partenzaData: this.selectedAirports['partenza'],
            destinazioneData: this.selectedAirports['destinazione'],
          };
          this.footprintService.updateTravel(data, additionalData);
          this.renderer.addClass(this.myForm.nativeElement, 'animation');
        }
      });
  }

  chiudiErrore() {
    this.errore = false;
  }

  reset() {
    this.dataForm.patchValue({
      partenza: '',
      destinazione: '',
      classe: '',
      passeggeri: 1,
    });
    this.renderer.removeClass(this.myForm.nativeElement, 'animation');
  }
}
