import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCommentComponent } from './history-comment.component';

describe('HistoryCommentComponent', () => {
  let component: HistoryCommentComponent;
  let fixture: ComponentFixture<HistoryCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
