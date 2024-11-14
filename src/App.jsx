import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import SpeechSynthesis from "./components/speech-synthesis";

function App() {
    return (
        <div>
            <Container sx={{ marginTop: 2 }}>
                <Routes>
                    <Route path="/" element={<SpeechSynthesis />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
