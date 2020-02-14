import * as vscode from "vscode";
import { $translate } from "../utils";
import { translateAndSave } from "./translate";
const json5 = require("json5");
const fs = require("fs");
const md5 = require("md5");

let preMd5: any = null;
let fsWait: any = null;
let doSave: boolean = false;
function watchFile(filename: string, cb: () => any) {
  fs.watch(filename, (event: string, name: string) => {
    if (doSave) {
      doSave = false;
      return;
    }
    if (name) {
      if (fsWait) {
        return;
      }
      fsWait = setTimeout(() => {
        fsWait = null;
      }, 1000);
      try {
        // var currentMd5 = md5(fs.readFileSync(filename));
        // if (currentMd5 === preMd5) {
        //   return;
        // }
        cb();
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
      vscode.window.showInformationMessage(`开始监听文件:${fileName}`);
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

      const langText = fs.readFileSync(fileName, "utf-8");

      const cmsHeaderReg = /([^;]*?)(?={)({[^;]*})(;?)/;
      const [, header, content, footer] = langText.match(cmsHeaderReg);
      function stand(data: string) {
        return `${header}${data}${footer}`;
      }
      const template = (data: any) => stand(JSON.stringify(data, null, 2));

      const preLangs = content ? json5.parse(content) : {};
      const originData = preLangs[from]; // { home: '首页',}
      if (!originData) {
        vscode.window.showErrorMessage(
          `not found template key: ${from}, please check current file`
        );
        return;
      }

      const keys: string[] = Object.keys(originData);
      const values: string[] = Object.values(originData);
      const result = await $translate(values, { from, to });
      const toData = keys.reduce((total, key, idx) => {
        const value = result[idx];
        return Object.assign(total, { [key]: value });
      }, {});

      const finalLangContent = template({ ...preLangs, [to]: toData });

      fs.writeFileSync(fileName, finalLangContent, (e: Error) =>
        console.warn(e)
      );
      vscode.window.showInformationMessage(`translate complete!`);
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  }
);

export default cmdTranslate;
