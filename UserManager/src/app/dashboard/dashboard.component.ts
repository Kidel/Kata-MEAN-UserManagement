import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/retry';
import { Router } from '@angular/router';

import { ListenerComponent } from '../listener/listener.component'

import { UserService } from '../user.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private user:UserService) {}

  logoutResponseBehavior = data => this.user.setLogin(null, data['logged'], () => { this.router.navigate(['']);});
  requestErrorBehavior = err => { console.log('Something went wrong with the request!'); }; 
  loginResponseBehavior = data => this.user.setLogin(data['email'], data['logged'], () => { if(!data['logged']) this.router.navigate(['']);});
  
  ngOnInit() {
    // Make the HTTP request:
    this.http.get('/api/logged').retry(3).subscribe(
      this.loginResponseBehavior, 
      this.requestErrorBehavior
    );
  }

  // TODO should use a common library for login and logout operations
  logoutUser(e) {
  	e.preventDefault();
  	this.http.post('/api/logout', {}).retry(3).subscribe(
      this.logoutResponseBehavior,
      this.requestErrorBehavior 
    );

    return false;
  }

}
