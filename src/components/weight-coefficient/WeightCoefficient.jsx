import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import axios from '../../api/axios';

const WeightCoefficient = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('/v1/calculate-weight-coefficient/');
            setData(response.data);
        } catch (err) {
            setError('Error fetching document scores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Document Scores
            </Typography>
            <Grid container spacing={2}>
                {Object.entries(data).map(([docName, termScores]) => (
                    <Grid item xs={12} key={docName}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {docName}
                                </Typography>
                                <List>
                                    {Object.entries(termScores).map(([term, score]) => (
                                        <ListItem key={term}>
                                            <ListItemText
                                                primary={term}
                                                secondary={`Score: ${score.toFixed(4)}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default WeightCoefficient;
