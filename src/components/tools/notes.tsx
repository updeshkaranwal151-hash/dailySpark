
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Trash2 } from 'lucide-react';

export default function NotesTool() {
  const [note, setNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedNote = localStorage.getItem('daily-spark-note');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('daily-spark-note', note);
    toast({ title: 'Note saved!', description: 'Your note has been saved locally.' });
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
  
  const handleClear = () => {
    setNote('');
    localStorage.removeItem('daily-spark-note');
    toast({ title: 'Note cleared!', variant: 'destructive' });
  };

  return (
    <div className="flex flex-col gap-4 h-[60vh]">
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
