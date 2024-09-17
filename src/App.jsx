import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Menu from './components/menu';
import WeightCoefficient from "./components/weight-coefficient/WeightCoefficient";
import Documents from "./components/documents";
import {Container} from '@mui/material';
import LogicalSearch from "./components/logical-search";
import CreateDocumentForm from "./components/documents/CreateDocumentForm";

function App() {
    return (
        <div>
            <Menu/> {/* Добавляем меню */}
            <Container sx={{marginTop: 2}}>
                <Routes>
                    <Route path="/create-document" element={<CreateDocumentForm/>}/>
                    <Route path="/" element={<Documents/>}/>
                    <Route path="/weight-coefficients" element={<WeightCoefficient/>}/>
                    <Route path="/logical-search" element={<LogicalSearch/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;