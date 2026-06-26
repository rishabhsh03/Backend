import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./Todo";
import UserForm from "./UserForm";

function App(){
  return(
    <BrowserRouter>
    <div className="container">
      <div className="card">
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/UserForm" element={<UserForm/>}/>
          <Route path="/Todo" element={<Todo/>}/>
          </Routes>
      </div>  
    </div>
    </BrowserRouter>
  )
}

export default App;