
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withAdminAuth } from "@/hooks/use-auth.tsx";
import Link from "next/link";

function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="font-headline text-lg font-bold">Daily Spark</Link>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </header>
       <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Welcome, Admin!</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>This is a protected area for administrators.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You have special privileges.</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

export default withAdminAuth(AdminPage);
