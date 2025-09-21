
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
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
            <Link href="#" className="font-semibold text-primary">
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
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Name</CardTitle>
                <CardDescription>
                  Please enter your full name.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="Full Name" defaultValue="John Doe" />
                </form>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>
                        Your email address is used for login and notifications.
                    </CardDescription>
                </Header>
                <CardContent>
                    <form>
                        <Input type="email" placeholder="Email" defaultValue="john.doe@example.com" />
                    </form>
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
                    <Button variant="destructive">Delete</Button>
                 </div>
              </CardContent>
            </Card>

            <Button>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
