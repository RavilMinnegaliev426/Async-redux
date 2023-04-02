import { useDispatch } from "react-redux";
import { deleteTodo, toggelTodoComlite } from "../store/todoSlice";
const Todoitem = ({ id, title, completed }) => {
  const dispatch = useDispatch();
  return (
    <li>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch(toggelTodoComlite({ id }))}
      />
      <span>{title}</span>
      <span className="deleted" onClick={() => dispatch(deleteTodo(id))}>
        &times;
      </span>
    </li>
  );
};

export default Todoitem;
