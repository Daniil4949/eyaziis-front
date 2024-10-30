import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import MachineTranslator from "./components/machine-translator";

function App() {
    return (
        <div>
            <Container sx={{ marginTop: 2 }}>
                <Routes>
                    <Route path="/" element={<MachineTranslator />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
