import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpRequestService } from './http-request.service';

@Injectable({
  providedIn: 'root',
})
export class FootprintService {
  private travelData = new BehaviorSubject<any>(null);
  currentTravel = this.travelData.asObservable();
  private airportsSource = new BehaviorSubject<any[]>([]);
  airportsData$ = this.airportsSource.asObservable();

  constructor(private httpRequest: HttpRequestService) {
    this.loadAirportsData();
  }

  updateTravel(data: any, additionalData: any) {
    const combinedData = { ...data, ...additionalData };
    this.travelData.next(combinedData);
  }

  loadAirportsData() {
    this.httpRequest.airportsData().subscribe((data) => {
      this.airportsSource.next(data);
    });
  }

  searchAirports(term: string): Observable<any[]> {
    return this.airportsData$.pipe(
      map((airports) =>
        airports.filter((airport) =>
          airport.name.toUpperCase().includes(term.toUpperCase())
        )
      )
    );
  }

  getAirportByCode(code: string): Observable<any> {
    return this.airportsData$.pipe(
      map((airports) => airports.find((airport) => airport.code === code))
    );
  }

  resetTravelData() {
    this.travelData.next(null);
  }
}
