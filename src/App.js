import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './styles.css'
const socket = io('http://localhost:4000'); // Update with your server URL

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('taskCreated', (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('taskDeleted', (deletedTask) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTask._id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (taskTitle.trim() !== '') {
      const newTask = {
        title: taskTitle,
       
      };

      try {
        await axios.post('http://localhost:4000/tasks', newTask);
        setTaskTitle('');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    console.log("clicked")
    const updatedTask = {
      status: true,
    };

    try {
      await axios.put(`http://localhost:4000/tasks/${taskId}`,{status:true});
      socket.emit('taskUpdated', { ...updatedTask, _id: taskId });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    console.log("clicked")
    try {
      await axios.delete(`http://localhost:4000/tasks/${taskId}`);
      console.log("clicked")
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const completedTask=()=>{
    console.log("gdsfhgdsfhgddhdjhgdh............")
  }

  return (
    <div className="container">
      <h1>Real-time Task Manager</h1>
      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul id="taskList">
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}
            <div>
              <button
                className={task.status === 'pending' ? 'btn-in-progress' : ''}
                onClick={() =>{
                  
                  updateTaskStatus(task._id, true);
                  
                }
                
                }
              >
                {task.status === false ? "Pending" : 'Complete'}
              </button>
              <button className="btn-delete" onClick={() => deleteTask(task._id)}>
                Delete
              </button>

              <button onClick={()=>{ completedTask()}}>Is task Completed</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;















// import React, { useEffect, useState } from 'react';
// import socketIOClient from 'socket.io-client';
// import axios from 'axios';

// const ENDPOINT = 'http://localhost:4000'; // Update with your server endpoint

// const App = () => {
//   const [tasks, setTasks] = useState([]);
//   const [taskTitle, setTaskTitle] = useState('');

//   useEffect(() => {
//     const socket = socketIOClient(ENDPOINT);

//     socket.on('connect', () => {
//       console.log('Connected to the server');
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from the server');
//     });

//     socket.on('taskCreated', (task) => {
//       setTasks((prevTasks) => [...prevTasks, task]);
//     });

//     socket.on('taskUpdated', (updatedTask) => {
//       setTasks((prevTasks) =>
//         prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
//       );
//     });

//     socket.on('taskDeleted', (deletedTask) => {
//       setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTask._id));
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${ENDPOINT}/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (taskTitle.trim() !== '') {
//       const newTask = {
//         title: taskTitle,
//         status: 'pending',
//       };

//       try {
//         const response = await axios.post(`${ENDPOINT}/tasks`, newTask);
//         console.log(response)
//         setTaskTitle('');
//       } catch (error) {
//         console.error('Error creating task:', error);
//       }
//     }
//   };

//   const updateTaskStatus = async (taskId, newStatus) => {
//     const updatedTask = {
//       status: newStatus,
//     };

//     try {
//       await axios.put(`${ENDPOINT}/tasks/${taskId}`, updatedTask);
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   const deleteTask = async (taskId) => {
//     try {
//       await axios.delete(`${ENDPOINT}/tasks/${taskId}`);
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Real-time Task Manager</h1>
//       <form onSubmit={createTask}>
//         <input
//           type="text"
//           placeholder="Enter task title"
//           value={taskTitle}
//           onChange={(e) => setTaskTitle(e.target.value)}
//           required
//         />
//         <button type="submit">Add Task</button>
//       </form>
//       <ul id="taskList">
//         {tasks.map((task) => (
//           <li key={task._id}>
//             {task.title}
//             <div>
//               <button
//                 className={task.status === 'pending' ? 'btn-in-progress' : ''}
//                 onClick={() =>
//                   updateTaskStatus(task._id, task.status === 'pending' ? 'in progress' : 'pending')
//                 }
//               > 
//                 {task.status === 'pending' ? 'Start' : 'Complete'}
//               </button>
//               <button className="btn-delete" onClick={() => deleteTask(task._id)}>
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default App;
