'use client';

import NextLink from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import TextField from '@/common/TextField';
import { LoginFormProps, newTitleSchema, TitleFormProps } from '@/common/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import Button from '@/common/Button';
import { useState } from 'react';
import UploadField from '@/common/UploadField';
import createTitle from '../actions/create-title';
import SelectField from '@/common/SelectField';

export default function NewTitle() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid }
  } = useForm<TitleFormProps>({
    resolver: zodResolver(newTitleSchema)
  });

  const onSubmit = async (data: TitleFormProps) => {
    setLoading(true);
    console.log(data);

    const result = await createTitle(data);
    //await signIn(data.email, data.password);
    console.log({ result });
    //nav("/");
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xs px-10 py-20 rounded-[36px] bg-white shadow-lg">
      <div className="flex flex-col gap-2">
        <TextField
          name="title"
          type="text"
          placeholder="Title"
          error={errors['title']?.message}
          register={register}
        />

        <TextField
          name="synopsis"
          type="text"
          placeholder="Synopsis"
          error={errors['synopsis']?.message}
          register={register}
          multiline
        />

        <TextField
          name="nChapters"
          type="number"
          placeholder="Number of chapters"
          error={errors['nChapters']?.message}
          register={register}
          minWidth
          min="0"
          inputMode="numeric"
          onlyNumbers
        />
        <SelectField
          placeholder="Genres"
          items={[
            'Action',
            'Adventure',
            'Comedy',
            'Drama',
            'Fantasy',
            'Horror',
            'Mystery',
            'Romance',
            'Sci-Fi',
            'Slice of Life',
            'Thriller'
          ]}
          name='genres'
          
          error={errors['genres']?.message}
          register={register}
          setValue={setValue}
          getValues={getValues}
        />
        <div className="flex gap-2">
          <Checkbox />
          <Label>Nsfw</Label>
        </div>
        <UploadField title="Cover" multiple preview />

        <div className="flex flex-col w-full justify-center gap-8 mt-9">
          <Button type="submit" text="Submit" variant="primary" loading={loading} rounded />
        </div>
        <span>{isValid ? 'true' : 'false'}</span>
        <div className="mt-4">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Error(s) occurred:</span>
              <ul>
                {Object.keys(errors).map((key, index) => (
                  <li key={index}>{errors[key].message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
