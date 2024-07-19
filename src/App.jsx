import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ChatsPage from './pages/ChatsPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatsPage/>}/>
                <Route path="/chat/:chatId" element={<ChatsPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
