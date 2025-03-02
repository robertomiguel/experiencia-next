"use client";
import { useEffect, useState } from "react";
import { Fabric } from "@/components/fabric/fabric";

export default function FabricPage() {
  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // Evitamos renderizar hasta que el estado se resuelva
  if (isMobile === null) return null;

  return <Fabric isMobile={isMobile} />;
}
