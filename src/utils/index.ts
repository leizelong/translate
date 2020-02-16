import translate, {
  parseMultiple,
  Options
} from "@leizl/google-translate-open-api";

async function $translate(values: string[] | string, option: Options) {
  const res = await translate(values, { ...option, tld: "cn" });

  let data;
  if (values.length === 1) {
    data = [res.data];
  } else {
    data = parseMultiple(res.data[0]);
  }
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
