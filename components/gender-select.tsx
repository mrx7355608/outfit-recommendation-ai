"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Gender = "Male" | "Female" | "Non-binary" | "Prefer not to say" | null;

interface GenderSelectProps {
  onSelect?: (gender: Gender) => void;
}

export function GenderSelect({ onSelect }: GenderSelectProps) {
  const [selected, setSelected] = useState<Gender>(null);

  const handleSelect = (gender: Gender) => {
    setSelected(gender);
    if (onSelect) {
      onSelect(gender);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          {selected || "Select Gender"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Gender</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleSelect("Male")}
          className="flex justify-between"
        >
          Male {selected === "Male" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("Female")}
          className="flex justify-between"
        >
          Female {selected === "Female" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("Non-binary")}
          className="flex justify-between"
        >
          Non-binary{" "}
          {selected === "Non-binary" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("Prefer not to say")}
          className="flex justify-between"
        >
          Prefer not to say{" "}
          {selected === "Prefer not to say" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
