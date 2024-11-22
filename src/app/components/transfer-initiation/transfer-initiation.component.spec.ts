import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferInitiationComponent } from './transfer-initiation.component';

describe('TransferInitiationComponent', () => {
  let component: TransferInitiationComponent;
  let fixture: ComponentFixture<TransferInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferInitiationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
