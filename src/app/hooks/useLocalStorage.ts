import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialVal: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    if (typeof localStorage !== "undefined") {
      const storedValue = localStorage.getItem(key);
      const initial = storedValue ? (JSON.parse(storedValue) as T) : initialVal;
      return initial;
    } else {
      return initialVal;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};
