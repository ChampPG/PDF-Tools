import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  IconButton,
  Grid,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Add,
  ContentCut,
  Description,
  Refresh
} from '@mui/icons-material';

export function PDFSplitter() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitRanges, setSplitRanges] = useState([]);
  const [splitPreviews, setSplitPreviews] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  const createPreviewUrl = useCallback(async (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Please drop a valid PDF file');
      return;
    }

    try {
      setPdfFile(file);
      setError(null);
      
      // Create preview URL
      await createPreviewUrl(file);
      
      // Get total pages
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPageCount();
      setTotalPages(pages);
      
      // Initialize with single range
      const initialRange = { id: 1, start: 1, end: pages, name: 'Part 1' };
      setSplitRanges([initialRange]);
      setInputValues({ 1: { start: '1', end: pages.toString() } });
      
    } catch (err) {
      console.error('Error processing dropped file:', err);
      setError('Error processing dropped file. Please try again.');
    }
  }, [createPreviewUrl]);

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    try {
      setPdfFile(file);
      setError(null);
      
      // Create preview URL
      await createPreviewUrl(file);
      
      // Get total pages
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPageCount();
      setTotalPages(pages);
      
      // Initialize with single range
      const initialRange = { id: 1, start: 1, end: pages, name: 'Part 1' };
      setSplitRanges([initialRange]);
      setInputValues({ 1: { start: '1', end: pages.toString() } });
      
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Error processing file. Please try again.');
    }
  }, [createPreviewUrl]);

  const addSplitRange = () => {
    const newId = splitRanges.length + 1;
    const newRange = { 
      id: newId, 
      start: 1, 
      end: totalPages, 
      name: `Part ${newId}` 
    };
    setSplitRanges(prev => [...prev, newRange]);
    setInputValues(prev => ({
      ...prev,
      [newId]: { start: '1', end: totalPages.toString() }
    }));
  };

  const removeSplitRange = (id) => {
    setSplitRanges(prev => prev.filter(range => range.id !== id));
    setSplitPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[id];
      return newPreviews;
    });
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const updateSplitRange = (id, field, value) => {
    setSplitRanges(prev => prev.map(range => 
      range.id === id ? { ...range, [field]: value } : range
    ));
  };

  const handleInputChange = (id, field, value) => {
    setInputValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleInputBlur = (id, field) => {
    const currentValue = inputValues[id]?.[field] || '';
    let finalValue;
    
    if (field === 'start') {
      finalValue = currentValue === '' ? 1 : parseInt(currentValue) || 1;
    } else if (field === 'end') {
      finalValue = currentValue === '' ? totalPages : parseInt(currentValue) || totalPages;
    }
    
    // Update the range with the final value
    updateSplitRange(id, field, finalValue);
    
    // Update the input value to show the final value
    setInputValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: finalValue.toString()
      }
    }));
  };

  const generateSplitPreviews = useCallback(async () => {
    if (!pdfFile || splitRanges.length === 0) return;

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const newPreviews = {};
      
      for (const range of splitRanges) {
        if (range.start <= range.end && range.start <= totalPages && range.end <= totalPages) {
          const splitPdf = await PDFDocument.create();
          const pageIndices = [];
          
          for (let i = range.start - 1; i < range.end; i++) {
            if (i < pdf.getPageCount()) {
              pageIndices.push(i);
            }
          }
          
          const copiedPages = await splitPdf.copyPages(pdf, pageIndices);
          copiedPages.forEach(page => splitPdf.addPage(page));
          
          const splitPdfBytes = await splitPdf.save();
          const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          newPreviews[range.id] = url;
        }
      }
      
      setSplitPreviews(newPreviews);
    } catch (err) {
      console.error('Error generating previews:', err);
      setError('Error generating previews. Please try again.');
    }
  }, [pdfFile, splitRanges, totalPages]);

  const splitPDF = async () => {
    if (!pdfFile || splitRanges.length === 0) {
      setError('Please upload a PDF file and define split ranges');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      for (const range of splitRanges) {
        if (range.start <= range.end && range.start <= totalPages && range.end <= totalPages) {
          const splitPdf = await PDFDocument.create();
          const pageIndices = [];
          
          for (let i = range.start - 1; i < range.end; i++) {
            if (i < pdf.getPageCount()) {
              pageIndices.push(i);
            }
          }
          
          const copiedPages = await splitPdf.copyPages(pdf, pageIndices);
          copiedPages.forEach(page => splitPdf.addPage(page));
          
          const splitPdfBytes = await splitPdf.save();
          const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          // Create download link
          const link = document.createElement('a');
          link.href = url;
          link.download = `${range.name}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      setError('Error splitting PDF. Please try again.');
      console.error('Error splitting PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate previews when ranges change
  useEffect(() => {
    if (pdfFile && splitRanges.length > 0) {
      generateSplitPreviews();
    }
  }, [splitRanges, pdfFile, generateSplitPreviews]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      Object.values(splitPreviews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrl, splitPreviews]);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      {/* Left side - File upload and split controls */}
      <Box sx={{ width: '50%', p: 3, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              PDF Splitter
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Split your PDF into multiple parts
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
              onChange={handleFileChange}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragOver ? 'Drop PDF file here' : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PDF file only
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {pdfFile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Uploaded File
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {pdfFile.name}
                </Typography>
                <Chip label={`Total pages: ${totalPages}`} color="info" size="small" />
              </Paper>

              {/* Split Ranges */}
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Split Ranges
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addSplitRange}
                    size="small"
                  >
                    Add Range
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {splitRanges.map((range) => (
                    <Card key={range.id} variant="outlined">
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h8">
                            Output File Name
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <TextField
                            size="small"
                            value={range.name}
                            onChange={(e) => updateSplitRange(range.id, 'name', e.target.value)}
                            placeholder="Part name"
                            sx={{ minWidth: 250, flexGrow: 1, mr: 2 }}
                          />
                          {splitRanges.length > 1 && (
                            <IconButton
                              onClick={() => removeSplitRange(range.id)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Box>
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="Start Page"
                              value={inputValues[range.id]?.start || range.start}
                              onChange={(e) => handleInputChange(range.id, 'start', e.target.value)}
                              onBlur={() => handleInputBlur(range.id, 'start')}
                              inputProps={{ min: 1, max: totalPages }}
                              sx={{ 
                                '& .MuiInputBase-root': {
                                  minHeight: '48px',
                                  minWidth: '100px',
                                  maxWidth: '100px'
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              label="End Page"
                              value={inputValues[range.id]?.end || range.end}
                              onChange={(e) => handleInputChange(range.id, 'end', e.target.value)}
                              onBlur={() => handleInputBlur(range.id, 'end')}
                              inputProps={{ min: 1, max: totalPages }}
                              sx={{ 
                                '& .MuiInputBase-root': {
                                  minHeight: '48px',
                                  minWidth: '100px',
                                  maxWidth: '100px'
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          Pages {range.start} to {range.end} ({range.end - range.start + 1} pages)
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<ContentCut />}
                  onClick={splitPDF}
                  disabled={isProcessing || splitRanges.length === 0}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  {isProcessing ? 'Splitting...' : 'Split PDF'}
                </Button>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right side - PDF previews */}
      <Box sx={{ width: '50%', p: 3, bgcolor: 'grey.50', overflowY: 'auto' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Split Previews
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {pdfFile ? (
            <>
              {/* Original PDF Preview */}
              <Card elevation={1}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Original PDF
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
                      src={previewUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="Original PDF preview"
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Split PDF Previews */}
              {splitRanges.map((range) => (
                <Card key={range.id} elevation={1}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {range.name} (Pages {range.start}-{range.end})
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
                      {splitPreviews[range.id] ? (
                        <iframe
                          src={splitPreviews[range.id]}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          title={`Preview of ${range.name}`}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary'
                          }}
                        >
                          <Refresh sx={{ mr: 1 }} />
                          Generating preview...
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <Description sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No PDF file uploaded
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload a PDF file to see previews
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
} 