"use client";
import { Chat } from "@/components/chat";
import { useEffect, useState } from "react";

export default function Home() {
  const DEFAULT_REGION = "Washington";
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
    return <p className="text-xl align-center">Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Chat region={region} />
    </main>
  );
}
