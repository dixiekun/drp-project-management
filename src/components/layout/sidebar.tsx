"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-60 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Dixie Pacheco"
            width={120}
            height={32}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
