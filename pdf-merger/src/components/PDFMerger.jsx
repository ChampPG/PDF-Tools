import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Card,
  CardContent,
  IconButton,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  DragIndicator,
  Clear,
  Merge,
  Description
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePDFItem } from './SortablePDFItem';

export function PDFMerger() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});
  const [addBlankPages, setAddBlankPages] = useState(false);
  const [outputFileName, setOutputFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setPdfFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const createPreviewUrl = useCallback(async (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [file.name]: url }));
      resolve(url);
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    try {
      // Process all files first
      const newFiles = files
        .filter(file => file.type === 'application/pdf')
        .map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
        }));

      if (newFiles.length === 0) {
        setError('Please drop valid PDF files only');
        return;
      }

      // Create preview URLs for all files
      const previewPromises = newFiles.map(({ file }) => createPreviewUrl(file));
      await Promise.all(previewPromises);

      // Update state with all new files
      setPdfFiles(prev => [...prev, ...newFiles]);
      setError(null);
    } catch (err) {
      console.error('Error processing dropped files:', err);
      setError('Error processing dropped files. Please try again.');
    }
  }, [createPreviewUrl]);

  const handleFileChange = useCallback(async (event) => {
    const files = event.target.files;
    if (!files) return;

    try {
      // Process all files first
      const newFiles = Array.from(files)
        .filter(file => file.type === 'application/pdf')
        .map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
        }));

      // Create preview URLs for all files
      const previewPromises = newFiles.map(({ file }) => createPreviewUrl(file));
      await Promise.all(previewPromises);

      // Update state with all new files
      setPdfFiles(prev => [...prev, ...newFiles]);
      setError(null);
    } catch (err) {
      console.error('Error processing files:', err);
      setError('Error processing files. Please try again.');
    }
  }, [createPreviewUrl]);

  const removeFile = useCallback((id) => {
    // console.log('Removing file with id:', id); // Debug log
    setPdfFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        // Revoke the preview URL when removing a file
        if (previewUrls[fileToRemove.name]) {
          URL.revokeObjectURL(previewUrls[fileToRemove.name]);
        }
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls[fileToRemove.name];
          return newUrls;
        });
      }
      return prev.filter(file => file.id !== id);
    });
  }, [previewUrls]);

  const mergePDFs = async () => {
    if (pdfFiles.length === 0) {
      setError('Please upload at least one PDF file');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < pdfFiles.length; i++) {
        const pdfFile = pdfFiles[i];
        const fileArrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        // Add blank page after each PDF (except the last one) if toggle is enabled
        if (addBlankPages && i < pdfFiles.length - 1) {
          const blankPage = mergedPdf.addPage();
          // Set the page size to match the first page of the current PDF
          const firstPage = pdf.getPage(0);
          const { width, height } = firstPage.getSize();
          blankPage.setSize(width, height);
        }
      }

      const mergedPdfFile = await mergedPdf.save();
      
      // Create a download link
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use custom filename or default to "merged.pdf"
      const fileName = outputFileName.trim() || 'merged.pdf';
      // Ensure the filename ends with .pdf
      const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      link.download = finalFileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error merging PDFs. Please try again.');
      console.error('Error merging PDFs:', err);
    } finally {
      setIsMerging(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      {/* Left side - File list and controls */}
      <Box sx={{ width: '50%', p: 3, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              PDF Merger
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Upload and merge your PDF files
            </Typography>
          </Box>

          {/* File Upload */}
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: isDragOver ? 'primary.main' : 'primary.main',
              bgcolor: isDragOver ? 'primary.50' : 'grey.50',
              '&:hover': {
                bgcolor: isDragOver ? 'primary.50' : 'grey.100'
              },
              transition: 'all 0.2s ease'
            }}
            component="label"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              style={{ display: 'none' }}
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragOver ? 'Drop PDF files here' : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PDF files only
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {pdfFiles.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Merge Options */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Merge Options
                </Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={addBlankPages}
                      onChange={(e) => setAddBlankPages(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Add blank page between each PDF"
                />
                
                {addBlankPages && (
                  <Chip
                    label={`${pdfFiles.length > 1 ? pdfFiles.length - 1 : 0} blank page(s) will be added`}
                    color="info"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Output filename"
                  value={outputFileName}
                  onChange={(e) => setOutputFileName(e.target.value)}
                  placeholder="merged.pdf"
                  helperText="Leave blank to use 'merged.pdf' as the default filename"
                  sx={{ mt: 2 }}
                />
              </Paper>

              {/* PDF Files List */}
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    PDF Files ({pdfFiles.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drag and drop to reorder
                  </Typography>
                </Box>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pdfFiles.map(file => file.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {pdfFiles.map((file) => (
                        <SortablePDFItem
                          key={file.id}
                          id={file.id}
                          name={file.name}
                          size={file.size}
                          onRemove={() => removeFile(file.id)}
                        />
                      ))}
                    </Box>
                  </SortableContext>
                </DndContext>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={() => {
                      setPdfFiles([]);
                      // Clean up all preview URLs
                      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
                      setPreviewUrls({});
                    }}
                    disabled={isMerging}
                    fullWidth
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Merge />}
                    onClick={mergePDFs}
                    disabled={isMerging}
                    fullWidth
                  >
                    {isMerging ? 'Merging...' : 'Merge PDFs'}
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right side - PDF previews */}
      <Box sx={{ width: '50%', p: 3, bgcolor: 'grey.50', overflowY: 'auto' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          PDF Previews
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {pdfFiles.map((file) => (
            <Card key={file.id} elevation={1}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  {formatFileSize(file.size)}
                </Typography>
                <Box
                  sx={{
                    aspectRatio: '3/4',
                    width: '100%',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <iframe
                    src={previewUrls[file.name]}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title={`Preview of ${file.name}`}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
          
          {pdfFiles.length === 0 && (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <Description sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No PDF files uploaded
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload PDF files to see previews
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
} 