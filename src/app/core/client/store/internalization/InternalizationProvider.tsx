import { ReactNode, useState } from "react";

import { InternalizationContext, InternalizationState } from "./InternalizationContext";
import {getLocaleService, Locale } from "@/app/utils/resource/locales";
import { Sprintf } from "@/app/utils/string";

export interface Props {
  children: ReactNode;
}


export default function InternalizationProvider(props: Props) {
  const [internalization, setInternalization] = useState<InternalizationState>({
    currentLocale: getLocaleService().currentLocale,
  });

  const changeLanguage = (locale: Locale) => {
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
