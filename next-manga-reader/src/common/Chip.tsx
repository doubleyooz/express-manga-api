import type React from 'react';
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';

interface ChipProps {
  onClick?: () => any;
  onClose?: () => any;
  text: string;
  uppercase?: boolean;
  outline?: boolean;
  closeable?: boolean;
 
}

const Chip: React.FC<ChipProps> = ({
  onClick,
  onClose,
  text,
  uppercase = false,
  closeable = false,
  outline = false
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    setIsHidden(true);
  };


  return (
    <div
      onClick={handleClick}
      className={`flex flex-row items-center px-1 py-1 gap-0.5 min-w-fit max-w-28 rounded-md relative transition duration-300 ease-in-out ${
        uppercase && 'uppercase'
      } ${onClick && 'cursor-pointer'} ${outline && 'border'}  ${isHidden && 'hidden'}`}>
      <span className="text-sm text-ellipsis max-w-28 text-nowrap overflow-hidden">{text}</span>
      {closeable && <IoIosClose className="cursor-pointer rounded-full  hover:bg-slate-300" onClick={handleOnClose} />}
    </div>
  );
};

export default Chip;
