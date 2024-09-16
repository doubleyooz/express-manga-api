import React from "react";

export default function TitleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full">{children}</div>;
}