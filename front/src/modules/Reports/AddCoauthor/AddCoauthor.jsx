import { useState } from "react";
import styles from "./AddCoauthor.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import leftArrow from "./../../../assets/img/UI/leftArrow.svg";

function AddCoauthor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportCreateSlice);

  return (
    <div className={styles.AddCoauthor}>
      <h2 className={styles.title}>Соавторы</h2>
      <div className={styles.backImg}>
        <img src={leftArrow} alt="назад" draggable="false" />
      </div>
      <div className={styles.slider}>
        <div
          className={styles.sliderInner}
          style={{
            width: `${report.sliderState}%`,
            transition: "all 0.15s linear",
          }}
        ></div>
      </div>
    </div>
  );
}

export default AddCoauthor;
