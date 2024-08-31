export const Sprintf = (str: string, ...params: string[]) => {
  for (let i = 0; i < params.length; i++) {
    str = str.replace(/{[\d]}/g, params[i]);
  }
  return str
};
