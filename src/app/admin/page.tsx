
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withAdminAuth } from "@/hooks/use-auth.tsx";
import Link from "next/link";
import { Activity, Users, BrainCircuit, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function AdminDashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>An overview of the most recent sign-ups.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Signed Up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                  <TableCell>
                      <div className="font-medium">Liam Johnson</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                      </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">User</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
                  <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                          <Link href="/admin/users">View</Link>
                      </Button>
                  </TableCell>
              </TableRow>
              <TableRow>
                  <TableCell>
                      <div className="font-medium">Olivia Smith</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                          olivia@example.com
                      </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">User</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">2023-06-24</TableCell>
                   <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                          <Link href="/admin/users">View</Link>
                      </Button>
                  </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}


function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-10">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
                </Link>
            </Button>
            <Link href="/" className="font-headline text-lg font-bold hidden sm:block">Daily Spark</Link>
        </div>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </header>
       <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40">
        <ScrollArea className="flex-1">
          <div className="p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
              <h1 className="text-3xl font-semibold">Dashboard</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
              <nav
                className="grid gap-4 text-sm text-muted-foreground md:sticky md:top-24"
              >
                <Link href="/admin" className="font-semibold text-primary">
                  Dashboard
                </Link>
                <Link href="/admin/users">
                  Users
                </Link>
                <Link href="#">
                  Analytics
                </Link>
                <Link href="#">
                  Settings
                </Link>
              </nav>
              <div className="grid gap-6">
                {children}
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}


function AdminPage() {
    return (
        <AdminLayout>
            <AdminDashboardPage />
        </AdminLayout>
    )
}

export default withAdminAuth(AdminPage);
