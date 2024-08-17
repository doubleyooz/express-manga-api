"use client";

import NextLink from "next/link";
import login from "./login";
import { useForm } from "react-hook-form";
import TextField from "@/components/TextField";
import { LoginFormProps, loginSchema } from "@/common/zod.common";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/Button";

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormProps) => {
    console.log(data);

    //await signIn(data.email, data.password);

    //nav("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
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
        <Button type="submit" text="Login" />
        <NextLink className="self-center" href="/auth/signup">
          Signup
        </NextLink>
      </div>
    </form>
  );
}
