import './theme.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from './pages/login';
import SignupPage from './pages/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1 className="text-3xl font-bold underline">Hello world!</h1>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
        
      </Routes>
      <footer className="bg-gray-800 text-white p-4">
        <p className="text-center">Footer Content</p>
      </footer>
      
    
    </Router>
  );
}

export default App;
