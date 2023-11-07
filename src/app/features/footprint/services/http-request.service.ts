import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {
  private apiUrl = 'https://api.goclimate.com/v1/flight_footprint';
  private airportsUrl =
    'https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json';
  private key = '54c1f89225a646401f18258c';

  constructor(private http: HttpClient) {}

  footprintData(origin: string, destination: string, cabin: string) {
    const params = new HttpParams()
      .set('segments[0][origin]', origin)
      .set('segments[0][destination]', destination)
      .set('cabin_class', cabin);
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(this.key),
    });

    return this.http.get(this.apiUrl, { headers, params });
  }

  airportsData() {
    return this.http.get<any[]>(this.airportsUrl);
  }
}
