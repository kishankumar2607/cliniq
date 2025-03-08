import React, { FC } from "react";
import styles from "./TitleComponent.module.scss";

interface TitleComponentProps {
  title: string;
  textAlign?: React.CSSProperties["textAlign"];
  textColor?: string;
  fontSize?: string | number;
}

const TitleComponent: FC<TitleComponentProps> = ({
  title,
  textAlign = "left",
  textColor = "inherit",
  fontSize = "inherit",
}) => {
  return (
    <h1
      className={styles.mainTitle}
      style={{
        textAlign: textAlign,
        color: textColor,
        fontSize: fontSize,
      }}
    >
      {title}
    </h1>
  );
};

export default TitleComponent;
