import {AfterViewInit, Component, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {take} from "rxjs";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FormControl, FormGroup} from "@angular/forms";

import { ChatInterface, ChatModule, ChatWorkerClient, ModelRecord } from "@mlc-ai/web-llm";

interface AppConfig {
  model_list: Array<ModelRecord>;
  model_lib_map?: Record<string, string>;
}

function getElementAndCheck(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (element == null) {
    throw Error("Cannot find element " + id);
  }
  return element;
}

class ChatUI {
  private uiChat: HTMLElement;
  private uiChatInput: HTMLInputElement;
  private uiChatInfoLabel: HTMLLabelElement;
  private chat: ChatInterface;
  // private config: AppConfig;
  private selectedModel: string;
  private chatLoaded = false;
  private requestInProgress = false;
  // We use a request chain to ensure that
  // all requests send to chat are sequentialized
  private chatRequestChain: Promise<void> = Promise.resolve();

  constructor(chat: ChatInterface) {
    // use web worker to run chat generation in background
    this.chat = chat;
    // get the elements
    this.uiChat = getElementAndCheck("chatui-chat");
    this.uiChatInput = getElementAndCheck("chatui-input") as HTMLInputElement;
    this.uiChatInfoLabel = getElementAndCheck("chatui-info-label") as HTMLLabelElement;
    // register event handlers
    getElementAndCheck("chatui-reset-btn").onclick = () => {
      this.onReset();
    };
    getElementAndCheck("chatui-send-btn").onclick = () => {
      this.onGenerate();
    };
    // TODO: find other alternative triggers
    getElementAndCheck("chatui-input").onkeypress = (event) => {
      if (event.keyCode === 13) {
        this.onGenerate();
      }
    };

    const modelSelector = getElementAndCheck("chatui-select") as HTMLSelectElement;
    /*for (let i = 0; i < this.config.model_list.length; ++i) {
      const item = this.config.model_list[i];
      const opt = document.createElement("option");
      opt.value = item.local_id;
      opt.innerHTML = item.local_id;
      opt.selected = (i == 0);
      modelSelector.appendChild(opt);
    }*/
    this.selectedModel = modelSelector.value;
    modelSelector.onchange = () => {
      this.onSelectChange(modelSelector);
    };
  }
  /**
   * Push a task to the execution queue.
   *
   * @param task The task to be executed;
   */
  private pushTask(task: ()=>Promise<void>) {
    const lastEvent = this.chatRequestChain;
    this.chatRequestChain = lastEvent.then(task);
  }
  // Event handlers
  // all event handler pushes the tasks to a queue
  // that get executed sequentially
  // the tasks previous tasks, which causes them to early stop
  // can be interrupted by chat.interruptGenerate
  private async onGenerate() {
    if (this.requestInProgress) {
      return;
    }
    this.pushTask(async () => {
      await this.asyncGenerate();
    });
  }

  private async onSelectChange(modelSelector: HTMLSelectElement) {
    if (this.requestInProgress) {
      // interrupt previous generation if any
      this.chat.interruptGenerate();
    }
    // try reset after previous requests finishes
    this.pushTask(async () => {
      await this.chat.resetChat();
      this.resetChatHistory();
      await this.unloadChat();
      this.selectedModel = modelSelector.value;
      await this.asyncInitChat();
    });
  }

  private async onReset() {
    if (this.requestInProgress) {
      // interrupt previous generation if any
      this.chat.interruptGenerate();
    }
    // try reset after previous requests finishes
    this.pushTask(async () => {
      await this.chat.resetChat();
      this.resetChatHistory();
    });
  }

