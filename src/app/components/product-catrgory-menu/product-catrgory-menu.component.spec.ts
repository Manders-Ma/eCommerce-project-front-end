import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatrgoryMenuComponent } from './product-catrgory-menu.component';

describe('ProductCatrgoryMenuComponent', () => {
  let component: ProductCatrgoryMenuComponent;
  let fixture: ComponentFixture<ProductCatrgoryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCatrgoryMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCatrgoryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
