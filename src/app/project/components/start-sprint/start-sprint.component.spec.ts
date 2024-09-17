import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSprintComponent } from './start-sprint.component';

describe('StartSprintComponent', () => {
  let component: StartSprintComponent;
  let fixture: ComponentFixture<StartSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartSprintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
