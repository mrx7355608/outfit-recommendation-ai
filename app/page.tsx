"use client";
import { Chat } from "@/components/chat";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function Home() {
  const DEFAULT_REGION = "Punjab";
  const [region, setRegion] = useState("");

  // Fetch user region from his ip
  useEffect(() => {
    const regionExist = localStorage.getItem("region");
    if (regionExist) {
      console.log("region already exists");
      setRegion(regionExist);
      return;
    }

    fetch("/api/get-region")
      .then((resp) => resp.json())
      .then((data) => {
        setRegion(data.region);
        console.log(data);
        localStorage.setItem("region", data.region);
      })
      .catch(console.error)
      .finally(() => setRegion(DEFAULT_REGION));
  }, []);

  if (!region) {
    return <p className="w-full h-screen text-xl align-center">Loading...</p>;
  }

  return (
    <main className="flex max-h-screen h-screen flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Outfitss</h1>
        <ThemeToggle />
      </header>

      <Chat region={region} />
    </main>
  );
}
