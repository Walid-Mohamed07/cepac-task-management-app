import type { ReactNode } from "react";
import "./Button.css";
import Loader from "../Loader";

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  classN?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  isLoading,
  disabled,
  classN,
  type = "submit",
  children,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`${classN} ${isLoading ? "cursor-default" : ""} ${
        disabled || isLoading ? "!bg-gray-300 !hover:bg-gray-300" : ""
      } duration-300`}
      onClick={() => !isLoading && onClick?.()}
    >
      {isLoading ? <Loader isLoading /> : children}
    </button>
  );
};
export default Button;
