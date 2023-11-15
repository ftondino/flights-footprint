import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpRequestService } from './http-request.service';

describe('HttpRequestService', () => {
  let service: HttpRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpRequestService],
    });

    service = TestBed.inject(HttpRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch footprint data', () => {
    const mockData: any = {};

    service
      .footprintData('origin', 'destination', 'cabin')
      .subscribe((data) => {
        expect(data).toEqual(mockData);
      });

    const req = httpMock.expectOne((req) =>
      req.url.includes('flight_footprint')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch airports data', () => {
    const mockData: any[] = [];

    service.airportsData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne((req) => req.url.includes('airports.json'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
