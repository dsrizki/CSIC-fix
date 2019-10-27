import { Component } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('* => *', animate("2s", keyframes([
        style({ backgroundColor: "red" }), // offset = 0
        style({ backgroundColor: "blue" }), // offset = 0.33
        style({ backgroundColor: "orange" }), // offset = 0.66
        style({ backgroundColor: "black" }) // offset = 1
      ])))
    ])
  ]
})
export class HomePage {
  visibility: string = 'shown';
  constructor() {}

}
