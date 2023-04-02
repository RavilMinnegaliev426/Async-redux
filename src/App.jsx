import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addTodo, fetchTodos } from "./store/todoSlice";

import TodoList from "./components/todoList";
import InputFiled from "./components/inputFiled";

import "./App.css";

function App() {
  const [text, setText] = useState("");
  const { status, error } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(addTodo({ text }));
    setText("");
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="App">
      <InputFiled text={text} handelInput={setText} handelSubmit={addTask} />
      {status === "loading" && <h2>Loading...</h2>}
      {error && <h2>An error occгed:{error}</h2>}
      <TodoList />
    </div>
  );
}

export default App;
