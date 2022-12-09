import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { CustomerValidators } from 'src/app/common/customer-validators';
import { OrderItem } from 'src/app/common/order-item';
import { Order } from 'src/app/common/order';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { CartDetailsComponent } from '../cart-details/cart-details.component';
import { Purchase } from 'src/app/common/purchase';
import { Customer } from 'src/app/common/customer';
import { Address } from 'src/app/common/address';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  checkoutFormGroup!: FormGroup;

  creditCardMonth: number[] = [];
  creditCardYear: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];


  constructor(
    private formBuilder: FormBuilder, 
    private cartService: CartService, 
    private formService: FormService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {
    // I use document.getElementsByClassName('ng-invalid') in website's console to find the invalid form control.
    // I take off the customer validator, and then the form group workink.
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                        ]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                        ]),
        // [Q] why we are not  using Angular:Validators.email ??
        // [A] Validators.email only checks for : <some text>@<some text>
        // ex : angular@gmail will pass by Validators.email
        // ps : Validators.email and Validators.pattern only checks the FORMAT. 
        //      Doesn't verify if email address is real. 
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), 
                                    ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                     ]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                   ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl(''),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl(''),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
                                         ]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{16}")]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]{3}")]),
        expirationMonth: new FormControl(''),
        expirationYear: new FormControl('')
      })
    })

    this.reviewCartDetail();

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    )

    // populate credit card years
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYear = data;
      }
    )

    // populate countries
    this.formService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

    // find the invalid control
    const subFormGroupName = ["customer", "shippingAddress", "creditCard"];
    const invalid = [];

    for (let name in subFormGroupName){
      console.log(this.checkoutFormGroup.controls["customer"].invalid);
    }
  }

  // customer getter function
  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName")
  }
  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName")
  }
  get email() {
    return this.checkoutFormGroup.get("customer.email")
  }

  // shippingAddress getter function
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get("shppingAddress.street")
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get("shippingAddress.city")
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get("shippingAddress.state")
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get("shippingAddress.country")
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get("shippingAddress.zipCode")
  }

  // creditCard getter function
  get creditCardType() {
    return this.checkoutFormGroup.get("creditCard.cardType")
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get("creditCard.nameOnCard")
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get("creditCard.cardNumber")
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get("creditCard.securityCode")
  }


  

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    // set up order
    let order: Order = new Order(this.totalPrice, this.totalQuantity);
    
    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // populate purchase - customer
    let customer: Customer = this.checkoutFormGroup.controls["customer"].value;

    // populate purchase - shipping address
    let shippingAddress: Address = this.checkoutFormGroup.controls["shippingAddress"].value;
    const state = JSON.parse(JSON.stringify(shippingAddress.state)).name;
    const country = JSON.parse(JSON.stringify(shippingAddress.country)).name;
    shippingAddress.state = state;
    shippingAddress.country = country;

    // set up purchase
    let purchase: Purchase = new Purchase(customer=customer, 
                                          shippingAddress=shippingAddress,
                                          order=order,
                                          orderItems=orderItems);

    console.log("my purchase information\n", purchase);
    // call REST API via the checkoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response=>{
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err=>{
          alert(`There was an error ${err.message}`);
        }
      }
    )
  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
  
    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the product page
    this.router.navigateByUrl("/products");
  }

  reviewCartDetail() {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);


    // if the current year equal selected year, then month = current month ~ 12
    // otherwise, 1 ~ 12.

    let startMonth:number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1
    }


    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    )
  }

  getStates() {
    const formGroup = this.checkoutFormGroup.get("shippingAddress");
    const countryName:String = formGroup?.value.country.name;
    const countryCode:String = formGroup?.value.country.code;


    console.log(`country code : ${countryCode}`);
    console.log(`country name : ${countryName}`);
    this.formService.getStates(countryCode).subscribe(
      data => {
        this.shippingAddressStates = data;
        formGroup?.get("state")?.setValue(data[0]);
      }
    )
  }
  
}

