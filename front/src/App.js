import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Register from './Components/Register';
import MaterijalPage from './Components/MaterialPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />  
          <Route path="/register" element={<Register />} />
            <Route path="/video" element={<MaterijalPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
