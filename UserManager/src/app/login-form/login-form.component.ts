import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/retry';
import { Router } from '@angular/router';

import { UserService } from '../user.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private user:UserService) {}

  loginResponseBehavior = data => this.user.setLogin(data['email'], data['logged'], () => { if(!data['logged']) console.log(data['err']); else this.router.navigate(['dashboard']);});
  requestErrorBehavior = err => { console.log('Something went wrong with the request!'); }; 
  
  ngOnInit() {
    // Make the HTTP request:
    this.http.get('/api/logged').retry(3).subscribe(
      this.loginResponseBehavior, 
      this.requestErrorBehavior
    );
  }

  // TODO should use a common library for login and logout operations
  loginUser(e) {
  	e.preventDefault();
  	var email = e.target.elements[0].value;
  	var password = e.target.elements[1].value;
  	this.http.post('/api/login', {email: email, password: password}).retry(3).subscribe(
      this.loginResponseBehavior, 
      this.requestErrorBehavior
    );

    return false;
  }
}
