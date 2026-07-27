import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Authentication Module Ready
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl">
            Build Faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">DevFlow</span>
          </h1>
          <p className="mx-auto max-w-[600px] text-xl text-muted-foreground">
            The ultimate modern SaaS starter kit with Next.js, Express, Prisma, and Firebase Auth.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8 h-12 text-md">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-md">Create Account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
