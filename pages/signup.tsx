import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import type { UserCreateRequest } from "../lib/fetch";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { createUser } from "../lib/fetch";
import { InputForm } from "../components/inputForm";

export type Input = UserCreateRequest & {
  re_password: string;
};

const getLabel = (item: keyof Input): string => {
  switch (item) {
    case "name":
      return "名前";
      break;
    case "email":
      return "メールアドレス";
      break;
    case "password":
      return "パスワード";
      break;
    case "re_password":
      return "パスワード（再入力）";
      break;
  }
};

const getType = (item: keyof Input): string => {
  switch (item) {
    case "name":
      return "text";
      break;
    case "email":
      return "email";
      break;
    case "password":
      return "password";
      break;
    case "re_password":
      return "password";
      break;
  }
};

const Signup: NextPage = () => {
  const [result, setResult] = useState<{
    status: "success" | "failed" | undefined;
    message: string;
  }>({ status: undefined, message: "" });

  const [_, setCookie] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const fields = ["name", "email", "password", "re_password"] as const;

  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (data.password !== data.re_password) {
      setResult({
        status: "failed",
        message: "パスワードが一致していません。",
      });
      return;
    }

    const response = await createUser(data);
    console.log(response);

    if (response.status === "failed") {
      if (response.ErrorCode === 405) {
        setResult({
          status: "failed",
          message: `サーバでエラーが発生しました。時間をおいてもう一度お試しください。`,
        });
        return;
      }
      setResult({
        status: "failed",
        message: `アカウント作成に失敗しました。`,
      });
      return;
    }

    setResult({
      status: "success",
      message: "新規アカウントを登録しました！",
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
        <title>Signup Page</title>
        <meta name="description" content="新規ユーザー登録画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen p-12 bg-gray-100">
        <div className="container max-w-lg mx-auto flex-cols space-y-12">
          {result.status === "failed" ? (
            <div className="px-4 py-2 rounded bg-red-300 text-gray-700 font-bold max-w-fit mx-auto">
              {result.message}
            </div>
          ) : result.status === "success" ? (
            <div className="px-4 py-2 rounded bg-green-300 text-gray-700 font-bold max-w-fit mx-auto">
              {result.message}
            </div>
          ) : null}
          <div className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
            新規登録
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-gray-200 py-12 rounded-2xl space-y-8"
          >
            <div className="space-y-4 w-80 mx-auto">
              {fields.map((field) => (
                <InputForm
                  key={field}
                  label={getLabel(field)}
                  type={getType(field)}
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
          <div className="max-w-fit mx-auto cursor-pointer">
            <Link href="/login">
              <a className="text-gray-600 hover:underline hover:text-gray-400">
                ログイン
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
