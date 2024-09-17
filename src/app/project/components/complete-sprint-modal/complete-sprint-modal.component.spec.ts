import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSprintModalComponent } from './complete-sprint-modal.component';

describe('CompleteSprintModalComponent', () => {
  let component: CompleteSprintModalComponent;
  let fixture: ComponentFixture<CompleteSprintModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteSprintModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteSprintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
