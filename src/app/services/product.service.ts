import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';


  constructor(private httpClient : HttpClient) { }

  getProductList(theCategoryId: number) : Observable<Product[]> {
    // @Todo: need to build URL based on category id ... will come back to this!
    const searchUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl)
  }


  getProductCategories() : Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  searchProducts(theKeyword: string) : Observable<Product[]> {
    const searchUrl: string = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl)
  }

  getProduct(theProductId: number) : Observable<Product> {
    const searchUrl: string = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPaginate(thePageNumber: number, thePageSize: number, theCategoryId: number) {
    // @Todo: need to build URL based on category id ... will come back to this!
    const searchUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` 
    + `&page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
}

interface GetResponseProducts {
  _embedded : {
    products: Product[];
  },
  page : {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategories {
  _embedded : {
    productCategory: ProductCategory[];
  }
}