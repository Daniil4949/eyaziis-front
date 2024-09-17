import React, {useEffect, useState} from 'react';
import {CircularProgress, Container, Typography, Card, CardContent, Alert, Grid} from '@mui/material';
import axios from '../../api/axios';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/v1/text-documents');  // Пример API-эндпоинта
            setDocuments(response.data);
        } catch (err) {
            setError('Error fetching documents');
            console.error(err);  // Логируем ошибку для отладки
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    if (loading) {
        return (<Container>
            <CircularProgress/>
        </Container>);
    }

    if (error) {
        return (<Container>
            <Alert severity="error">{error}</Alert>
        </Container>);
    }

    return (<Container>
        {documents.length > 0 ? (<Grid container spacing={2}>
            {documents.map((doc) => (<Grid item xs={12} key={doc._id}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {doc.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {doc.text} {/* Отображаем весь текст документа */}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>))}
        </Grid>) : (<Typography variant="h6">No documents found.</Typography>)}
    </Container>);
};

export default Documents;
