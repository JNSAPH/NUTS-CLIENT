import React from "react";

export default function ChangelogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-screen overflow-y-auto">{children}</div>;
}