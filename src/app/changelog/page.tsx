"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bug,
  Sparkles,
  Wrench,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  CalendarDays,
  Link as LinkIcon,
  Search,
} from "lucide-react";

// --- Helpers ---------------------------------------------------------------
const typeMap = {
  added: { label: "Added", Icon: Plus },
  improved: { label: "Improved", Icon: Wrench },
  fixed: { label: "Fixed", Icon: Bug },
  introduced: { label: "Introduced", Icon: Sparkles },
  updated: { label: "Updated", Icon: ArrowUpRight },
  resolved: { label: "Resolved", Icon: CheckCircle2 },
} as const;

type ChangeType = keyof typeof typeMap;

function detectType(text: string): ChangeType | null {
  const t = text.toLowerCase();
  if (t.startsWith("added")) return "added";
  if (t.startsWith("improved")) return "improved";
  if (t.startsWith("fixed")) return "fixed";
  if (t.startsWith("introduced")) return "introduced";
  if (t.startsWith("updated")) return "updated";
  if (t.startsWith("resolved")) return "resolved";
  return null;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function ChangelogPage() {
  const changelog = require("./changelog.json") as {
    version: string;
    date: string;
    changes: string[];
  }[];

  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | ChangeType>("all");

  const filtered = changelog.map((entry) => ({
    ...entry,
    changes: entry.changes.filter((c) => {
      const matchesQuery = c.toLowerCase().includes(query.toLowerCase());
      const t = detectType(c);
      const matchesType = filter === "all" ? true : t === filter;
      return matchesQuery && matchesType;
    }),
  }));

  const anyResults = filtered.some((e) => e.changes.length > 0);

  return (
    <div className="min-h-screen w-full bg-background ">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-orbit-carbon/80 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="./logo_color.svg"
              alt="App Logo"
              width={36}
              height={36}
              className="rounded"
            />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Changelog</h1>
              <p className="text-sm">What’s new and improved</p>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mx-auto max-w-5xl px-4 pt-2">
        <div className="flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 " />
              <Input
                placeholder="Search changes…"
                className="pl-9 bg-secondary border-orbit-carbon  focus-visible:ring-orbit-marine"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as any)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4 bg-secondary/70">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="added">Added</TabsTrigger>
              <TabsTrigger value="improved">Improved</TabsTrigger>
              <TabsTrigger value="fixed">Fixed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Timeline */}
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4">
        {!anyResults ? (
          <EmptyState />
        ) : (
          <ol className="relative ml-3 border-l border-orbit-carbon/70 pl-6">
            {filtered.map((entry, idx) => (
              <motion.li
                id={idx === 0 ? "latest" : undefined}
                key={entry.version}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="mb-8"
              >
                {/* Timeline dot */}
                <div className="absolute -left-2.5 mt-1.5 size-2.5 rounded-full bg-orbit-baby shadow-[0_0_0_6px_rgba(219,157,255,0.10)]" />

                <Card className="border-orbit-carbon/80 bg-secondary/60 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-secondary "
                        >
                          v{entry.version}
                        </Badge>
                        <span className="text-sm ">
                          {formatDate(entry.date)}
                        </span>
                        {idx === 0 && (
                          <Badge className="bg-orbit-mint/20 text-orbit-mint border-orbit-mint/40">
                            Latest
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <Separator className="mb-3 bg-secondary" />

                  <CardContent className="pb-5">
                    <ul className="space-y-2">
                      {entry.changes.map((change, i) => {
                        const t = detectType(change);
                        const meta = t && typeMap[t];
                        const Icon = meta?.Icon ?? Sparkles;
                        return (
                          <li
                            key={i}
                            id={`v-${entry.version}`}
                            className="group flex items-start gap-3 rounded-lg p-2 hover:bg-secondary/60"
                          >
                            <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-secondary">
                              <Icon className="size-3.5 text-orbit-marine" />
                            </span>
                            <div className="flex-1 ">
                              <p className="leading-relaxed">{change}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center">
      <div className="rounded-2xl border border-orbit-carbon bg-secondary/60 p-8">
        <Sparkles className="mx-auto mb-3 size-8 text-orbit-baby" />
        <h3 className="mb-1 text-lg font-semibold">No matches</h3>
        <p className="text-sm">
          Try a different search or filter to find a specific change.
        </p>
      </div>
    </div>
  );
}
