
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUserData, saveUserData } from '@/services/database';

export default function NotesTool() {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getUserData(user.uid, 'note').then((savedNote) => {
        if (savedNote && typeof savedNote === 'string') {
          setNote(savedNote);
        }
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    await saveUserData(user.uid, 'note', note);
    toast({ title: 'Note saved!', description: 'Your note has been saved to the cloud.' });
  };

  const handleDownload = () => {
    const blob = new Blob([note], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Note downloaded!', description: 'note.txt has been downloaded.' });
  };
  
  const handleClear = async () => {
    if (!user) return;
    setNote('');
    await saveUserData(user.uid, 'note', '');
    toast({ title: 'Note cleared!', variant: 'destructive' });
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(80vh-180px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-[calc(80vh-180px)]">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Start typing your note here..."
        className="flex-1 text-base"
      />
      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={handleClear} disabled={!note}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!note}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Note
        </Button>
      </div>
    </div>
  );
}
