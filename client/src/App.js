import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Authenticate/Auth';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import File from './components/Files/File';

function App() {
 

  return (
    <>

      <Navbar />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='auth' element={<Login />} />
        <Route path='files' element={<File />} />

      </Routes>
    </>
  );
}

export default App;
