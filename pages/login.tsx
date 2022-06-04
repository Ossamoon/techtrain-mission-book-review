import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { signIn } from "../lib/fetch";
import { InputForm } from "../components/inputForm";

export type Input = {
  email: string;
  password: string;
};

const getLabel = (item: keyof Input) => {
  switch (item) {
    case "email":
      return "メールアドレス";
      break;
    case "password":
      return "パスワード";
      break;
  }
};

const Login: NextPage = () => {
  const [_, setCookie] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const fields = ["email", "password"] as const;

  const router = useRouter();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    toast.promise(signIn(data), {
      loading: "Loading",
      success: (res) => {
        setCookie("token", res.token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          secure: true,
          sameSite: true,
        });
        router.push("/");
        return `ログインしました`;
      },
      error: (err) => {
        console.error(err);
        return `ログインに失敗しました`;
      },
    });
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="ログイン画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen px-8 py-16 bg-gray-100 space-y-12">
        <div className="text-center text-2xl text-gray-600 font-bold">
          ログイン
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg bg-gray-200 py-12 rounded-2xl space-y-8 mx-auto"
        >
          <div className="space-y-4 w-80 mx-auto">
            {fields.map((field) => (
              <InputForm
                key={field}
                label={getLabel(field)}
                type={field}
                registers={register(field, { required: true })}
                error={errors[field]}
              />
            ))}
          </div>

          <input
            type="submit"
            value="ログイン"
            className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
          />
        </form>
      </div>
    </>
  );
};

export default Login;
