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
  shoppingAddressStates: State[] = [];


  constructor(
    private formBuilder: FormBuilder, 
    private cartService: CartService, 
    private formService: FormService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(null, [Validators.required, Validators.minLength(2), 
                                        CustomerValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                        CustomerValidators.notOnlyWhiteSpace]),
        // [Q] why we are not  using Angular:Validators.email ??
        // [A] Validators.email only checks for : <some text>@<some text>
        // ex : angular@gmail will pass by Validators.email
        // ps : Validators.email and Validators.pattern only checks the FORMAT. 
        //      Doesn't verify if email address is real. 
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), 
                                    CustomerValidators.notOnlyWhiteSpace])
      }),
      shoppingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                     CustomerValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                   CustomerValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      CustomerValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), 
                                         CustomerValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{16}")]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]{3}")]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
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

  // shoppingAddress getter function
  get shoppingAddressStreet() {
    return this.checkoutFormGroup.get("shoppingAddress.street")
  }
  get shoppingAddressCity() {
    return this.checkoutFormGroup.get("shoppingAddress.city")
  }
  get shoppingAddressState() {
    return this.checkoutFormGroup.get("shoppingAddress.state")
  }
  get shoppingAddressCountry() {
    return this.checkoutFormGroup.get("shoppingAddress.country")
  }
  get shoppingAddressZipCode() {
    return this.checkoutFormGroup.get("shoppingAddress.zipCode")
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
    let shoppingAddress: Address = this.checkoutFormGroup.controls["shoppingAddress"].value;

    // set up purchase
    let purchase: Purchase = new Purchase(customer=customer, 
                                          shoppingAddress=shoppingAddress,
                                          order=order,
                                          orderItems=orderItems);


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
    const formGroup = this.checkoutFormGroup.get("shoppingAddress");
    const countryName:String = formGroup?.value.country.name;
    const countryCode:String = formGroup?.value.country.code;


    console.log(`country code : ${countryCode}`);
    console.log(`country name : ${countryName}`);
    this.formService.getStates(countryCode).subscribe(
      data => {
        this.shoppingAddressStates = data;
        formGroup?.get("state")?.setValue(data[0]);
      }
    )
  }
  
}
