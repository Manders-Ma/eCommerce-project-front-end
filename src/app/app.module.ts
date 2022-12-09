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
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

// import services
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { FormService } from './services/form.service';

// import module for using ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { CheckoutService } from './services/checkout.service';
import { LoginStatusComponent } from './components/login-status/login-status.component';

// import okta angular sdk, okta js sdk and my app config
import { OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import appConfig from './config/app-config';

const oktaConfig = appConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

// set up routes constant where you define your routes.
const routes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: "category/:id", component: ProductListComponent},
  {path: "cart-details", component: CartDetailsComponent},
  {path: "checkout", component: CheckoutComponent},
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
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, CartService, FormService, CheckoutService, {provide: OKTA_CONFIG, useValue: {oktaAuth}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
