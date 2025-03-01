import styles from "./Button.module.scss";

function Button(props) {
  return (
    <div className={styles.ButtonCont}>
      <button onClick={props?.funClick}>{props?.text}</button>
    </div>
  );
}

export default Button;
