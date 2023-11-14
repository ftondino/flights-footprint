import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FootprintService } from './footprint.service';

describe('FootprintService', () => {
  let service: FootprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FootprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
