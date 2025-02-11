import { Cross1Icon } from '@radix-ui/react-icons';
import type React from 'react';
import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill } from 'react-icons/bs';
import { GoEye, GoEyeClosed } from 'react-icons/go';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  register?: UseFormRegister<any>;
  disabled?: boolean;
  noBorder?: boolean;
  multiline?: boolean;
  minWidth?: boolean;
  onlyNumbers?: boolean;
  clearable?: boolean;
  icon?: React.ReactNode;
  iconAction?: () => void;

  textColor?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  type,
  error,
  icon,
  minWidth = false,
  disabled = false,
  noBorder = false,
  multiline = false,
  onlyNumbers = false,
  textColor = 'text-gray-700',
  placeholder,
  register,
  iconAction = () => {},
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
  };

  return (
    <div>
      <div
        className={`${
          noBorder ? 'border-0' : 'border-b-2'
        } relative flex items-center bg-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${minWidth ? 'w-fit' : 'w-full'}`}>
        {multiline && type === 'text' ? (
          <textarea
            id={`input-${placeholder}`}
            placeholder={placeholder}
            className={`font-sans bg-transparent ${textColor} placeholder-gray-400 rounded-md focus:outline-none ${
              isPassword ? 'pl-3 pr-7' : 'px-3'
            }   ${minWidth ? 'w-fit' : 'w-full'}
          }`}
            rows={4}
            disabled={disabled}
            onInput={onlyNumbers ? handleInput : undefined}
            autoComplete="off"
            {...(register && register(name))}
            {...(otherProps as React.InputHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={`input-${placeholder}`}
            placeholder={placeholder}
            className={`font-sans bg-transparent ${textColor} placeholder-gray-400 rounded-md focus:outline-none ${
              isPassword ? 'pl-3 pr-7' : type === 'number' ? 'px-1' : 'px-3'
            } ${minWidth ? 'w-fit' : 'w-full'}
          }`}
            type={showPassword ? 'text' : type}
            disabled={disabled}
            onInput={onlyNumbers ? handleInput : undefined}
            autoComplete="off"
            {...(register && register(name))}
            {...otherProps}
          />
        )}
   

        {icon ? (
          <div onClick={iconAction}>{icon}</div>
        ) : (
          isPassword && (
            <div
              className="absolute right-0 pr-1 cursor-pointer"
              onClick={(prev) => setShowPassword(!showPassword)}>
              {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
            </div>
          )
        )}
      </div>
      {error && <span className="text-red-500 text-[10px] font-semibold">{error}</span>}
    </div>
  );
};

export default TextField;
