import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

import { LearnMoreComponent } from "../learn-more/learn-more.component";
import { docRoutes } from "./doc.routes";

@NgModule({
  declarations: [
    LearnMoreComponent
  ],
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(docRoutes),
    MatSidenavModule, MatDialogModule, MatButtonModule, MatInputModule, MatIconModule,
    FormsModule
  ]
})
export class DocModule { }
