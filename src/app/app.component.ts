import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

import { BehaviorSubject } from "rxjs";

import { VersionInfo } from "./shared-types";
import { LayoutModule } from "./layout/layout.module";
import { SharedModule } from "./shared/shared.module";
import { STORAGE_PROVIDERS } from "./shared/storage.service";

export const showTopMenuWidth = 1150;
export const dockSideNavWidth = 992;

@Component({
    selector: 'app-root',
    imports: [
        CommonModule, RouterModule,
        MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule,
        LayoutModule, SharedModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'moses-group';

  versionInfo: VersionInfo = {major: 0, full: "0.0.1"}
  pageId = 0
  showTopMenu: boolean = true;
  dockSideNav: boolean = false;

  private isSideNavDoc = false;

  isHome = true;
  _showSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild(MatSidenav, { static: true })
  sidenav: MatSidenav|undefined;
  private hostClasses: string = '';

  get isOpened() { return this.dockSideNav && this.isSideNavDoc; }
  get mode() { return this.isOpened ? 'side' : 'over'; }

  constructor(private route: ActivatedRoute) {
    this._showSidebar.next(false);
  }

  ngOnInit(): void {
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     this.isHome = event.url === "/"; // Toggle a boolean based on url
    //   });
    this.onResize(window.innerWidth);
    this.route.params.subscribe(frag => {
      console.info("frag:", frag, ';')
    });
  }

  /*toggleSidebar() {
    console.info("toggleSidebar::drawer:", this.drawer, ';')
    if (this.drawer == null) {
      this._showSidebar.next(true)
      return;
    }
    const showSidebar: boolean = this._showSidebar.getValue();
    this.drawer[showSidebar? "close" : "open"]().then(() => {
      console.info("toggleSidebar::showSidebar:", showSidebar, ';')
      this._showSidebar.next(!showSidebar);
    });
  }*/

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.showTopMenu = width >= showTopMenuWidth;
    this.dockSideNav = width >= dockSideNavWidth;

    if (this.showTopMenu && !this.isSideNavDoc && this.sidenav) {
      // If this is a non-sidenav doc and the screen is wide enough so that we can display menu
      // items in the top-bar, ensure the sidenav is closed.
      // (This condition can only be met when the resize event changes the value of `showTopMenu`
      //  from `false` to `true` while on a non-sidenav doc.)
      this.sidenav.toggle(false);
    }
  }

  updateHostClasses() {
    const sideNavOpen = `sidenav-${this.sidenav && this.sidenav.opened ? 'open' : 'closed'}`;

    this.hostClasses = [
      sideNavOpen,
    ].join(' ');
  }
}
