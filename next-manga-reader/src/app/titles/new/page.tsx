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

export default function NewTitle() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<TitleFormProps>({
    resolver: zodResolver(newTitleSchema)
  });

  const onSubmit = async (data: TitleFormProps) => {
    setLoading(true);
    console.log(data);

    //await signIn(data.email, data.password);

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
          name="Number of chapters"
          type="number"
          placeholder="Number of chapters"
          error={errors['nChapters']?.message}
          register={register}
          minWidth
          min="0"
          inputMode="numeric"
          onlyNumbers
        />
        <div className="flex gap-2">
          <Checkbox />
          <Label>Nsfw</Label>
        </div>
        <UploadField title="Cover" multiple preview />

        <div className="flex flex-col w-full justify-center gap-8 mt-9">
          <Button
            type="submit"
            text="Login"
            variant="primary"
            loading={loading}
            disabled={!isValid}
            rounded
          />
        </div>
      </div>
    </form>
  );
}
