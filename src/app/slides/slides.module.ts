import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from "@angular/material/dialog";

import { SlidesComponent } from "./slides.component";


@NgModule({
  declarations: [SlidesComponent],
    imports: [CommonModule, MatDialogModule]
})
export class SlidesModule { }
