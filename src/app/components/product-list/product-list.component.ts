import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  currentCategoryId:number=1;
  products:Product[]=[];
  searchMode: boolean=false;


  constructor(private productService: ProductService, private route: ActivatedRoute) { }
  // like as @PostContructor
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
    
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products=data;
      }
    )
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get parameter "id" string. convert string to number using the "+" symbol.
      // Symbol "!" can talk to compiler that the object is not null.
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
    }
    else {
      // not category id is available...default to category id 1.
      this.currentCategoryId = 1;
    }



    // get the products for the given category id.
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
