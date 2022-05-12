import translate from "@leizl/google-translate-open-api";
// import { get } from "lodash";

// function parseOne(data: any) {
//   const sentences = get(data, "sentences", []);
//   const item = sentences[0];
//   if (!item) return [];
//   const { trans } = item;
//   return [trans];
// }

function parseTranslateResponse(res: any) {
  return res.data;
  // if (Array.isArray(res.data)) {
  //   return parseMultiple(res.data[0]);
  // } else if (res.data.sentences) {
  //   return parseOne(res.data);
  // }
  // return []
}

async function $translate(values: string[], option: any) {
  const res = await translate(values, {
    ...option,
    tld: "cn",
    client: "dict-chrome-ex",
  });

  const data = parseTranslateResponse(res);
  return data;
}

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

export { $translate, moveFirst };
