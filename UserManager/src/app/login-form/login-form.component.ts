import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  //constructor(private router:Router, private user:UserService) { }

  ngOnInit() {
    console.log('hit');
  }

  loginUser(e) {
  	e.preventDefault();
  	console.log(e);
  	var username = e.target.elements[0].value;
  	var password = e.target.elements[1].value;
    console.log(username, password);
    return false;

  	/*if(username == 'admin' && password == 'admin') {
      this.user.setUserLoggedIn();
  		this.router.navigate(['dashboard']);
  	}*/
  }

}
