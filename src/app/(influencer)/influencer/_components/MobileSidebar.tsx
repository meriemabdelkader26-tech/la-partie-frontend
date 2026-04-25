"use client";

import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-gray-50 rounded-xl transition-all">
            <MenuIcon className="w-6 h-6 text-black" />
          </Button>
      </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white border-r border-black/5 w-80">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <Sidebar idPrefix="mobile" />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
