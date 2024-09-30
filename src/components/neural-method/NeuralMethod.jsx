import React, { useState } from 'react';
import { Box, Button, LinearProgress, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import axios from "../../api/axios";

const NeuralMethod = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [method, setMethod] = useState('neural'); // Default to 'neural'

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleMethodChange = (event) => {
        setMethod(event.target.value);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        let endpoint = '';

        // Определяем конечный URL в зависимости от выбранного метода
        switch (method) {
            case 'neural':
                endpoint = '/v1/neural-method/predict';
                break;
            case 'ngramm':
                endpoint = '/v1/ngramm-method/predict';
                break;
            case 'alphabet':
                endpoint = '/v1/alphabet-method/predict';
                break;
            default:
                return;
        }

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponseMessage(response.data);  // Предполагается, что сервер возвращает строку в поле result
        } catch (error) {
            console.error('Error uploading file:', error);
            setResponseMessage('Произошла ошибка при загрузке файла');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
                Загрузить HTML файл
            </Typography>
            <input
                type="file"
                accept=".html"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
            />
            <label htmlFor="file-upload">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadFile />}
                >
                    Выбрать файл
                </Button>
            </label>

            {selectedFile && (
                <Typography variant="body1" mt={2}>
                    Выбран файл: {selectedFile.name}
                </Typography>
            )}

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="method-select-label">Метод</InputLabel>
                <Select
                    labelId="method-select-label"
                    value={method}
                    label="Метод"
                    onChange={handleMethodChange}
                >
                    <MenuItem value="neural">Нейронный</MenuItem>
                    <MenuItem value="ngramm">Н-грамм</MenuItem>
                    <MenuItem value="alphabet">Алфавитный</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                sx={{ mt: 2 }}
            >
                Загрузить
            </Button>

            {uploading && <LinearProgress sx={{ width: '100%', mt: 2 }} />}

            {responseMessage && (
                <Typography variant="body2" mt={2}>
                    Результат: {responseMessage}
                </Typography>
            )}
        </Box>
    );
};

export default NeuralMethod;
