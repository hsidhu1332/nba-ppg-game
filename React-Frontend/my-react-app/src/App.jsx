import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './Homepage.jsx'
import Game from './Game.jsx'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/game/:listType" element={<Game/>}/>
            </Routes>
        </Router>
    );
}

export default App;