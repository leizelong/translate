const md5 = require("md5");
const fs = require("fs");
const filename = "/Users/leizelong/Desktop/test";
console.warn(md5(fs.readFileSync(filename)));
fs.watchFile(filename, () => {
    console.warn('fuck')
  var currentMd5 = md5(fs.readFileSync(filename));
  console.warn(currentMd5);
});
