const {
  default: translate,
  getAllCode,
  parseMultiple
} = require("@leizl/google-translate-open-api");
// const translate1 = require("@leizl/google-translate-api");

(async () => {
  try {
    const values = ["首页"];
    const res = await translate(values, {
      from: "zh-cn",
      to: "en"
    });
    let data
    if (values.length === 1) {
      data = [res.data[0]];
    } else {
      data = parseMultiple(res.data[0]);
    }
    //   const data = result.data[0];
    console.warn(data);
  } catch (error) {
    console.warn(error);
  }
})();

// // (async () => {
// //   const result = await translate1('我爱，你', {
// //     from: "zh",
// //     to: "en"
// //   });
// //   const data = result
// //   console.warn(JSON.stringify(data));
// // })();

// const fs = require("fs");
// const json5 = require("json5");
// const path = "./test_i18n/i18n.js";
// const fileStream = fs.readFileSync(path, { encoding: "utf-8" });
// const headerReg = /([^;]*?)(?={)({[^;]*})(;?)/;
// // /({[^;]*});?/?
// // console.warn(fileStream, headerReg.compile(fileStream) );
// const objStr = fileStream.replace(headerReg, "$1");
// console.warn(fileStream.match(headerReg));
// // const obj = json5.parse(objStr);
// // const template = `export default ${JSON.stringify(obj, null, 2)};`;

// // console.warn(/^;/.test(";"), template);
