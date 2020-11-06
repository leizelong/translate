import * as vscode from "vscode";
import { getAllCode } from "@leizl/google-translate-open-api";
import { $translate, moveFirst } from "../utils";
// import fs from "fs";
// import json5 from "json5";

const fs = require("fs");
const json5 = require("json5");

export async function translateAndSave(
  fileName: string,
  options = { from: "zh", to: "en" }
) {
  const { from, to } = options;
  const langText = fs.readFileSync(fileName, "utf-8");

  const cmsHeaderReg = /([^;]*?)(?={)({[^;]*})(;?)/;
  const [, header, content, footer] = langText.match(cmsHeaderReg) || [];
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
  try {
    await fs.promises.writeFile(fileName, finalLangContent);
  } catch (err) {
    if (err) {
      console.warn("=======", err.message);
      vscode.window.showErrorMessage(err.message);
      throw err;
    }
    vscode.window.showInformationMessage("translate complete");
  }
}

const cmdTranslate = vscode.commands.registerCommand(
  "extension.translate-i18n",
  async () => {
    try {
      // The code you place here will be executed every time your command is executed
      const langs = getAllCode();
      const from = await vscode.window.showQuickPick(moveFirst(langs, "zh"), {
        placeHolder: "from: 请输入充当翻译模板的语言国家码(default: zh)",
      });
      const to = await vscode.window.showQuickPick(moveFirst(langs, "en"), {
        placeHolder: "to: 请输入需要被翻译的语言国家码(default: en)",
      });
      if (!(from && to)) {
        return;
      }

      const langFile = vscode.window.activeTextEditor?.document;
      const fileName = langFile?.fileName;
      if (!fileName) {
        return;
      }
      await translateAndSave(fileName, { from, to });
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  }
);

export default cmdTranslate;
