import React, { useState } from 'react';
import { CssBaseline, Container, Box, Button, Typography, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import SantaHeadIcon from './Icon/SantaIcon';
import DownloadIcon from '@mui/icons-material/Download';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff'
    },
  },
});

const App = () => {
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log(selectedFiles.length)


  const handleFileUpload = async (event) => {

    const files = Array.from(event.target.files);
    console.log("files", files)
    if (files.length === 0) {
      setError('No files selected.');
      return;
    }

    const validTypes = ['text/csv'];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError('Invalid file type. Please upload a CSV  file.');
      return;
    }

    const duplicateFiles = files.filter((file) =>
      selectedFiles.some((existingFile) => existingFile.name === file.name)
    );

    if (duplicateFiles.length > 0) {
      setError('Duplicate files detected.');
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);
    setError('');

    if (files) {
      console.log(files)
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      console.log(formData)

      setError('');
      await uploadFile(formData);
    }
  };

  const uploadFile = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/secretsanta/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (error) {
      console.error('File upload failed:', error);
      setError("File Uploaded error")
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        bgcolor: '#249465',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <SantaHeadIcon width={65} />
        <Typography noWrap sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: '#ffffff',
          textDecoration: 'none',
        }}>Secret Santa Task - DigitalXc</Typography>
      </Box>
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
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'monospace', }}>
          Upload Employee List and Previous Year List
        </Typography>

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
            multiple
            hidden
            onChange={handleFileUpload}
          />
        </Button>
        <br></br>
        {downloadUrl && (
          <Button variant="contained"
            component="label"
            startIcon={<DownloadIcon />}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': { bgcolor: 'primary.dark' },
              p: 2,
              fontSize: '16px',
            }}>

            <Link href={downloadUrl} download="secret_santa_result.csv" sx={{ textDecoration: 'none', color: '#ffffff' }}>  Download Processed CSV
            </Link>

          </Button>

        )}
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}


      </Box>
      <Box sx={{
        bgcolor: '#f05d5e',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <SantaHeadIcon width={65} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
