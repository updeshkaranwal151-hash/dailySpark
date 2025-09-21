
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth.tsx';
import { updateProfile, deleteUser, updatePassword, sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/alert-dialog';
import LoadingScreen from '@/components/loading-screen';
import { ArrowLeft, BrainCircuit, Loader2, BadgeCheck, BadgeAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthLoading) {
      if (user) {
        setName(user.displayName || '');
      } else {
        router.push('/login');
      }
    }
  }, [user, isAuthLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      toast({
        title: 'Profile Updated',
        description: 'Your name has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPassword) return;

    setIsChangingPassword(true);
    try {
        // Note: Re-authentication is often required for sensitive operations.
        // For simplicity, we are not implementing it here, but in a real app,
        // you would re-authenticate the user before calling updatePassword.
        await updatePassword(user, newPassword);
        toast({
            title: 'Password Updated',
            description: 'Your password has been successfully changed.',
        });
        setPassword('');
        setNewPassword('');
    } catch (error: any) {
        toast({
            title: 'Password Change Failed',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsChangingPassword(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    setIsSendingVerification(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox to verify your email address.',
      });
    } catch (error: any) {
       toast({
        title: 'Error Sending Email',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setIsSendingVerification(false);
    }
  }


  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteUser(user);
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      router.push('/signup');
    } catch (error: any) {
      toast({
        title: 'Deletion Failed',
        description: error.message + ' You may need to log in again to perform this action.',
        variant: 'destructive',
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
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <Link href="/" className="font-headline text-lg font-bold hidden sm:block">
            Daily Spark
          </Link>
        </div>
        <h1 className="text-xl font-semibold">Profile</h1>
      </header>
      <main className="flex flex-1 justify-center bg-muted/40 p-4 md:p-10">
        <div className="w-full max-w-2xl space-y-6">
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                   <div className="flex items-center gap-2">
                     <Input id="email" type="email" value={user.email || ''} disabled />
                     {user.emailVerified ? (
                       <BadgeCheck className="h-5 w-5 text-green-500" />
                     ) : (
                       <BadgeAlert className="h-5 w-5 text-yellow-500" />
                     )}
                   </div>
                </div>
                 {!user.emailVerified && (
                    <Alert>
                      <AlertTitle className="flex items-center gap-2">
                        <BadgeAlert className="h-4 w-4" />
                        Email not verified
                      </AlertTitle>
                      <AlertDescription>
                        Your email address has not been verified. Please check your inbox or click below to resend the verification link.
                      </AlertDescription>
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="p-0 h-auto mt-2" 
                        onClick={handleSendVerification}
                        disabled={isSendingVerification}
                      >
                         {isSendingVerification ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                         Resend verification email
                      </Button>
                    </Alert>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <form onSubmit={handleChangePassword}>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isChangingPassword}
                          placeholder="Enter your new password"
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isChangingPassword || !newPassword}>
                        {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </CardFooter>
            </form>
          </Card>
          
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm font-medium">Delete your account and all associated data.</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                      Yes, delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
