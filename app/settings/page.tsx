"use client"
import { SessionProvider } from "next-auth/react";
import SettingsComponent from "./SettingsComponent";

export default function page() {
  
  return (
  <div>
    <SessionProvider>
      <SettingsComponent/>
    </SessionProvider>
  </div>
  )
}

