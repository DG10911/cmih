"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, CircleUser, ChevronRight, Command as CommandIcon } from "lucide-react";
import { NAV_FLAT } from "./nav";
import { cn } from "@/lib/utils";

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    const nav = NAV_FLAT.find((n) => n.href === acc);
    const label = nav
      ? nav.label
      : seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: acc });
  }
  return crumbs;
}

export function Topbar({
  onMenu,
  onSearch,
}: {
  onMenu: () => void;
  onSearch: () => void;
}) {
  const crumbs = useBreadcrumb();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-md sm:px-4">
      <button onClick={onMenu} className="rounded-md p-1.5 text-ink-soft hover:bg-surface-2 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-sm sm:flex">
        <Link href="/command" className="text-ink-faint hover:text-ink">KhanijDrishti</Link>
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
            <Link
              href={c.href}
              className={cn("truncate", i === crumbs.length - 1 ? "font-medium text-ink" : "text-ink-soft hover:text-ink")}
            >
              {c.label}
            </Link>
          </span>
        ))}
      </nav>

      <button
        onClick={onSearch}
        className="ml-auto flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-ink-faint transition-colors hover:border-border-strong sm:ml-4"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="flex items-center gap-0.5 rounded border border-border-strong px-1 py-0.5 font-mono text-2xs">
          <CommandIcon className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-2xs font-medium text-success md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Sources healthy
        </span>
        <Link href="/alerts" className="relative rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-ink" aria-label="Alerts">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-mineral" />
        </Link>
        <Link href="/settings" className="rounded-md p-2 text-ink-soft hover:bg-surface-2 hover:text-ink" aria-label="Profile">
          <CircleUser className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
