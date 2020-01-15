// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import translate, {
  parseMultiple,
  getAllCode,
  Options
} from "@leizl/google-translate-open-api";

async function $translate(values: string[] | string, option: Options) {
  const res = await translate(values, option);

  let data;
  if (values.length === 1) {
    data = [res.data];
  } else {
    data = parseMultiple(res.data[0]);
  }
  return data;
}

// const translate = require("@leizl/google-translate-api");
const fs = require("fs");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "translate" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  function moveFirst(langs: string[], lang: string) {
    const idx = langs.findIndex(d => d === lang);

    if (idx === -1) {
      return langs;
    }
    const res = [...langs];
    res.splice(idx, 1);
    res.unshift(lang);
    return res;
  }

  let disposable = vscode.commands.registerCommand(
    "extension.translate",
    async () => {
      try {
        // The code you place here will be executed every time your command is executed
        const langs = getAllCode();
        const from = await vscode.window.showQuickPick(moveFirst(langs, "zh"), {
          placeHolder: "from: 请输入充当翻译模板的语言国家码(default: zh)"
        });
        const to = await vscode.window.showQuickPick(moveFirst(langs, "en"), {
          placeHolder: "to: 请输入需要被翻译的语言国家码(default: en)"
        });
        if (!(from && to)) {
          return;
        }

        const langFile = vscode.window.activeTextEditor?.document;
        const fileName = langFile?.fileName;
        const text = fs.readFileSync(fileName, "utf-8", (e: Error) => {
          console.warn(e);
        });
        const preLangs = text ? JSON.parse(text) : {};
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
        const finalLangs = { ...preLangs, [to]: toData };
        fs.writeFileSync(
          fileName,
          JSON.stringify(finalLangs, null, 2),
          (e: Error) => console.warn(e)
        );
        vscode.window.showInformationMessage(`translate complete!`);
      } catch (error) {
        vscode.window.showErrorMessage(error.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
