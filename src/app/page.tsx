
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { allTools } from '@/lib/tools';
import {
  Search,
  LayoutGrid,
  Zap,
  Globe,
  BrainCircuit,
  Star,
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolCard } from '@/components/dashboard/tool-card';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import LoadingScreen from '@/components/loading-screen';
import { useAllFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';


type Category = 'All' | 'Offline' | 'Online' | 'AI' | 'Favorites';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<Category>('All');
  const [theme, setTheme] = React.useState('dark');
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const favoriteToolIds = useAllFavorites();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        title: 'Logout Failed',
        description: 'An error occurred while logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const filteredTools = React.useMemo(() => {
    let tools = allTools;
    if (activeCategory !== 'All') {
      if (activeCategory === 'Favorites') {
        tools = tools.filter(tool => favoriteToolIds.includes(tool.id));
      } else {
        tools = tools.filter(tool => tool.category === activeCategory);
      }
    }
    if (searchTerm) {
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return tools;
  }, [searchTerm, activeCategory, favoriteToolIds]);

  const sidebarItems = [
    { name: 'All Tools', icon: <LayoutGrid />, category: 'All' },
    { name: 'Offline', icon: <Zap />, category: 'Offline' },
    { name: 'Online', icon: <Globe />, category: 'Online' },
    { name: 'AI', icon: <BrainCircuit />, category: 'AI' },
    { name: 'Favorites', icon: <Star />, category: 'Favorites' },
  ] as const;

  if (isLoading || !user) {
    return <LoadingScreen isLoaded={!isLoading} />;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 font-headline text-2xl font-bold">
            <motion.div
              animate={{ rotate: [0, 15, -10, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BrainCircuit className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="group-data-[collapsible=icon]:hidden">
              Daily Spark
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarItems.map(item => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  onClick={() => setActiveCategory(item.category)}
                  isActive={activeCategory === item.category}
                  tooltip={{ children: item.name }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Admin Panel' }}
                >
                  <Link href="/admin">
                    <Shield />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Log Out' }}>
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a tool..."
              className="w-full rounded-full bg-muted pl-10 pr-4"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || 'John Doe'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'john.doe@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <div className="p-4 md:p-6">
                <AnimatePresence>
                    <motion.div
                    layout
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    >
                    {filteredTools.map((tool, index) => (
                        <ToolCard key={tool.id} tool={tool} index={index} />
                    ))}
                    </motion.div>
                </AnimatePresence>
                {filteredTools.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                        <Search className="w-16 h-16 mb-4"/>
                        <p className="font-headline text-xl">No tools found</p>
                        <p>Try a different search term or category.</p>
                    </div>
                )}
              </div>
            </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
