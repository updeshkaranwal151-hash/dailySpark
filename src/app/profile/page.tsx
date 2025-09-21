
'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { updateProfile, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingScreen from "@/components/loading-screen";


export default function ProfilePage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        try {
            await updateProfile(user, { displayName: name });
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        setIsDeleting(true);
        try {
            await deleteUser(user);
            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted.",
            });
            router.push('/signup');
        } catch (error: any) {
             toast({
                title: "Deletion Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };
    
    if (isAuthLoading || !user) {
      return <LoadingScreen isLoaded={!isAuthLoading} />;
    }

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
        <h1 className="text-xl font-semibold">Profile & Settings</h1>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
          >
            <Link href="/profile" className="font-semibold text-primary">
              Profile
            </Link>
            <Link href="#">
              Account
            </Link>
            <Link href="#">
              Appearance
            </Link>
            <Link href="#">
              Notifications
            </Link>
            <Link href="#">
              Advanced
            </Link>
          </nav>
          <form className="grid gap-6" onSubmit={handleSaveChanges}>
            <Card>
              <CardHeader>
                <CardTitle>Your Name</CardTitle>
                <CardDescription>
                  Please enter your full name.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>
                        Your email address is used for login and notifications. This cannot be changed.
                    </CardDescription>
                </Header>
                <CardContent>
                    <Input type="email" placeholder="Email" value={email} disabled />
                </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                    Manage your account and data. These actions are irreversible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Separator />
                 <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                           {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, delete account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
