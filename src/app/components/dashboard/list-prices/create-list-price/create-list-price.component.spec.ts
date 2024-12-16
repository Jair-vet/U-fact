import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListPriceComponent } from './create-list-price.component';

describe('CreateListPriceComponent', () => {
  let component: CreateListPriceComponent;
  let fixture: ComponentFixture<CreateListPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateListPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateListPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
