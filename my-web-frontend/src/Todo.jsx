import { useState } from "react";
import {handledelete} from "./my-app-frontend/src/UserForm.";

  function Todo(){
      const [task, setTask] = useState("");
      const[completed, setcompleted] = useState("");
      const[pending, setpending] = useState("");
      const[date, setdate] = useState("");
    
      const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.user_id !== userId));
  };

      }
      
      const todoapp = async () =>{
        
        try
        {
            const response = await fetch(
                "http://localhost:8000/api/save-to-do",
                 {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tasks: task,
            completed:completed, 
            pending:pending,
            date: date

        }),
    }
);

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        
        alert("Todo Added successfully");

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
            return (
                <div className="Todo  ">
                <input type="text"
                placeholder="tasks"
                value= {task}
                onChange={(e) => setTask(e.target.value)}
                 />
                 <button onClick={todoapp}>
                    Save Todo
                 </button>
                   
                <input type="text"
                placeholder="completed"
                value= {completed}
                onChange={(e) => setcompleted(e.target.value)}
                 />
                
                   
                <input type="text"
                placeholder="pending"
                value= {pending}
                onChange={(e) => setpending(e.target.value)}
                
                 />
              
                   
                <input type="text"
                placeholder="date"
                value= {date}
                onChange={(e) => setdate(e.target.value)}
                 />
                   <button type="button" onClick={() => deleteTodo(deleteTodo.tasks)}>
                  Delete
                </button>
                 </div>
            );
        
        }

export default Todo;