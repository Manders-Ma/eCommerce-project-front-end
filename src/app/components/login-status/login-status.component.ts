import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js'

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: String = "";

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    // subscribe to authentication state change
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if (this.isAuthenticated) {
      // Fetch the logged in user details (user's claim)

      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name! as String;
        }
      )
    }
  }

  logout() {
    // Terminate the session with Okta and remove the current tokens.
    this.oktaAuth.signOut();
  }

}
