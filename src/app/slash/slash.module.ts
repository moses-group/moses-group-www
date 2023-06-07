import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { SlashComponent } from './slash.component';
import { slashRoutes } from "./slash.routes";
@NgModule({
    declarations: [
      SlashComponent,
    ],
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(slashRoutes),
  ],

})
export class SlashModule { }
