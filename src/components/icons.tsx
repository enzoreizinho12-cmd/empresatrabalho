import type { ReactNode, SVGProps } from "react";

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & { size?: number; strokeWidth?: number };
type Name = "arrow" | "badge" | "bell" | "briefcase" | "building" | "check" | "circle" | "file" | "graduation" | "pin" | "search" | "shield" | "sparkles" | "target" | "users" | "wand" | "utensils" | "shopping" | "hardhat" | "heart" | "truck" | "settings" | "trophy" | "bookmark" | "chevron" | "chart" | "menu";

const paths: Record<Name, ReactNode> = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  badge: <><path d="m12 2 2.2 1.4 2.6-.1 1.4 2.2 2.4 1 .1 2.6L22 12l-1.3 2.3-.1 2.6-2.4 1-1.4 2.2-2.6-.1L12 22l-2.2-1.4-2.6.1-1.4-2.2-2.4-1-.1-2.6L2 12l1.3-2.3.1-2.6 2.4-1 1.4-2.2 2.6.1z"/><path d="m8.5 12 2.3 2.3 4.7-4.8"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-5h6v5M8 7h1m6 0h1M8 11h1m6 0h1"/></>,
  check: <path d="m4 12 5 5L20 6"/>,
  circle: <><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c4 3 8 3 12 0v-5M22 9v7"/></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0"/><circle cx="12" cy="10" r="2.5"/></>,
  search: <><circle cx="10.7" cy="10.7" r="7.2"/><path d="m16 16 5 5"/></>,
  shield: <><path d="m12 2 8 4v6c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></>,
  sparkles: <><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7zM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m12 12 8-8"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2z"/><path d="M16 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5v1h-4"/></>,
  wand: <><path d="m4 20 12-12 4 4L8 24M15 3l.5 2M21 5l-2 .5M4 3l.5 2M2 9l2 .5"/></>,
  utensils: <><path d="M4 2v8a3 3 0 0 0 6 0V2M7 2v20M16 22V2c3 2 4 5 4 9v3h-4"/></>,
  shopping: <><path d="M4 8h16l-1 13H5zM9 9V6a3 3 0 0 1 6 0v3"/></>,
  hardhat: <><path d="M3 17h18v3H3zM5 17a7 7 0 0 1 14 0M12 6v7M7 10l-2-1m12 1 2-1"/></>,
  heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.7 0L12 5.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.7z"/>,
  truck: <><path d="M2 5h12v11H2zM14 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M10 2h4l.7 2.3 2 .8 2.1-1.2 2.8 2.8-1.2 2.1.8 2L23 11v3l-2.3.7-.8 2 1.2 2.1-2.8 2.8-2.1-1.2-2 .8L14 23h-4l-.7-2.3-2-.8-2.1 1.2-2.8-2.8 1.2-2.1-.8-2L1 14v-3l2.3-.7.8-2-1.2-2.1 2.8-2.8 2.1 1.2 2-.8z"/></>,
  trophy: <><path d="M7 3h10v7a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v5m-4 1h8"/></>,
  bookmark: <path d="M5 3h14v19l-7-5-7 5z"/>,
  chevron: <path d="m7 10 5 5 5-5"/>,
  chart: <><path d="M3 21h18M5 17h3v4H5zM10.5 12h3v9h-3zM16 6h3v15h-3z"/></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
};

function Icon({ name, size = 24, strokeWidth = 2, ...props }: Props & { name: Name }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export const ArrowRight = (props: Props) => <Icon name="arrow" {...props}/>;
export const BadgeCheck = (props: Props) => <Icon name="badge" {...props}/>;
export const Bell = (props: Props) => <Icon name="bell" {...props}/>;
export const BriefcaseBusiness = (props: Props) => <Icon name="briefcase" {...props}/>;
export const Building2 = (props: Props) => <Icon name="building" {...props}/>;
export const Check = (props: Props) => <Icon name="check" {...props}/>;
export const CircleCheck = (props: Props) => <Icon name="circle" {...props}/>;
export const FileText = (props: Props) => <Icon name="file" {...props}/>;
export const GraduationCap = (props: Props) => <Icon name="graduation" {...props}/>;
export const MapPin = (props: Props) => <Icon name="pin" {...props}/>;
export const Search = (props: Props) => <Icon name="search" {...props}/>;
export const ShieldCheck = (props: Props) => <Icon name="shield" {...props}/>;
export const Sparkles = (props: Props) => <Icon name="sparkles" {...props}/>;
export const Target = (props: Props) => <Icon name="target" {...props}/>;
export const UsersRound = (props: Props) => <Icon name="users" {...props}/>;
export const WandSparkles = (props: Props) => <Icon name="wand" {...props}/>;
export const Utensils = (props: Props) => <Icon name="utensils" {...props}/>;
export const ShoppingBag = (props: Props) => <Icon name="shopping" {...props}/>;
export const HardHat = (props: Props) => <Icon name="hardhat" {...props}/>;
export const Heart = (props: Props) => <Icon name="heart" {...props}/>;
export const Truck = (props: Props) => <Icon name="truck" {...props}/>;
export const Settings = (props: Props) => <Icon name="settings" {...props}/>;
export const Trophy = (props: Props) => <Icon name="trophy" {...props}/>;
export const Bookmark = (props: Props) => <Icon name="bookmark" {...props}/>;
export const ChevronDown = (props: Props) => <Icon name="chevron" {...props}/>;
export const ChartColumn = (props: Props) => <Icon name="chart" {...props}/>;
export const Menu = (props: Props) => <Icon name="menu" {...props}/>;
