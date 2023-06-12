import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";

import { demoDeployRoutes } from "./demo-deploy.routes";
import { DemoDeployComponent } from "./demo-deploy.component";

@NgModule({
  declarations: [
    DemoDeployComponent,
  ],
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(demoDeployRoutes),
    MatInputModule, MatIconModule, FormsModule, MatButtonModule, MatTabsModule, ReactiveFormsModule,
  ],
})
export class DemoModule { }
