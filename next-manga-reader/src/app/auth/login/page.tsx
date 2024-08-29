"use client";

import NextLink from "next/link";
import Image from "next/image";
import login from "./login";
import { useForm } from "react-hook-form";
import TextField from "@/common/TextField";
import { LoginFormProps, loginSchema } from "@/common/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/common/Button";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormProps) => {
    setLoading(true);
    console.log(data);

    //await signIn(data.email, data.password);

    //nav("/");
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xs px-10 py-20 rounded-[36px] bg-white shadow-lg"
    >
      <div className="flex flex-col gap-2">
        <TextField
          name="email"
          type="email"
          placeholder="Email"
          error={errors["email"]?.message}
          register={register}
        />
        <TextField
          name="password"
          type="password"
          placeholder="Password"
          error={errors["password"]?.message}
          register={register}
        />
        <NextLink
          className="font-sans self-end text-xs text-gray-400"
          href="/auth/forgot"
        >
          Forgot Password?
        </NextLink>
        <div className="flex flex-col w-full justify-center gap-8 mt-9">
          <Button
            type="submit"
            text="Login"
            variant="primary"
            loading={loading}
            disabled={!isValid}
            rounded
          />
          <span className="text-center">OR</span>
          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              variant="text"
              loading={loading}
              icon={
                <Image
                  src="/facebook.png"
                  width={24}
                  height={24}
                  alt="facebook"
                />
              }
              rounded
              outlined
              shadow
            />
            <Button
              type="submit"
              variant="text"
              loading={loading}
              icon={
                <Image
                  src="/twitter.png"
                  width={24}
                  height={24}
                  alt="twitter"
                />
              }
              rounded
              outlined
              shadow
            />
            <Button
              type="submit"
              variant="text"
              loading={loading}
              icon={
                <Image src="/google.png" width={24} height={24} alt="google" />
              }
              rounded
              outlined
              shadow
            />
          </div>
        </div>
      </div>
    </form>
  );
}
