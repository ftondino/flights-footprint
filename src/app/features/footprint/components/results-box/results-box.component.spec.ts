import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatExpansionModule } from '@angular/material/expansion';

import { ResultsBoxComponent } from './results-box.component';

describe('ResultsBoxComponent', () => {
  let component: ResultsBoxComponent;
  let fixture: ComponentFixture<ResultsBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsBoxComponent],
      imports: [HttpClientTestingModule, MatExpansionModule],
    });
    fixture = TestBed.createComponent(ResultsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
