import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesDetailsComponent } from './planes-details.component';

describe('PlanesDetailsComponent', () => {
  let component: PlanesDetailsComponent;
  let fixture: ComponentFixture<PlanesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
