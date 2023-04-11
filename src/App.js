import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useState,useEffect } from "react";

function App() {
  const [user,setUser]=useState(null)
  useEffect(()=>{
    const str=JSON.parse(localStorage.getItem('user'))
    setUser(str)
  })
  return (
    <Router>
      <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/' element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
