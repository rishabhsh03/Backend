import { useState, useEffect } from "react";

function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completed, setcompleted] = useState("");
  const [pending, setpending] = useState("");
  const [editId, seteditId] = useState(null);
  const [refresh,setRefresh] = useState(false);
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get-to-do");
        const result = await response.json();
        setTasks(result.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodo();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
 if(editId){
       await fetch(`http://localhost:8000/api/update-to-do/${editId}`,{
        method: "PUT",
        headers: {
          "Content-Type":"application/json",

        },
        body: JSON.stringify({
          tasks: task,
          completed:completed,
          pending:pending,
        })
      });
     seteditId(null);
     setRefresh(!refresh);
     setTask("");
     setcompleted("");
     setpending("");
    }else{
      await fetch("http://localhost:8000/api/save-to-do", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           tasks: task, 
           completed: completed,
           pending: pending,
           
        }),
      });
      setRefresh(!refresh);
    }
    }catch(error){
      console.error(error);
    }
  };
  const handleDelete = async (todo_id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/delete-to-do/${todo_id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log(result);
      console.log(result.data);
      if (result.success) {
        setTasks(prev => prev.filter(item => item.todo_id !== todo_id));
      }
    } catch (error) {
      console.error(error);
    }
  };
    
  return (
    <>
      
        <input
          type="text"
          name="task"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          name="Completed"
          placeholder="completed"
          value={completed}
          onChange={(e) => setcompleted(e.target.value)}
        />
        <input
          type="text"
          name="pending"
          placeholder="pending"
          value={pending}
          onChange={(e) => setpending(e.target.value)}
          
        />
          <button onClick={handleSubmit}>
            {editId ? "Update Todo" : "Save Todo"}
            Save Todo 
            </button>
      
        
      <table border="1">
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            <th>Pending</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item) => (
            <tr key={item.todo_id}>
              <td>{item.tasks}</td>
              <td>{item.completed}</td>
              <td>{item.pending}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleDelete(item.todo_id)}>
                  Delete
                </button>
                <button onClick={() => {
                  seteditId(item.todo_id);
                  setTask(item.tasks);
                  setcompleted(item.completed);
                  setpending(item.pending);
                }}
                >
                  Edit Todo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Todo;
