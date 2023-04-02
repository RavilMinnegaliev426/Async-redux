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

      if (!responce.ok) {
        throw new Error("Can`t deleted task. Server error");
      }

      dispatch(removeTodo({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggelStatus = createAsyncThunk(
  "todos/toggelStatus",
  async function (id, { rejectWithValue, dispatch, getState }) {
    const todo = getState().todos.todos.find((todo) => todo.id === id);

    try {
      const responce = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        }
      );

      if (!responce.ok) {
        throw new Error("Can`t toggel Status. Server error");
      }

      dispatch(toggelTodoComlite({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async function (text, { rejectWithValue, dispatch }) {
    try {
      const todo = {
        title: text,
        userId: 1,
        completed: false,
      };

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      );

      if (!response.ok) {
        throw new Error("Can`t add task. Server error.");
      }

      const data = await response.json();
      dispatch(addTodo(data));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload;
};

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    toggelTodoComlite(state, action) {
      const toggelTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggelTodo.completed = !toggelTodo.completed;
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
    [fetchTodos.rejected]: setError,
    [deleteTodo.rejected]: setError,
    [toggelStatus.rejected]: setError,
  },
});

const { addTodo, removeTodo, toggelTodoComlite } = todoSlice.actions;

export default todoSlice.reducer;
