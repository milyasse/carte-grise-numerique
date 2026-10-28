import type { ReactNode } from "react";
import { LuBatteryFull, LuSignal, LuWifi } from "react-icons/lu";

export function PhoneFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="phone" role="group" aria-label={label ?? "Aperçu sur smartphone"}>
      <div className="phone-screen">
        <div className="phone-status" aria-hidden="true">
          <span className="mono">09:41</span>
          <span style={{ display: "inline-flex", gap: 4 }}>
            <LuSignal /> <LuWifi /> <LuBatteryFull />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
