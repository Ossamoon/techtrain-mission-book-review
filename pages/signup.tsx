import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import type { PostUserData } from "../lib/fetch";

import Head from "next/head";
import { useForm } from "react-hook-form";
import { postUser } from "../lib/fetch";
import { InputForm } from "../components/inputForm";

export type Input = PostUserData & {
  re_password: string;
};

const Signup: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => {
    if (data.password === data.re_password) {
      postUser(data);
    }
  };

  return (
    <>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="新規ユーザー登録画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen h-screen bg-gray-100">
        <div className="max-w-xl mx-auto">
          <div className="text-center text-2xl text-gray-600 font-bold py-8">
            新規登録
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="container w-full bg-gray-200 p-4 rounded-2xl"
          >
            <InputForm item="name" register={register} error={errors.name} />
            <InputForm item="email" register={register} error={errors.email} />
            <InputForm
              item="password"
              register={register}
              error={errors.password}
            />
            <InputForm
              item="re_password"
              register={register}
              error={errors.re_password}
            />
            <input type="submit" className="cursor-pointer" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
