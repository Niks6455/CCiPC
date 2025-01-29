import { setValue } from "../../store/reportCreateSlice/reportCreateSlice";
import styles from "./ListInput.module.scss";
import { useDispatch } from "react-redux";

function ListInput(props) {
  console.log("props", props);
  const dispatch = useDispatch();

  const funClickLi = (text) => {
    dispatch(setValue({ key: props.name, value: text }));
    props.setListOpen(false);
  };

  return (
    <div className={styles.ListInput}>
      <ul>
        {props.list.map((el, index) => (
          <li
            className={props.value === el.text ? styles.active : ""}
            key={index}
            onClick={() => funClickLi(el.text)}
          >
            {el.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListInput;
