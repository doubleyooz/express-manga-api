import type React from "react";
import { UseFormRegister } from "react-hook-form";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  register?: UseFormRegister<any>;
  disabled?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  type,
  error,
  disabled = false,
  register,
}) => {
  return (
    <div>
      <input
        id="`input-${placeholder}`"
        placeholder="placeholder"
        className="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
        type={type}
        disabled={disabled}
        autoComplete="off"
        {...(register && register(name))}
      />

      {error && (
        <span className="text-red-500 text-sm font-semibold">{error}</span>
      )}
    </div>
  );
};

export default TextField;
