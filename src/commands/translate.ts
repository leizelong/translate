import * as vscode from "vscode";
import { getAllCode } from "@leizl/google-translate-open-api";
import { $translate, moveFirst } from "../utils";
import * as fs from "fs";
import * as Sentry from "@sentry/node";

const json5 = require("json5").default;

export async function translateAndSave(
  fileName: string,
  options = { from: "zh", to: "en" },
) {
  const { from, to } = options;
  const langText = fs.readFileSync(fileName, "utf-8");
  Sentry.setExtras({ fileContent: langText, from, to });

  const cmsHeaderReg = /([^;]*?)(?={)({[^;]*})(;?)/;
  const [, header, content, footer] = langText.match(cmsHeaderReg) || [];
  function stand(data: string) {
    return `${header}${data}${footer}`;
  }
  const template = (data: any) => stand(JSON.stringify(data, null, 2));

  const preLangs = content ? json5.parse(content) : {};
  const originData = preLangs[from]; // { home: '首页',}
  if (!originData) {
    throw new Error(
      `not found template key: ${from}, please check current file`,
    );
  }

  const keys: string[] = Object.keys(originData);
  const values: string[] = Object.values(originData);
  const result = await $translate(values, { from, to });

  const toData = keys.reduce((total, key, idx) => {
    // if(originData[key]) {
    //   return total;
    // }
    const value = result[idx];
    return Object.assign(total, { [key]: value });
  }, {});

  const finalLangContent = template({ ...preLangs, [to]: toData });
  await fs.promises.writeFile(fileName, finalLangContent);
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
        throw new Error(`from:${from}; to:${to}; 异常`);
      }

      const langFile = vscode.window.activeTextEditor?.document;
      const fileName = langFile?.fileName;
      if (!fileName) {
        throw new Error(`文件不存在，请保存文件后在尝试`);
      }
      await translateAndSave(fileName, { from, to });
      Sentry.captureMessage("translate success", {
        level: Sentry.Severity.Info,
      });
      vscode.window.showInformationMessage("translate complete");
    } catch (error) {
      Sentry.captureException(error);
      vscode.window.showErrorMessage(error.message);
    }
  },
);

export default cmdTranslate;
