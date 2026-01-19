import { Component, Input } from '@angular/core';

import { VersionInfo } from "../../shared-types";


@Component({
    selector: 'aio-footer',
    templateUrl: 'footer.component.html',
    host: { 'class': 'aio-footer' },
    standalone: false
})
export class FooterComponent {
  @Input() versionInfo: VersionInfo | undefined;

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
