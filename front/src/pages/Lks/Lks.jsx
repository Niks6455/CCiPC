import RightMenuLk from "../../modules/RightMenuLk/RightMenuLk";
import Layout from "../../ui/Layout/Layout";
import styles from "./Lks.module.scss";
import Footer from "../../components/Footer/Footer";
import LeftMenuLk from "../../modules/LeftMenuLK/LeftMenuLK";
import { useContext } from "react";
import DataContext from "../../context";
import { Outlet } from "react-router-dom";
function Lks() {
  const context = useContext(DataContext);
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
