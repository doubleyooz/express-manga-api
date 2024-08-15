import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handleClick?: () => any;
  type: "button" | "submit" | "reset" | undefined;
  text: string;
  uppercase?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  handleClick = () => {},
  text,
  type,
  uppercase,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={() => handleClick()}
      className={`mt-10 font-bold transition duration-300 ease-in-out ${
        uppercase && "uppercase"
      } ${disabled && "text-dark-300"}`}
      aria-label={text}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
