import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { ThemeToggleComponent } from "./theme-picker/theme-toggle.component";
import { LocalStorage, NoopStorage, STORAGE_PROVIDERS } from "./storage.service";
import { windowProvider, WindowToken } from "./window";


@NgModule({
  declarations: [ThemeToggleComponent],
  imports: [
    CommonModule,

    MatButtonModule, MatIconModule,
  ],
  exports: [ThemeToggleComponent]
})
export class SharedModule { }
