import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FootprintService } from './footprint.service';
import { HttpRequestService } from './http-request.service';

describe('FootprintService', () => {
  let service: FootprintService;
  let httpRequestService: HttpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FootprintService, HttpRequestService],
    });
    service = TestBed.inject(FootprintService);
    httpRequestService = TestBed.inject(HttpRequestService);

    const airports = [
      { name: 'New York City', code: 'NYC' },
      { name: 'Los Angeles', code: 'LAX' },
    ];
    spyOn(httpRequestService, 'airportsData').and.returnValue(of(airports));
    service.loadAirportsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load airports data on creation', () => {
    expect(httpRequestService.airportsData).toHaveBeenCalled();
  });

  it('should update travel data', () => {
    const data = { origin: 'NYC', destination: 'LAX' };
    const additionalData = { distance: 1000 };
    service.updateTravel(data, additionalData);
    service.currentTravel.subscribe((travelData) => {
      expect(travelData).toEqual({ ...data, ...additionalData });
    });
  });

  it('should get airport by code', () => {
    const code = 'NYC';
    service.getAirportByCode(code).subscribe((airport) => {
      expect(airport).toEqual({ name: 'New York City', code: 'NYC' });
    });
  });

  it('should reset travel data', () => {
    const data = { origin: 'NYC', destination: 'LAX' };
    service.updateTravel(data, {});
    service.resetTravelData();

    service.currentTravel.subscribe((travelData) => {
      expect(travelData).toBeNull();
    });
  });
});
