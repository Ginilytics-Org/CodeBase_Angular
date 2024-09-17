import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserInProjectModalComponent } from './add-user-in-project-modal.component';

describe('AddUserInProjectModalComponent', () => {
  let component: AddUserInProjectModalComponent;
  let fixture: ComponentFixture<AddUserInProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserInProjectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUserInProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
