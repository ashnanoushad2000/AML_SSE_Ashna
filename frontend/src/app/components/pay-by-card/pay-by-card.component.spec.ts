import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayByCardComponent } from './pay-by-card.component';

describe('PayByCardComponent', () => {
  let component: PayByCardComponent;
  let fixture: ComponentFixture<PayByCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayByCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayByCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
