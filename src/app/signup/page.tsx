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
import { BrainCircuit } from "lucide-react"

export default function SignupPage() {
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
              <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Max Robinson" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full" asChild>
                  <Link href="/">Create an account</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </div>
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