  // Internal helper functions
  private appendMessage(kind: string, text: string): void {
    if (kind == "init") {
      text = "[System Initalize] " + text;
    }
    if (this.uiChat === undefined) {
      throw Error("cannot find ui chat");
    }
    const msg = `
      <div class="msg ${kind}-msg">
        <div class="msg-bubble">
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;
    this.uiChat.insertAdjacentHTML("beforeend", msg);
    this.uiChat.scrollTo(0, this.uiChat.scrollHeight);
  }

  private updateLastMessage(kind: string, text: string): void {
    if (kind == "init") {
      text = "[System Initalize] " + text;
    }
    if (this.uiChat === undefined) {
      throw Error("cannot find ui chat");
    }
    const matches = this.uiChat.getElementsByClassName(`msg ${kind}-msg`);
    if (matches.length == 0) throw Error(`${kind} message do not exist`);
    const msg = matches[matches.length - 1];
    const msgText = msg.getElementsByClassName("msg-text");
    if (msgText.length != 1) throw Error("Expect msg-text");
    if (msgText[0].innerHTML == text) return;
    const list = text.split('\n').map((t) => {
      const item = document.createElement('div');
      item.textContent = t;
      return item;
    });
    msgText[0].innerHTML = '';
    list.forEach((item) => msgText[0].append(item));
    this.uiChat.scrollTo(0, this.uiChat.scrollHeight);
  }

  private resetChatHistory() {
    const clearTags = ["left", "right", "init", "error"];
    /*for (const tag of clearTags) {
      // need to unpack to list so the iterator don't get affected by mutation
      const matches = [...this.uiChat.getElementsByClassName(`msg ${tag}-msg`)];
      for (const item of matches) {
        this.uiChat.removeChild(item);
      }
    }*/
    if (this.uiChatInfoLabel !== undefined) {
      this.uiChatInfoLabel.innerHTML = "";
    }
  }

  private async asyncInitChat() {
    if (this.chatLoaded) return;
    this.requestInProgress = true;
    this.appendMessage("init", "");
    const initProgressCallback = (report: {text: string}) => {
      this.updateLastMessage("init", report.text);
    }
    this.chat.setInitProgressCallback(initProgressCallback);

    /*try {
      await this.chat.reload(this.selectedModel, undefined,
        this.config);
    } catch (err: any | {toString(): string, stack: string[]}) {
      this.appendMessage("error", "Init error, " + err.toString());
      console.log(err.stack);
      this.unloadChat();
      this.requestInProgress = false;
      return;
    }*/
    this.requestInProgress = false;
    this.chatLoaded = true;
  }

  private async unloadChat() {
    await this.chat.unload();
    this.chatLoaded = false;
  }

  /**
   * Run generate
   */
  private async asyncGenerate() {
    await this.asyncInitChat();
    this.requestInProgress = true;
    const prompt = this.uiChatInput.value;
    if (prompt == "") {
      this.requestInProgress = false;
      return;
    }

    this.appendMessage("right", prompt);
    this.uiChatInput.value = "";
    this.uiChatInput.setAttribute("placeholder", "Generating...");

    this.appendMessage("left", "");
    const callbackUpdateResponse = (step: unknown, msg: string) => {
      this.updateLastMessage("left", msg);
    };

    try {
      const output = await this.chat.generate(prompt, callbackUpdateResponse);
      this.updateLastMessage("left", output);
      this.uiChatInfoLabel.innerHTML = await this.chat.runtimeStatsText();
    } catch (err: any | {toString(): string, stack: string[]}) {
      this.appendMessage("error", "Generate error, " + err.toString());
      console.log(err.stack);
      await this.unloadChat();
    }
    this.uiChatInput.setAttribute("placeholder", "Enter your message...");
    this.requestInProgress = false;
  }
}

@Component({
  selector: 'app-demo-deploy',
  templateUrl: './demo-deploy.component.html',
  styleUrls: [
    '../doc/doc.scss',
    "./demo-deploy.component.scss"
  ]
})
export class DemoDeployComponent implements AfterViewInit, OnDestroy {
  private mediaRecorder: MediaRecorder | undefined;
  promptForAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
      });
  }

  ngAfterViewInit() {
    /*const useWebWorker = false;
    let chat: ChatInterface;

    if (useWebWorker) {
      chat = new ChatWorkerClient(new Worker(
        new URL('./worker.ts', import.meta.url),
        {type: 'module'}
      ));
    } else {
      chat = new ChatModule();
    }
    new ChatUI(chat);*/
  }

  constructor(private _ngZone: NgZone) {}

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  localChatForm = new FormGroup({
    chatInput: new FormControl(''),
  });

  localChatSubmit() {
    console.info(
      "chatInput:", this.localChatForm.value.chatInput ?? '', ';'
    );
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize?.resizeToFitContent(true));
  }

  ngOnDestroy() {
    this.mediaRecorder?.stop();
  }

  localChatFormReset() {
    this.localChatForm.reset();
    Object.keys(this.localChatForm.controls).forEach(key =>
      this.localChatForm.get(key)?.setErrors(null)
    );
    this.localChatForm.clearValidators();
  }
}
