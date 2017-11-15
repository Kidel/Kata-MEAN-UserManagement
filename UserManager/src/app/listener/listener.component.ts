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
  mouseListener:() => void;
  keyboardListener:() => void;
  
  constructor(private renderer:Renderer2, private user:UserService) { 
    this.resetTimer();
   }

  ngAfterViewInit() {
    this.activateListeners();
  }

  ngOnDestroy() {
    this.deactivateListeners();
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

  activateListeners() {
    console.log("activating listeners");
    this.mouseListener = this.renderer.listen('window', 'click', () => {
      this.setActiveAndResetTimer();
      console.log("click");
    });
    this.keyboardListener = this.renderer.listen('window', 'keypress', () => {
      this.setActiveAndResetTimer();
      console.log("keypress");
    });
  }

  deactivateListeners() {
    console.log("deactivating listeners");
    if(this.mouseListener) this.mouseListener();
    if(this.keyboardListener) this.keyboardListener();
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