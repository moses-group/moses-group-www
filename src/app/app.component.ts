import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { MatSidenav } from "@angular/material/sidenav";

import { BehaviorSubject } from "rxjs";

import { VersionInfo } from "./shared-types";

export const showTopMenuWidth = 1150;
export const dockSideNavWidth = 992;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {'class': 'page-home'}
})
export class AppComponent implements OnInit {
  title = 'moses-group-ng';

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
