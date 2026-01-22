// App.js
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import AppScreen from '../App.jsx'
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/"
                        element={<AppScreen/>} 
                    />
                </Routes>
            </div>
        </Router>
    );
};
export default App;