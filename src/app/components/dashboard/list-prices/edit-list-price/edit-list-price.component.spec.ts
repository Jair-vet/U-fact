import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListPriceComponent } from './edit-list-price.component';

describe('EditListPriceComponent', () => {
  let component: EditListPriceComponent;
  let fixture: ComponentFixture<EditListPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditListPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
