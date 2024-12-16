import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRawMaterialComponent } from './edit-raw-material.component';

describe('EditRawMaterialComponent', () => {
  let component: EditRawMaterialComponent;
  let fixture: ComponentFixture<EditRawMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRawMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRawMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
