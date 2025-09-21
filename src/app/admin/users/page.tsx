
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withAdminAuth } from "@/hooks/use-auth.tsx";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const sampleUsers = [
    { name: "Liam Johnson", email: "liam@example.com", role: "User", signedUp: "2023-06-23" },
    { name: "Olivia Smith", email: "olivia@example.com", role: "User", signedUp: "2023-06-24" },
    { name: "Apoorv Karanwal", email: "apoorvkaranwalwhat@gmail.com", role: "Admin", signedUp: "2023-06-22" },
    { name: "Noah Williams", email: "noah@example.com", role: "User", signedUp: "2023-06-25" },
    { name: "Emma Brown", email: "emma@example.com", role: "User", signedUp: "2023-06-26" },
];


function AdminUsersPage() {
  return (
     <AdminLayout>
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead className="hidden sm:table-cell">Role</TableHead>
                        <TableHead className="hidden md:table-cell">Signed Up</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sampleUsers.map(user => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {user.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant={user.role === 'Admin' ? 'default' : 'outline'}>{user.role}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{user.signedUp}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
     </AdminLayout>
  );
}


function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="font-headline text-lg font-bold">Daily Spark</Link>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </header>
       <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Users</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
           <nav
            className="grid gap-4 text-sm text-muted-foreground"
          >
            <Link href="/admin">
              Dashboard
            </Link>
            <Link href="/admin/users" className="font-semibold text-primary">
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
      </main>
    </div>
  )
}

export default withAdminAuth(AdminUsersPage);

