"use client";
import { useState } from "react";
import { Sprintf } from "../utils/string";


export function useDate(localize: (key: string, ...params: string[])=> string) {
  const [today, setDate] = useState(new Date());
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;
  const MONTH = 30 * DAY;
  const YEAR = MONTH * 12;
  const timeSince = (date: Date) => {

    var miliseconds = today.getTime() - date.getTime();
    let time = miliseconds / YEAR;
    if (time >= 1) {
      return Sprintf(localize("diff_time_year"), time.toFixed());
    }

    time = miliseconds / WEEK;
    if (time >= 1) {
      return Sprintf(localize("diff_time_week"), time.toFixed());
    }
    time = miliseconds / DAY;
    if (time >= 1) {
      return Sprintf(localize("diff_time_day"), time.toFixed());
    }
    time = miliseconds / HOUR;
    if (time >= 1) {
      return Sprintf(localize("diff_time_hour"), time.toFixed());
    }
    time = miliseconds / MINUTE;
    if (time >= 1) {
      return Sprintf(localize("diff_time_minute"), time.toFixed());
    }
    return localize("diff_time_now");
  };
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setDate(new Date());
  //   }, 60 * 1000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  return { today, timeSince };
}
