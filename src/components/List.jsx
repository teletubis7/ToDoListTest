import React, { useState, useEffect } from 'react';
import '../App.css';

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [errorMessage, setErrorMessage] = useState("");

  //wczytanie zadań
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Błąd podczas parsowania:", error);
        setTasks([]);
      }
    }
  }, []);

  //zapis nowego zadania
  const handleSave = (event) => {
    event.preventDefault();
    const taskInput = document.getElementById("task").value.trim();

    //walidacja
    if (taskInput === "") {
      setErrorMessage("Proszę wpisać zadanie");
      return;
    }
    const taskExists = tasks.some(task => task.text.toLowerCase() === taskInput.toLowerCase());
    if (taskExists) {
      setErrorMessage("To zadanie już istnieje");
      return;
    }

    //nowe zadanie
    const newTasks = [...tasks, { text: taskInput, wykonane: false }];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));

    document.getElementById("task").value = "";
    setErrorMessage("");
  };

  //stan zadania
  const stanZadania = (index) => {
    const updatedTasks = tasks.map((task, taskIndex) => {
      if (taskIndex === index) {
        return { ...task, wykonane: !task.wykonane };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  //usuwanie
  const usuwanieZadania = (index) => {
    const updatedTasks = tasks.filter((task, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  //filtrowanie
  const filteredTasks = tasks.filter(task => {
    if (filter === 'wykonane') {
      return task.wykonane;
    }
    if (filter === 'incomplete') {
      return !task.wykonane;
    }
    return true;
  });

  return (
    <div>
      <h1>ToDo List</h1>
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <form onSubmit={handleSave}>
        <input type="text" id="task" /><br />
        <button>Dodaj zadanie</button>
      </form>

      <div>
        <button
          className={`button_1 ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Wszystkie zadania
        </button>
        <button
          className={`button_1 ${filter === 'wykonane' ? 'active' : ''}`}
          onClick={() => setFilter('wykonane')}
        >
          Zadania wykonane
        </button>
        <button
          className={`button_1 ${filter === 'incomplete' ? 'active' : ''}`}
          onClick={() => setFilter('incomplete')}
        >
          Zadania niewykonane
        </button>
      </div>

      <ol>
        {filteredTasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.wykonane ? "line-through" : "none" }}>
            {task.text}
            <input
              type="checkbox"
              checked={task.wykonane}
              onChange={() => stanZadania(index)}
            />
            <button className='button_delete' onClick={() => usuwanieZadania(index)}>Usuń</button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default List;