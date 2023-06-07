import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-demo-deploy',
  templateUrl: './demo-deploy.html',
  styleUrls: [
    '../doc/doc.scss'
  ]
})
export class DemoDeploy implements OnDestroy {
  private mediaRecorder: MediaRecorder | undefined;
  promptForAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
      });
  }

  ngOnDestroy() {
    this.mediaRecorder?.stop();
  }
}
