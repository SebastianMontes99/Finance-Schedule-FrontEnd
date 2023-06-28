import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidevaarComponent } from './sidevaar.component';

describe('SidevaarComponent', () => {
  let component: SidevaarComponent;
  let fixture: ComponentFixture<SidevaarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidevaarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidevaarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
