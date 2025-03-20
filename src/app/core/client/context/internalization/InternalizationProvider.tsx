import { ReactNode, useState } from "react";

import { InternalizationContext, InternalizationState } from "./InternalizationContext";
import { Sprintf } from "@/app/utils/string";
import { Locale, localeService } from "@/app/utils/resource/locales";

export interface Props {
  children: ReactNode;
}


export default function InternalizationProvider(props: Props) {
  const [internalization, setInternalization] = useState<InternalizationState>({
    currentLocale: localeService.currentLocale,
  });

  const changeLanguage = (locale: Locale) => {
    setInternalization((prev) => ({ ...prev, currentLocale: locale }));
    return null;
  };

  const localize = (key: string, ...val: string[]) => {
    return Sprintf(localeService.localize(key), ...val);
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
