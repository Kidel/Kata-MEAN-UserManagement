import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { UserService } from './user.service'

const appRoutes:Routes = [
  {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
