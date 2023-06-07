import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { SlidesComponent } from "../slides/slides.component";

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.component.html',
  styleUrls: [
    '../doc/doc.scss'
  ]
})
export class LearnMoreComponent {
  constructor(public dialog: MatDialog) {}
  openSlides() {
    this.dialog.open(SlidesComponent, {
      width: "1000px",
      height: "600px",
      enterAnimationDuration: '1500ms',
      exitAnimationDuration:'0ms'
    });
  }
}
