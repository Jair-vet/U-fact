import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequisitionComponent } from './edit-requisition.component';

describe('EditRequisitionComponent', () => {
  let component: EditRequisitionComponent;
  let fixture: ComponentFixture<EditRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRequisitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
