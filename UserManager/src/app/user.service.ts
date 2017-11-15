import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  private isUserLoggedIn:boolean = false;
  private email:string = null;

  private userStatus:boolean = false;

  constructor(private http: HttpClient) { }

  setIsUserLoggedIn(status:boolean) {
    this.isUserLoggedIn = status;
  }
  getIsUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  setEmail(email:string) {
    this.email = email;
  }
  getEmail() {
    return this.email;
  }
  
  setLogin(email, data, callback) {
    this.setIsUserLoggedIn(data);
    if(data) this.setEmail(email);
    console.log("logged: " + this.isUserLoggedIn);
    callback();
  }

  setStatus(userStatus:boolean) {
    this.userStatus = userStatus;
  }
  getStatus() {
    return this.userStatus;
  }

  updateResponseBehavior = data => { if(data['err']) console.log(data['err']); };
  requestErrorBehavior = err => { console.log('Something went wrong with the request!'); }; // TODO: check 4xx and 5xx errors

  persistStatus(status:boolean) {
    // Make the HTTP request:
    this.http.put('/api/updateStatus', {status:status}).retry(3).subscribe(
      this.updateResponseBehavior, 
      this.requestErrorBehavior
    )
  }

}
