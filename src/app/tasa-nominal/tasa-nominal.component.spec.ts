import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasaNominalComponent } from './tasa-nominal.component';

describe('TasaNominalComponent', () => {
  let component: TasaNominalComponent;
  let fixture: ComponentFixture<TasaNominalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasaNominalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasaNominalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
