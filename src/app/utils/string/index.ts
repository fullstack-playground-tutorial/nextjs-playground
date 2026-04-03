export const Sprintf = (str: string, ...params: string[]) => {
  for (let i = 0; i < params.length; i++) {
    str = str.replace(/{[\d]}/g, params[i]);
  }
  return str;
};

export const Slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};
