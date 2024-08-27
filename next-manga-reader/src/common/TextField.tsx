import type React from "react";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill } from "react-icons/bs";
import { GoEye, GoEyeClosed } from "react-icons/go";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  register?: UseFormRegister<any>;
  disabled?: boolean;
  noBorder?: boolean;
  icon?: React.ReactNode;
  textColor?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  type,
  error,
  icon,
  disabled = false,
  noBorder = false,
  textColor = "text-gray-700",
  placeholder,
  register,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <div
        className={`${noBorder ? "border-0" : "border-b-2"} relative flex items-center bg-transparent ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <input
          id="`input-${placeholder}`"
          placeholder={placeholder}
          className={`w-full font-sans bg-transparent ${textColor} placeholder-gray-400 rounded-md focus:outline-none ${isPassword ? "pl-3 pr-7" : "px-3"
            } 
          }`}
          type={showPassword ? "text" : type}
          disabled={disabled}
          autoComplete="off"
          {...(register && register(name))}
        />
        {icon ? <div>{icon}</div> : (isPassword) && (
          <div
            className="absolute right-0 pr-1 cursor-pointer"
            onClick={(prev) => setShowPassword(!showPassword)}
          >
            {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-[10px] font-semibold">{error}</span>
      )}
    </div>
  );
};

export default TextField;
