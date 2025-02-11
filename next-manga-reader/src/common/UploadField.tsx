'use client';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import TextField from '@/common/TextField';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Button from './Button';
import { useState, useEffect } from 'react';

export interface UploadFieldProps {
  title: string;
  multiple?: boolean;
  preview?: boolean;
  accept?:
    | 'audio/*'
    | 'image/*'
    | 'video/*'
    | '.jpg, .png, .jpeg'
    | '.jpg'
    | '.png'
    | '.jpeg'
    | '.jpg, .png'
    | '.png, .jpeg'
    | '.jpg, .jpeg';
}

const FilePreview: React.FC<{ file: File }> = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return previewUrl ? (
    <div className="flex w-full rounded-sm px-2 py-1 gap-2 hover:bg-slate-100">
      <img src={previewUrl} alt={file.name} className="w-16 h-16 object-cover" />
      <span className="text-sm text-ellipsis overflow-hidden text-wrap">{file.name}</span>
    </div>
  ) : (
    <span>Loading...</span>
  );
};

const UploadField: React.FC<UploadFieldProps> = ({
  title,
  multiple,
  preview,
  accept = '.jpg, .png, .jpeg'
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div>
      <label
        htmlFor="filesInput"
        className="flex flex-col items-center border-blue-700 border-dashed border-2 p-2 gap-2 rounded-xl cursor-pointer ">
        <span>{title}</span>
      </label>

      {files.length > 0 && preview && (
        <div>
          <Separator className="my-2" />
          <div className="max-h-56 overflow-auto">
            {files.map((file, index) => (
              <div className="my-1" key={index}>
                <FilePreview file={file} />
              </div>
            ))}
          </div>
        </div>
      )}
      <input
        id="filesInput"
        className="hidden"
        onChange={handleFiles}
        type="file"
        multiple={multiple}
        accept={accept}
      />
    </div>
  );
};

export default UploadField;
