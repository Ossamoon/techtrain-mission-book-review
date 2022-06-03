import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import type { SignInRequest } from "../lib/fetch";

import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { signIn } from "../lib/fetch";
import { InputForm } from "../components/inputForm";

const getLabel = (item: keyof SignInRequest) => {
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
  const [result, setResult] = useState<{
    status: "success" | "failed" | undefined;
    message: string;
  }>({ status: undefined, message: "" });

  const [_, setCookie] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequest>();

  const fields = ["email", "password"] as const;

  const onSubmit: SubmitHandler<SignInRequest> = async (data) => {
    const response = await signIn(data);
    console.log(response);
    if (response.status === "failed") {
      if (response.ErrorCode === 403) {
        setResult({
          status: "failed",
          message: `パスワードが正しくありません。`,
        });
        return;
      }
      if (response.ErrorCode === 405) {
        setResult({
          status: "failed",
          message: `サーバでエラーが発生しました。時間をおいてもう一度お試しください。`,
        });
        return;
      }
      setResult({
        status: "failed",
        message: `ログインに失敗しました。`,
      });
      return;
    }

    setResult({
      status: "success",
      message: "ログインに成功しました！",
    });
    setCookie("token", response.token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      secure: true,
      sameSite: true,
    });
    return;
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="ログイン画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen px-8 py-16 bg-gray-100 space-y-12">
        {result.status === "failed" ? (
          <div className="px-4 py-2 rounded bg-red-300 text-gray-700 font-bold max-w-fit mx-auto">
            {result.message}
          </div>
        ) : result.status === "success" ? (
          <div className="px-4 py-2 rounded bg-green-300 text-gray-700 font-bold max-w-fit mx-auto">
            {result.message}
          </div>
        ) : null}
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
            value="登録"
            className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
          />
        </form>
      </div>
    </>
  );
};

export default Login;
