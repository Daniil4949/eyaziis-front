import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Alert, Typography } from '@mui/material';
import axios from '../../api/axios';

const CreateDocumentForm = (props) => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    const handleCreateDocument = async (e) => {
        e.preventDefault();
        setCreating(true);
        setCreateError(null);

        try {
            const response = await axios.post('/v1/text-documents/create-document', {
                name,
                text,
            });

            // Очищаем поля формы
            setName('');
            setText('');

            // Вызываем callback для обновления списка документов в родительском компоненте
            if (props.onDocumentCreated) {
                props.onDocumentCreated(response.data);
            }
        } catch (err) {
            setCreateError('Error creating document');
            console.error(err);  // Логируем ошибку для отладки
        } finally {
            setCreating(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Create New Document</Typography>
            <form onSubmit={handleCreateDocument}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Document Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Document Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" disabled={creating}>
                            {creating ? 'Creating...' : 'Create Document'}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {createError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {createError}
                </Alert>
            )}
        </Container>
    );
};

export default CreateDocumentForm;
