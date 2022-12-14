import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  currentCategoryId:number=1;
  products:Product[]=[];
  searchMode: boolean=false;

    // new properties for pagination
    previousCategoryId: number = 1;
    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    // new properties for search pagination
    previousKeyword: string = "";


  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }
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
    
    // if we have different keyword than previous
    // then set thePageNumber back to 1
    if (theKeyword !== this.previousKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;


    // now search for the products using keyword
    this.productService.searchProductListPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
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

    // Check if we have a different category than previous
    // then set thePagenumer back to 1.

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;


    
    // get the products for the given category id.
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

  updatePageSize(pageSize: string) {
    this.thePageNumber = 1;
    this.thePageSize = +pageSize;
    this.listProducts();    
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart : ${theProduct.name}, ${theProduct.unitPrice}`);

    // TODO ... do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);

  }
}
