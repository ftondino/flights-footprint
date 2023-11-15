import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [SearchBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment passenger count', () => {
    component.increment();
    expect(component.dataForm.controls['passeggeri'].value).toEqual(2);
  });

  it('should decrement passenger count', () => {
    component.increment();
    component.decrement();
    expect(component.dataForm.controls['passeggeri'].value).toEqual(1);
  });

  it('should not decrement passenger count below 1', () => {
    component.decrement();
    expect(component.dataForm.controls['passeggeri'].value).toEqual(1);
  });

  it('should reset form', () => {
    component.reset();
    expect(component.dataForm.value).toEqual({
      partenza: '',
      destinazione: '',
      classe: '',
      passeggeri: 1,
    });
  });

  it('should select airport', () => {
    const airport = { code: 'XYZ' };
    component.selectAirport('partenza', airport);
    expect(component.dataForm.controls['partenza'].value).toEqual('XYZ');
    expect(component.selectedAirports['partenza']).toEqual(airport);
  });
});
