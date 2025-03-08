import React, { FC } from "react";
import styles from "./ButtonComponent.module.scss";
import { RotatingLines } from "react-loader-spinner";

interface LinearButtonComponentProps {
  onClick: () => void;
  title: string;
  isLoading: boolean;
}

const ButtonComponent: FC<LinearButtonComponentProps> = ({
  onClick,
  title,
  isLoading,
}) => {
  return (
    <button onClick={onClick} className={styles.buttonMainDiv}>
      {isLoading ? (
        <div className={styles.loaderDivStyle}>
          <p>Loading</p>
          <RotatingLines
            strokeColor="#ffffff"
            strokeWidth="5"
            animationDuration="0.75"
            width="30"
            visible={true}
          />
        </div>
      ) : (
        title
      )}
    </button>
  );
};

export default ButtonComponent;
