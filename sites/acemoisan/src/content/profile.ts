// Single source of truth for the hub's copy + app registry.
// Personal details/socials mirror acemoisan.github.io (kept intentionally light).

export interface Social {
  label: string;
  href: string;
  icon: string; // Icon.astro name
  handle?: string;
}

export interface AppEntry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string; // Icon.astro name
  href: string;
  status: "live" | "planned";
  accent: string; // css var used for the card's accent tint, e.g. "var(--cal)"
  tags?: string[];
}

export const profile = {
  name: "Aidan Moisan",
  handle: "acemoisan",
  role: "Game Developer",
  location: "Alberta, Canada",
  tagline: "A personal hub for the tools I actually use.",
  bio: "Versatile Canadian developer and programmer, dedicated to the multifaceted world of game development. This is where I self-host the day-to-day utilities I build for myself — starting with macro tracking.",
  email: "aidan.c.moisan@gmail.com",

  socials: [
    { label: "GitHub", href: "https://github.com/Acemoisan", icon: "github", handle: "@Acemoisan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/acemoisan/", icon: "linkedin", handle: "in/acemoisan" },
    { label: "itch.io", href: "https://acemoisan.itch.io", icon: "itch", handle: "acemoisan" },
    { label: "ArtStation", href: "https://acemoisan.artstation.com/", icon: "artstation", handle: "acemoisan" },
    { label: "Email", href: "mailto:aidan.c.moisan@gmail.com", icon: "mail", handle: "aidan.c.moisan@gmail.com" },
  ] as Social[],

  // The hub's reason for existing: quick access to self-hosted utilities.
  apps: [
    {
      slug: "macrofactor",
      name: "MacroFactor",
      tagline: "Macro & nutrition tracker",
      description:
        "Catalogue foods, quick-log your day on a timeline, and watch daily totals land against your goals — with a live calendar and monthly progress. All data stays on your device.",
      icon: "flame",
      href: "/apps/macrofactor",
      status: "live",
      accent: "var(--cal)",
      tags: ["Nutrition", "Local-first", "Calendar"],
    },
    {
      slug: "habits",
      name: "Habit Grid",
      tagline: "Daily streaks & routines",
      description: "A GitHub-style contribution grid for the habits worth keeping. Planned next.",
      icon: "grid",
      href: "#",
      status: "planned",
      accent: "var(--fat)",
      tags: ["Routines"],
    },
    {
      slug: "dashboard",
      name: "Command Deck",
      tagline: "Personal start page",
      description: "Bookmarks, feeds, and live widgets on one glanceable screen. On the roadmap.",
      icon: "layout",
      href: "#",
      status: "planned",
      accent: "var(--accent)",
      tags: ["Productivity"],
    },
  ] as AppEntry[],
} as const;

export const liveApps = profile.apps.filter((a) => a.status === "live");
