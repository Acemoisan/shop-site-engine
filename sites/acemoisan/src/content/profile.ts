// Single source of truth for the hub's copy + app registry.
// Personal details/socials mirror acemoisan.github.io (kept intentionally light).

export interface Social {
  label: string;
  href: string;
  icon: string; // Icon.astro name
  handle?: string;
}

// The plan/spec shown on a planned app's detail page (catalogue of intent).
export interface AppPlan {
  overview: string;
  features: string[];
  notes?: string[];
  status?: string;
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
  plan?: AppPlan; // planned apps: rendered on /apps/<slug>
}

export const profile = {
  name: "Aidan Moisan",
  handle: "acemoisan",
  role: "Game Developer",
  location: "Alberta, Canada",
  tagline: "A personal hub for the tools I actually use.",
  bio: "Versatile Canadian developer and programmer, dedicated to the multifaceted world of game development. This is where I self-host the day-to-day utilities I build for myself — starting with macro and budget tracking.",
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
      slug: "ace-macros",
      name: "Ace-Macros",
      tagline: "Macro & nutrition tracker",
      description:
        "Catalogue foods, quick-log your day on a timeline, and watch daily totals land against your goals — with a live calendar and monthly progress. All data stays on your device.",
      icon: "flame",
      href: "/apps/ace-macros",
      status: "live",
      accent: "var(--cal)",
      tags: ["Nutrition", "Local-first", "Calendar"],
    },
    {
      slug: "budget",
      name: "Ace-Budget",
      tagline: "Money in & out, by day",
      description:
        "Log income and expenses on a live calendar, tag them by category, and watch monthly totals and your net land in real time. On-device, no bank connection.",
      icon: "wallet",
      href: "/apps/budget",
      status: "live",
      accent: "var(--good)",
      tags: ["Money", "Calendar", "Local-first"],
    },
    {
      slug: "homebase",
      name: "Homebase",
      tagline: "Household utilities & smart devices",
      description:
        "A control panel for the home — lights, plugs, sensors, and an Alexa nudge — bridged through a self-hosted hub (Home Assistant) or a small proxy. Exploring the options now.",
      icon: "home",
      href: "/apps/homebase",
      status: "planned",
      accent: "var(--warn)",
      tags: ["Smart home", "Self-hosted"],
      plan: {
        status: "Exploring options",
        overview:
          "One glanceable place in the hub to read the state of the house and flip a few things without leaving the browser — lights, plugs, sensors, and the odd Alexa nudge.",
        features: [
          "Read-only widgets first: temperature, which lights are on, energy use",
          "A few control buttons — toggle a light or a plug",
          "An Alexa announcement for reminders (e.g. a macro nudge)",
          "One integration point for everything via a self-hosted hub",
        ],
        notes: [
          "A static page can't safely hold device secrets, so any control routes through a small proxy (a Cloudflare Worker) that holds the token — not client JS.",
          "Recommended bridge: Home Assistant (self-hosted, e.g. on a Pi) exposed via a Cloudflare Tunnel; it speaks to nearly everything incl. Alexa.",
          "Alexa isn't called directly from a webpage — go through Home Assistant, or a webhook like Voice Monkey for announcements/routines.",
          "Likely first step: stand up Home Assistant → add read-only widgets → then a couple of control buttons.",
        ],
      },
    },
    {
      slug: "habits",
      name: "Habit Grid",
      tagline: "Daily streaks & routines",
      description: "A GitHub-style contribution grid for the habits worth keeping. Planned next.",
      icon: "grid",
      href: "/apps/habits",
      status: "planned",
      accent: "var(--fat)",
      tags: ["Routines"],
      plan: {
        status: "Planned next",
        overview:
          "A GitHub-style contribution grid for the habits worth keeping — mark a day done, watch the streak build, and see the whole year at a glance.",
        features: [
          "Define a set of habits",
          "Tap a day to mark it done / not done",
          "Contribution heatmap per habit + current and longest streak",
          "Local-first, covered by the same backup as the other apps",
        ],
        notes: [
          "Reuses the calendar + localStorage patterns already built for Ace-Macros.",
          "Same additive-migration and export/import backup rules.",
        ],
      },
    },
    {
      slug: "dashboard",
      name: "Command Deck",
      tagline: "Personal start page",
      description: "Bookmarks, feeds, and live widgets on one glanceable screen. On the roadmap.",
      icon: "layout",
      href: "/apps/dashboard",
      status: "planned",
      accent: "var(--accent)",
      tags: ["Productivity"],
      plan: {
        status: "On the roadmap",
        overview:
          "A personal start page — the first thing you open. Bookmarks, quick links, and live widgets (clock, today's macros, weather) on one glanceable screen.",
        features: [
          "Editable bookmark grid / quick links",
          "Live widgets: clock, today's macros, maybe weather",
          "Fast, keyboard-first navigation",
        ],
        notes: [
          "Could grow into the hub's home dashboard.",
          "Pulls the other apps' local data for at-a-glance widgets.",
        ],
      },
    },
  ] as AppEntry[],
} as const;

export const liveApps = profile.apps.filter((a) => a.status === "live");
export const plannedApps = profile.apps.filter((a) => a.status === "planned");
