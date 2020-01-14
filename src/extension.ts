// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const translate = require("google-translate-api");
const fs = require("fs");

// {
//   "zh-cn": {
//     "home": "首页"
//   }
// }

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
      // The code you place here will be executed every time your command is executed
      const langs = Object.keys(translate.languages);
      const from =
        (await vscode.window.showQuickPick(moveFirst(langs, "zh"), {
          placeHolder: "from: 请输入充当翻译模板的语言国家码(default: zh)"
        })) || "zh";
      const to =
        (await vscode.window.showQuickPick(moveFirst(langs, "en"), {
          placeHolder: "to: 请输入需要被翻译的语言国家码(default: en)"
        })) || "en";

      const langFile = vscode.window.activeTextEditor?.document;
      const fileName = langFile?.fileName;
      const text = fs.readFileSync(fileName, "utf-8", (e: Error) => {
        console.warn(e);
      });
      // const from = "zh-cn";
      // const to = "vi";
      const preLangs = text ? JSON.parse(text) : {};
      const curLang = preLangs[from]; // { home: '首页',}

      async function translateData(data: any, from: string, to: string) {
        if (!data) {
          return { [to]: {} };
        }
        let res: any = {};
        for (const [key, value] of Object.entries(data)) {
          const { text: translateValue } =
            (await translate(value, { from, to })) || {};
          res[key] = translateValue;
        }
        return { [to]: res };
      }

      translateData(curLang, from, to)
        .then(res => {
          const finalLangs = { ...preLangs, ...res };
          fs.writeFileSync(
            fileName,
            JSON.stringify(finalLangs, null, 2),
            console.warn
          );
        })
        .catch(e => {
          console.warn("error", e);
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
