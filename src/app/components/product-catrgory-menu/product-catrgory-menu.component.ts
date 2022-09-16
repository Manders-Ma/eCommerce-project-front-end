import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-catrgory-menu',
  templateUrl: './product-catrgory-menu.component.html',
  styleUrls: ['./product-catrgory-menu.component.css']
})
export class ProductCatrgoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.ListProductCategories();
  }

  ListProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log("Product Categories = " + JSON.stringify(data));
        this.productCategories = data;
      }
    )
  }

}
