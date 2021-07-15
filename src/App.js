
import './App.css';
import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask'
import {useState, useEffect} from 'react'
import Task from './components/Task';

function App() {
  const [showAddTask, setShowAddTask]=useState(true)
  const [tasks, setTasks]= useState([])


  // get tasks from server GET method
  useEffect(()=>{
      const getTasks = async () =>{
        const tasksFromServer = await fetchTasks()
        setTasks(tasksFromServer)
      }
      getTasks()
  }, [])

  //Fetch Tasks

  const fetchTasks = async () => {
    const res = await fetch ('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

//Add Task from server POST method

const addTask = async (task) =>{
  const res = await fetch('http://localhost:5000/tasks', 
{
  method:'POST',
  headers: {
    'Content-type': 'application/json'
  },
  body: JSON.stringify(task)

})
const data = await res.json()

setTasks([...tasks, data])

}

// Fetch TASK singular
//UPDATE toggle reminder

const fetchTask = async (id) => {
  const res = await fetch (`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

/*const addTask =(task) =>{

  const id= Math.floor(Math.random() * 10000) + 1

  const newTask={id, ...task}
  setTasks([...tasks, newTask])
}*/

//Delete Task from server DELETE method
const deleteTask = async(id) => {

  await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
  setTasks(tasks.filter((task)=>task.id !== id))
}

// Toggle Reminder
const toggleReminder =  async (id) => {
  const taskToToggle = await fetchTask(id)
  const updTask={...Task, reminder : !taskToToggle.reminder}

  const res= await fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
      
    },
    body: JSON.stringify(updTask)
  })

  const data = await res.json()
  


  setTasks(
    tasks.map((task) =>
    task.id === id ? {...task, reminder: 
    data.reminder} : task
    )
  )
}
  return (
    <div className="App">
      <Header 
        onAdd={()=> setShowAddTask(!showAddTask)}
        showAdd={showAddTask} 
      />
        {showAddTask && <AddTask 
        onAdd={addTask}
      />}
        {tasks.length > 0 ? <Tasks tasks={tasks}
        onDelete={deleteTask} onToggle={toggleReminder} 
      /> : (
        'No Tasks to Show'
      )}
    </div>
  );
}

export default App;
