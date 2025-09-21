
'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrainCircuit, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth.tsx";
import { GEMINI_API_KEY_STORAGE_KEY } from "@/lib/constants";
import LoadingScreen from "@/components/loading-screen";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();


  useEffect(() => {
    if (!isAuthLoading && user) {
        if (localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY)) {
            router.push('/');
        } else {
            router.push('/welcome');
        }
    }
  }, [user, isAuthLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // The useEffect will handle redirection.
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  if (isAuthLoading || user) {
    return <LoadingScreen isLoaded={!isAuthLoading && !!user} />;
  }

  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
           <div className="flex justify-center items-center gap-2 mb-6">
                 <BrainCircuit className="h-8 w-8 text-primary" />
                 <h1 className="text-3xl font-headline font-bold">Daily Spark</h1>
            </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Max Robinson" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                      />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Create an account'}
                  </Button>
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    Sign up with Google
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
