import * as vscode from "vscode";
import { translateAndSave } from "./translate";

const debounce = require("lodash/debounce");
// const json5 = require("json5");
const fs = require("fs");
// const md5 = require("md5");

let preMd5: any = null;
let fsWait: any = null;
let doSave: boolean = false;
function watchFile(filename: string, cb: () => any) {
  const debounceCb = debounce(cb, 500);
  fs.watch(filename, (event: string, name: string) => {
    if (doSave) {
      doSave = false;
      return;
    }
    if (name) {
      // if (fsWait) {
      //   return;
      // }
      // fsWait = setTimeout(() => {
      //   fsWait = null;
      // }, 1000);
      try {
        debounceCb();
      } catch (error) {
        console.warn("fuck-error", error);
      }
    }
  });
}
const cmdTranslate = vscode.commands.registerCommand(
  "extension.translate-auto",
  async () => {
    try {
      // vscode.window.onDidChange
      // The code you place here will be executed every time your command is executed

      const langFile = vscode.window.activeTextEditor?.document;
      const fileName = langFile?.fileName;

      if (!fileName) {
        return;
      }
      translateAndSave(fileName);
      doSave = true;

      //   vscode.window.activeTextEditor.
      console.log(`开始监听文件:${fileName}`);
      vscode.window.showInformationMessage(`保存改动之后，自动翻译😬`);
      try {
        watchFile(fileName, () => {
          console.log("do callback");
          // debugger;
          translateAndSave(fileName);
          doSave = true;
        });
      } catch (error) {
        console.warn("fuck", error);
      }

      return;
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  }
);

export default cmdTranslate;
