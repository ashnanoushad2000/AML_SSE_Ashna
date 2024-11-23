import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaAdditionMethodComponent } from './media-addition-method.component';

describe('MediaAdditionMethodComponent', () => {
  let component: MediaAdditionMethodComponent;
  let fixture: ComponentFixture<MediaAdditionMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaAdditionMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaAdditionMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
