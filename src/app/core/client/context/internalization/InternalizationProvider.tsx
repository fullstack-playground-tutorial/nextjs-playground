"use client";
import { ReactNode, useEffect, useState } from "react";

import { InternalizationContext, InternalizationState } from "./context";
import { Sprintf } from "@/app/utils/string";
import { getLocaleService, LocaleCode } from "@/app/utils/resource/locales";

export interface Props {
  children: ReactNode;
  lang?: string;
}

export default function InternalizationProvider(props: Props) {
  const [internalization, setInternalization] = useState<InternalizationState>({
    currentLocale: getLocaleService(props.lang).currentLocale,
  });

  useEffect(() => {
    if (props.lang) {
      getLocaleService(props.lang);
      setInternalization({ currentLocale: props.lang as LocaleCode });
    }
  }, [props.lang]);

  const changeLanguage = (locale: LocaleCode) => {
    setInternalization((prev) => ({ ...prev, currentLocale: locale }));
    return null;
  };

  const localize = (key: string, ...val: string[]) => {
    return Sprintf(getLocaleService().localize(key), ...val);
  };

  return (
    <>
      <InternalizationContext.Provider
        value={{
          internalization: internalization,
          changeLanguage: changeLanguage,
          localize: localize,
        }}
      >
        {props.children}
      </InternalizationContext.Provider>
    </>
  );
}
