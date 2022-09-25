import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'

// CLI imports router
import { Routes, RouterModule } from '@angular/router';

// import components
import { ProductCatrgoryMenuComponent } from './components/product-catrgory-menu/product-catrgory-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';

// import services
import { ProductService } from './services/product.service';

// import module for using ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';


// set up routes constant where you define your routes.
const routes: Routes = [
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: "category/:id", component: ProductListComponent},
  {path: "category", component: ProductListComponent},
  {path: "products", component: ProductListComponent},
  // for empty url(relative path /)
  {path: '', redirectTo: "/products", pathMatch: "full"},
  // for any not match url
  {path: "**", redirectTo: "/products", pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCatrgoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
