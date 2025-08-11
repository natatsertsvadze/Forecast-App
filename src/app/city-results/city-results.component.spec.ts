import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityResultsComponent } from './city-results.component';

describe('CityResultsComponent', () => {
  let component: CityResultsComponent;
  let fixture: ComponentFixture<CityResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
