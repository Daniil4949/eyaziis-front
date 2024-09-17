// src/components/LogicalSearch.jsx
import React, {useEffect, useState} from 'react';
import axios from '../../api/axios'; // Путь к вашему axios инстансу
import {Button, Card, CardContent, Container, TextField, Typography} from '@mui/material';

const LogicalSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleHint = async () => {
        try {
            const response = await axios.get('/v1/open-ai/', {
                params: {text: "Formulate a hint for creating a query in one sentence."}
            });
            setHint(response.data);
        } catch (err) {
            setError('Error fetching results');
            console.error(err); // Логируем ошибку для отладки
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleHint();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/v1/logical-search/', {
                params: {expression: query}
            });
            setResults(response.data);
        } catch (err) {
            setError('Error fetching results');
            console.error(err); // Логируем ошибку для отладки
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Logical Search
            </Typography>
            <Card style={{marginBottom: 20}}>
                <CardContent>
                    <Typography variant="body2" color="textSecondary">
                        {hint}
                    </Typography>
                </CardContent>
            </Card>
            <TextField
                label="Search Query"
                variant="outlined"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
            >
                {loading ? 'Searching...' : 'Search'}
            </Button>

            {error && <Typography color="error">{error}</Typography>}

            {results.length > 0 && (
                <div style={{marginTop: 20}}>
                    {results.map((doc) => (
                        <Card key={doc._id} style={{marginBottom: 20}}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {doc.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {doc.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default LogicalSearch;
