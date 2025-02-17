import RightMenuLk from "../../modules/RightMenuLk/RightMenuLk";
import Layout from "../../ui/Layout/Layout";
import styles from "./Lks.module.scss";
import Footer from "../../components/Footer/Footer";
import LeftMenuLk from "../../modules/LeftMenuLK/LeftMenuLK";
import { useContext, useEffect } from "react";
import DataContext from "../../context";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Lks() {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const autorisation =
    useSelector((state) => state.user.status) === "succeeded";

  return (
    <>
      <main className={styles.Lks}>
        <LeftMenuLk />
        <div className={styles.LksContainer}>
          <Outlet />
        </div>
        <RightMenuLk />
      </main>
      <Footer />
    </>
  );
}

export default Lks;
