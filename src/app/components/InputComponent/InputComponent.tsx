import React, { FC } from "react";
import TextField from "@mui/material/TextField";
import styles from "./InputComponent.module.scss";

interface InputComponentProps {
  label:string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  helperText?: string;
  type?: string;
  placeholder?: string;
  InputProps?: Record<string, any>;
  style?: string;
}

const InputComponent: FC<InputComponentProps> = (
  props: InputComponentProps
) => {
  const {
    label,
    value,
    onChange,
    multiline = false,
    helperText,
    type,
    placeholder,
    InputProps,
    style = "",
  } = props;
  return (
    <div>
      {multiline ? (
        <TextField
          label={label}
          variant="outlined"
          value={value}
          multiline
          rows={3}
          type={type}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => onChange(e.target.value)}
          className={`${styles.multilineInputStyle} ${style}`}
          helperText={helperText}
        />
      ) : (
        <TextField
          label={label}
          variant="outlined"
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={`${styles.inputStyle} ${style}`}
          helperText={helperText}
          InputProps={InputProps}
        />
      )}
    </div>
  );
};

export default InputComponent;
