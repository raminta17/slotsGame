import './App.css';
import Nav from "./components/Nav";
import {Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SlotsPage from "./pages/SlotsPage";

function App() {
  return (
    <div >
     <Nav/>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/slots" element={<SlotsPage/>}/>
        </Routes>
    </div>
  );
}

export default App;
