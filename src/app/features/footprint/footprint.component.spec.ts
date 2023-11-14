import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResultsBoxComponent } from './components/results-box/results-box.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { FootprintComponent } from './footprint.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
describe('FootprintComponent', () => {
  let component: FootprintComponent;
  let fixture: ComponentFixture<FootprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FootprintComponent,
        MapComponent,
        SearchBoxComponent,
        ResultsBoxComponent,
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        MatExpansionModule,
        ReactiveFormsModule,
        FormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FootprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBoxComponent],
      imports: [HttpClientModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset', () => {
    if (component.myForm) {
      component.reset();
      expect(component.myForm.nativeElement).toBeDefined();
    }
  });
});
