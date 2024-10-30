import React, { useState } from 'react';
import {
    Box,
    Button,
    LinearProgress,
    Typography,
    TextField,
} from '@mui/material';
import axios from "../../api/axios";

const MachineTranslator = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setResponseMessage(null);
        setResponseStatus(null);
        setErrorMessage(null);

        try {
            const response = await axios.post('/v1/machine-translator/translate', {
                text, // Отправляем текст в теле запроса
            }, {
                responseType: 'blob', // Получаем файл в виде blob
            });

            // Создаем URL для скачивания файла
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'translation.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setResponseMessage('Файл успешно загружен');
            setResponseStatus(response.status); // Сохраняем статус ответа
        } catch (error) {
            console.error('Ошибка при переводе текста:', error);

            // Проверяем, есть ли ошибка и устанавливаем соответствующее сообщение
            if (error.response) {
                setErrorMessage(`Ошибка: ${error.response.data.message || 'Неизвестная ошибка'}`);
                setResponseStatus(error.response.status);
            } else {
                setErrorMessage('Произошла ошибка при переводе текста');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
                Перевод текста
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    label="Введите текст на английском"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={text}
                    onChange={handleInputChange}
                    required
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <LinearProgress size={24} sx={{ width: '100%' }} /> : 'Перевести'}
                    </Button>
                </Box>
            </form>

            {responseMessage && (
                <Typography variant="body2" mt={2}>
                    Результат: {responseMessage}
                </Typography>
            )}

            {responseStatus && (
                <Typography variant="body2" color="textSecondary" mt={2}>
                    Статус ответа: {responseStatus}
                </Typography>
            )}

            {errorMessage && (
                <Typography variant="body2" color="error" mt={2}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
};

export default MachineTranslator;
