import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import JSZip from 'jszip';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload = ({ onFileUpload, isAnalyzing }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Handle .txt files directly
    if (selectedFile.name.endsWith('.txt') && selectedFile.type === 'text/plain') {
      setFile(selectedFile);
      return;
    }

    // Handle .zip files
    if (selectedFile.name.endsWith('.zip') || selectedFile.type === 'application/zip' || selectedFile.type === 'application/x-zip-compressed') {
      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(selectedFile);
        
        // Find the first .txt file in the zip
        const txtFiles = Object.keys(zipContent.files).filter(filename => 
          filename.endsWith('.txt') && !zipContent.files[filename].dir
        );

        if (txtFiles.length === 0) {
          toast({
            variant: "destructive",
            title: "No .txt File Found",
            description: "The ZIP file doesn't contain a WhatsApp chat .txt file.",
          });
          return;
        }

        // Extract the first .txt file
        const txtFileName = txtFiles[0];
        const txtContent = await zipContent.files[txtFileName].async('blob');
        
        // Create a new File object from the extracted content
        const extractedFile = new File([txtContent], txtFileName, { type: 'text/plain' });
        setFile(extractedFile);

        toast({
          title: "ZIP Extracted Successfully",
          description: `Found and extracted: ${txtFileName}`,
        });
      } catch (error) {
        console.error('Error extracting ZIP:', error);
        toast({
          variant: "destructive",
          title: "ZIP Extraction Failed",
          description: "Could not extract the ZIP file. Please try uploading the .txt file directly.",
        });
      }
      return;
    }

    // Invalid file type
    toast({
      variant: "destructive",
      title: "Invalid File Type",
      description: "Please upload a .txt file or .zip file containing WhatsApp chat export.",
    });
  }, [toast]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  }, [handleFile]);

  const onDragEnter = useCallback(() => setIsDragOver(true), []);
  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const handleAnalyze = () => {
    if (!file) return;

    // Start analysis immediately (don't wait for upload)
    onFileUpload(file);

    // Upload to server in background (fire and forget)
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(result => {
        console.log('✅ Background upload successful:', result);
      })
      .catch(error => {
        console.error('⚠️ Background upload failed:', error);
      });
  };

  if (file) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">File Ready for Analysis</h3>
          <p className="text-sm text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setFile(null)} disabled={isAnalyzing}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`relative rounded-xl border-2 border-dashed p-6 md:p-8 text-center transition-colors
        ${isDragOver ? 'border-primary bg-primary/10' : 'border-border'}`}
    >
      <div className="space-y-3">
        <div className="mx-auto h-12 w-12 text-muted-foreground">
          <Upload />
        </div>
        <h3 className="text-xl font-semibold">Upload your chat file</h3>
        <p className="text-sm text-muted-foreground">
          Drag & drop your .txt or .zip file here or{' '}
          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
            click to browse
          </label>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          📦 ZIP files will be automatically extracted
        </p>
      </div>
      <input
        type="file"
        id="file-upload"
        accept=".txt,.zip,text/plain,application/zip,application/x-zip-compressed"
        onChange={onFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isAnalyzing}
      />
    </div>
  );
};

export default FileUpload;
