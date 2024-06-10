import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";

import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: 'aio-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent {
  @Input() isWide = false;

  @Input() parent: MatSidenav | undefined;

  constructor(private router: Router) {}

  goAndCloseParent(path: string) {
    this.router.navigate([path]).then(() => {
      if (this.parent) this.parent?.close();
    }).catch(console.error);
  }
}
