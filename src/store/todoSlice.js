import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos", //название события
  async function (_, { rejectWithValue }) {
    try {
      const responce = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      if (!responce.ok) {
        throw new Error("Server Error!");
      }
      const data = await responce.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const responce = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "delete",
        }
      );
      console.log(responce);
      if (!responce.ok) {
        throw new Error("Can`t deleted task. Server error");
      }

      dispatch(removeTodo({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push({
        id: new Date().toISOString(),
        text: action.payload.text,
        complited: false,
      });
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    toggelTodoComlite(state, action) {
      const toggelTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggelTodo.complited = !toggelTodo.complited;
    },
  },
  extraReducers: {
    // загрузка
    [fetchTodos.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },
    // успешно полученные данные
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.todos = action.payload;
    },
    // Неполадка
    [fetchTodos.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.payload;
    },
  },
});

export const { addTodo, removeTodo, toggelTodoComlite } = todoSlice.actions;

export default todoSlice.reducer;
