'use client';

import TextField, { TextFieldProps } from '@/common/TextField';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import Chip from './Chip';

export interface SelectFieldProps extends TextFieldProps {
  items: string[];
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  noBorder?: boolean;
}

const FieldItem = ({
  str,
  handleSelectedItem,
  dark = false
}: {
  str: string;
  dark?: boolean;
  handleSelectedItem: (str: string) => void;
}) => {
  return (
    <div
      className="w-full h-full text-center text-ellipsis text-nowrap overflow-hidden px-2 py-0.5 cursor-pointer bg-white hover:brightness-90"
      onClick={() => handleSelectedItem(str)}>
      <span className="">{str}</span>
    </div>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({
  placeholder,
  items,
  name,
  register,
  setValue,
  getValues,
  noBorder,
  ...otherProps
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [availableItems, setAvailableItems] = useState<string[]>(items);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const toggleIsShowing = () => setIsShowing(!isShowing);

  const handleSelectedItem = (item: string) => {
    if(item === '') return;
    setValue(name, item);
    setSelectedItems((prev) => [...prev, item]);
    setAvailableItems((prev) => prev.filter((i) => i !== item));

    setIsShowing(false);
  };

  const handleOnClose = (item: string) => {
    setAvailableItems((prev => [...prev, item].sort()))
  }

  return (
    <div className="flex flex-col relative items-center px-2 gap-2 rounded-xl ">
      <div className="flex flex-row items-center">
        <div onClick={toggleIsShowing}>
          <TextField
            name={name}
            icon={isShowing ? <FaChevronDown color={'#fff'} /> : <FaChevronUp color={'#fff'} />}
            placeholder={placeholder}
            type="text"
            textColor="text-gray-200"
            noBorder={noBorder}
            register={register}
            {...otherProps}
          />
        </div>
        {getValues(name) !== '' && (
          <div className="cursor-pointer" onClick={() => handleSelectedItem('')}>
            <Cross1Icon />
          </div>
        )}
      </div>
      <div className="flex flex-wrap w-full gap-1">
        {selectedItems.map((item, index) => (
          <Chip key={index} text={item} closeable outline onClose={() => handleOnClose(item)} />
        ))}
      </div>
      {isShowing ? (
        <div className="absolute top-7 flex flex-col items-center w-full px-2 rounded-xl">
          {availableItems.map((item, index) => (
            <FieldItem key={index} str={item} handleSelectedItem={handleSelectedItem} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SelectField;
