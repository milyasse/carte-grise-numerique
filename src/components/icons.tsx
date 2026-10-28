import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuClock,
  LuCloudUpload,
  LuFileText,
  LuListChecks,
  LuQrCode,
  LuShieldAlert,
  LuShieldCheck,
  LuSiren,
  LuSmartphone,
  LuSmile,
  LuTriangleAlert,
  LuUsers,
  LuWorkflow,
} from "react-icons/lu";

export const ICONS: Record<string, IconType> = {
  doc: LuFileText,
  police: LuSiren,
  guichet: LuBuilding2,
  alert: LuTriangleAlert,
  clock: LuClock,
  shield: LuShieldCheck,
  simplify: LuWorkflow,
  access: LuUsers,
  fraud: LuShieldAlert,
  phone: LuSmartphone,
  qr: LuQrCode,
  cloud: LuCloudUpload,
  track: LuListChecks,
  smile: LuSmile,
};
