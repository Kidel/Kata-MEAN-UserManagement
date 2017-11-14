import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn:boolean;
  private email:string;

  private userStatus:number;

  constructor() {
    this.isUserLoggedIn = false;
  }

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

}
