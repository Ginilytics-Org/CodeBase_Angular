import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAndRouterOutletAndFoooterComponent } from './header-and-router-outlet-and-foooter.component';

describe('HeaderAndRouterOutletAndFoooterComponent', () => {
  let component: HeaderAndRouterOutletAndFoooterComponent;
  let fixture: ComponentFixture<HeaderAndRouterOutletAndFoooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAndRouterOutletAndFoooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderAndRouterOutletAndFoooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
