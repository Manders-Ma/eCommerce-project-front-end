import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { CustomerValidators } from 'src/app/common/customer-validators';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { CartDetailsComponent } from '../cart-details/cart-details.component';



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


  constructor(private formBuilder: FormBuilder, private cartService: CartService, private formService:FormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomerValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomerValidators.notOnlyWhiteSpace]),
        // [Q] why we are not  using Angular:Validators.email ??
        // [A] Validators.email only checks for : <some text>@<some text>
        // ex : angular@gmail will pass by Validators.email
        // ps : Validators.email and Validators.pattern only checks the FORMAT. 
        //      Doesn't verify if email address is real. 
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+//.[a-z]{2,4}$"), CustomerValidators.notOnlyWhiteSpace])
      }),
      shoppingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    })

    this.updateCartStatus();

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

  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName")
  }
  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName")
  }
  get email() {
    return this.checkoutFormGroup.get("customer.email")
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  updateCartStatus() {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and total quantity
    this.cartService.computeCartTotals();
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
