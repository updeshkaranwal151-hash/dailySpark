
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PDFReaderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a PDF file.',
          variant: 'destructive',
        });
        return;
      }
      setIsLoading(true);
      setFile(selectedFile);
      setNumPages(null);
      setPageNumber(1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };
  
  const onDocumentLoadError = (error: Error) => {
    console.error('Error while loading document:', error);
    toast({
        title: 'Error Loading PDF',
        description: error.message || 'Could not load the selected PDF file.',
        variant: 'destructive',
    });
    setFile(null);
    setIsLoading(false);
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

  return (
    <div className="space-y-4">
      <div
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">{file ? 'Change PDF' : 'Click to upload a PDF'}</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="application/pdf"
        />
      </div>

      {file && (
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-semibold">{file.name}</p>
        </div>
      )}

      <div className="flex justify-center items-center gap-4">
        <Button onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading}>
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-2">Previous</span>
        </Button>
        <p className="text-sm font-medium">
          Page {pageNumber} of {numPages || '--'}
        </p>
        <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading}>
          <span className="mr-2">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full bg-muted/50 rounded-md border p-2 min-h-96 flex justify-center items-center">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {!isLoading && !file && (
            <div className="text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto" />
                <p className="mt-2 text-sm">Your PDF will be displayed here.</p>
            </div>
        )}
        {file && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
            className="flex justify-center"
          >
            <Page pageNumber={pageNumber} renderTextLayer={true} />
          </Document>
        )}
      </div>
    </div>
  );
}
