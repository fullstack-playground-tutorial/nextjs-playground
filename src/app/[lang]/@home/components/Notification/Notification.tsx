"use client";
import { Notification } from "@/app/feature/notification/notification";
import { Suspense, use, useContext, useEffect, useState } from "react";

interface Props {
  notifications: Notification[];
}

interface InternalState {
  toggle: boolean;
  notifications: Notification[];
}

interface SocketMsg {
  name: string;
  data: any;
}

const initialState: InternalState = {
  toggle: false,
  notifications: [],
};

export default function NotificationComponent(props: Props) {
  return <Suspense fallback={<>Loading</>}>
    
  </Suspense>;
}
