import { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PDFMerger } from './components/PDFMerger';
import { PDFSplitter } from './components/PDFSplitter';
import { LandingPage } from './components/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'merger', or 'splitter'

  const navigateToMerger = () => {
    setCurrentPage('merger');
  };

  const navigateToSplitter = () => {
    setCurrentPage('splitter');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: 'grey.50' }}>
      {currentPage === 'landing' ? (
        <LandingPage 
          onNavigateToMerger={navigateToMerger} 
          onNavigateToSplitter={navigateToSplitter}
        />
      ) : (
        <Box sx={{ position: 'relative' }}>
          {/* Back to Landing Page Button */}
          <Button
            onClick={navigateToLanding}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              bgcolor: 'white',
              '&:hover': {
                bgcolor: 'grey.50'
              }
            }}
          >
            Back to Home
          </Button>
          {currentPage === 'merger' ? <PDFMerger /> : <PDFSplitter />}
        </Box>
      )}
    </Box>
  );
}

export default App;
