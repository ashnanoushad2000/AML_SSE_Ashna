import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMediaAdditionComponent } from './single-media-addition.component';

describe('SingleMediaAdditionComponent', () => {
  let component: SingleMediaAdditionComponent;
  let fixture: ComponentFixture<SingleMediaAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleMediaAdditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleMediaAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
