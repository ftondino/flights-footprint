import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatExpansionModule } from '@angular/material/expansion';

import { ResultsBoxComponent } from './results-box.component';
import { FootprintService } from '../../services/footprint.service';

describe('ResultsBoxComponent', () => {
  let component: ResultsBoxComponent;
  let fixture: ComponentFixture<ResultsBoxComponent>;
  let footprintService: FootprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsBoxComponent],
      imports: [HttpClientTestingModule, MatExpansionModule],
      providers: [FootprintService],
    });
    fixture = TestBed.createComponent(ResultsBoxComponent);
    component = fixture.componentInstance;
    footprintService = TestBed.inject(FootprintService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to currentTravel on init', () => {
    const data = { test: 'test' };
    spyOn(footprintService.currentTravel, 'subscribe');
    component.ngOnInit();
    expect(footprintService.currentTravel.subscribe).toHaveBeenCalled();
  });

  it('should unsubscribe and reset results on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription'] = subscription;
    component.ngOnDestroy();
    expect(subscription.unsubscribe).toHaveBeenCalled();
    expect(component.results).toBeNull();
  });

  it('should reset results on new search', () => {
    component.newSearch();
    expect(component.results).toBeNull();
  });
});
