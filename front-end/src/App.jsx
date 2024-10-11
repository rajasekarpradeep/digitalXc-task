import React, { useState } from 'react';
import { CssBaseline, Container, Box, Button, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff'
    },
  },
});

const App = () => {
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validExtensions = ['csv'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        setError('Invalid file type. Please upload a CSV  file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      setError('');
      uploadFile(formData);
    }
  };

  const uploadFile = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/secretsanta/single/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('File upload failed:', error);
      setError("File Uploaded error")
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          sx={{
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Typography variant='h6'>Secret Santa Task</Typography>
          <Typography variant="h4" gutterBottom>
            Upload Your File
          </Typography>

          {/* Upload Button */}
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': { bgcolor: 'primary.dark' },
              p: 2,
              fontSize: '16px',
            }}
          >
            Upload File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
