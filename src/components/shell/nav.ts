import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Gem,
  Cpu,
  FileText,
  FlaskConical,
  Building2,
  Map,
  Radar,
  TriangleAlert,
  Share2,
  Users,
  Database,
  ScrollText,
  Bell,
  GitBranch,
  ListChecks,
  Network,
  Settings,
  Sparkles,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

/** Sidebar navigation (spec §20,97). */
export const NAV: NavGroup[] = [
  {
    heading: "Command",
    items: [{ label: "Command Center", href: "/command", icon: LayoutDashboard }],
  },
  {
    heading: "Explore",
    items: [
      { label: "Minerals", href: "/minerals", icon: Gem },
      { label: "Technologies", href: "/technologies", icon: Cpu },
      { label: "Patents", href: "/patents", icon: FileText },
      { label: "R&D", href: "/rd", icon: FlaskConical },
      { label: "Organisations", href: "/organisations", icon: Building2 },
    ],
  },
  {
    heading: "Intelligence",
    items: [
      { label: "Technology Map", href: "/technology-map", icon: Map },
      { label: "Emerging Radar", href: "/emerging", icon: Radar },
      { label: "Gap Intelligence", href: "/gaps", icon: TriangleAlert },
      { label: "Knowledge Graph", href: "/graph", icon: Network },
      { label: "Collaboration", href: "/collaboration", icon: Share2 },
    ],
  },
  {
    heading: "Evidence",
    items: [
      { label: "Ask KhanijDrishti", href: "/ask", icon: Sparkles },
      { label: "Evidence", href: "/evidence", icon: Database },
      { label: "Policy Briefs", href: "/policy-briefs", icon: ScrollText },
      { label: "Alerts", href: "/alerts", icon: Bell },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Data & Sources", href: "/sources", icon: Share2 },
      { label: "Pipeline", href: "/pipeline", icon: GitBranch },
      { label: "Review Queue", href: "/review", icon: ListChecks },
      { label: "Taxonomy", href: "/taxonomy", icon: Users },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/** Flat list for the command palette + breadcrumb resolution. */
export const NAV_FLAT: NavItem[] = NAV.flatMap((g) => g.items);
