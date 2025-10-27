import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Dixie Pacheco"
            width={300}
            height={80}
            priority
          />
        </div>
        <p className="text-muted-foreground text-lg">
          Client and project management for freelance web designers
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
