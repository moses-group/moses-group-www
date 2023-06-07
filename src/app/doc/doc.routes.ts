import { Routes } from '@angular/router';

import { DemoDeploy } from "../demo-deploy/demo-deploy";
import { LearnMoreComponent } from "../learn-more/learn-more.component";


export const docRoutes: Routes = [
  {path: 'demo-deploy', component: DemoDeploy },
  {path: 'more', component: LearnMoreComponent}
];
