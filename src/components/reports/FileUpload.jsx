// src/components/FileUpload.jsx
import React, { useState } from 'react';
import axios from '../../api/axios';
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Input,
  LinearProgress,
} from '@mui/material';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileText, setFileText] = useState('');
  const [documentContent, setDocumentContent] = useState(null);
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleHint = async () => {
    try {
      const response = await axios.get('/v1/open-ai/', {
        params: { text: 'Provide instructions for uploading a text file.' },
      });
      setHint(response.data);
    } catch (err) {
      setError('Error fetching hint');
      console.error(err);
    }
  };

  React.useEffect(() => {
    handleHint();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);

    // Read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileText(e.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Send the file to '/v1/referat/report' to get the PDF report
      const formData = new FormData();
      formData.append('file', file, file.name);

      const pdfResponse = await axios.post('/v1/referat/report', formData, {
        responseType: 'blob', // Important to handle binary data
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Create a URL for the PDF blob
      const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Revoke the object URL after the download
      URL.revokeObjectURL(pdfUrl);

      // 2. Send a POST request to create the document
      await axios.post('/v1/text-documents/create-document', {
        name: fileName,
        text: fileText,
      });

      // 3. Make a GET request to retrieve the document
      const response = await axios.get(
        `/v1/text-documents/${encodeURIComponent(fileName)}`
      );

      // Display the retrieved document content (first 500 characters)
      setDocumentContent({
        name: response.data.name,
        text: response.data.text.substring(0, 500), // Get first 500 characters
      });
    } catch (err) {
      setError('Error processing file.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Get Report
      </Typography>
      <Card style={{ marginBottom: 20 }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {hint || 'Please select a text file to upload and get report.'}
          </Typography>
        </CardContent>
      </Card>

      <Input
        type="file"
        inputProps={{ accept: '.txt' }}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
        style={{ marginLeft: 10 }}
      >
        {loading ? 'Processing...' : 'Send File And Get Report'}
      </Button>

      {loading && <LinearProgress style={{ marginTop: 10 }} />}

      {error && (
        <Typography color="error" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}

      {documentContent && (
        <Card style={{ marginTop: 20 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {documentContent.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {documentContent.text}
              {documentContent.text.length === 500 && '...'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default FileUpload;
