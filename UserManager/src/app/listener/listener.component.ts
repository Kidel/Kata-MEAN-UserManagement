import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserService } from '../user.service'

@Component({
  selector: 'app-listener',
  templateUrl: './listener.component.html',
  styleUrls: ['./listener.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class ListenerComponent implements AfterViewInit { 
  
  timer;
  
  constructor(private renderer:Renderer2, private user:UserService) { 
    this.resetTimer();
   }

  ngAfterViewInit() {
    this.renderer.listen('window', 'click', () => {
      this.setActiveAndResetTimer();
      console.log("click");
    });
    /*
    this.renderer.listen('window', 'mousemove', () => {
      this.setActiveAndResetTimer();
      console.log("move");
    });
    this.renderer.listen('window', 'keypress', () => {
      this.setActiveAndResetTimer();
      console.log("keypress");
    });
    this.renderer.listen('window', 'touchmove', () => {
      this.setActiveAndResetTimer();
      console.log("touch");
    });
    this.renderer.listen('window', 'mousewheel', () => {
      this.setActiveAndResetTimer();
      console.log("wheel");
    });
    */

  }

  resetTimer() {
    if (this.timer) {
        clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      console.log("inactive");
      if(this.user.getStatus()) this.user.persistStatus(false);
      this.user.setStatus(false);
    }, 15 * 1000); // TODO longer period
  }

  setActive() {
    console.log("active");
    if(!this.user.getStatus()) this.user.persistStatus(true);
    this.user.setStatus(true);
  }

  setActiveAndResetTimer() {
    this.setActive(); 
    this.resetTimer();
  }
} 