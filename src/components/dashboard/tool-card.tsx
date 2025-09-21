'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Tool } from '@/lib/tools';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(tool.isFavorite);
  const Icon = Icons[tool.icon];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you would typically also update the tool's state globally or via an API call
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="h-full"
        >
          <Card className="flex h-full transform-gpu cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <CardHeader className="flex-grow">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className="h-8 w-8 shrink-0"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isFavorite
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground hover:text-amber-400'
                    )}
                  />
                </Button>
              </div>
              <CardTitle className="pt-4 font-headline">{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <div className="mt-auto flex justify-end p-4 pt-0">
                <span className="text-xs font-semibold uppercase text-primary/70">{tool.category}</span>
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>
      {tool.component && (
        <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px] lg:sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Icon className="h-5 w-5 text-primary" />
              {tool.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <tool.component />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
