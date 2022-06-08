import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { signIn } from "../lib/fetch";
import { type FieldData, Form } from "../components/form";
import { Main } from "../components/main";

type Input = {
  email: string;
  password: string;
};

const fields: FieldData<Input>[] = [
  { name: "email", label: "メールアドレス", type: "email" },
  { name: "password", label: "パスワード", type: "password" },
];

const Login: NextPage = () => {
  const [_, setCookie] = useCookies(["token"]);

  const { register, handleSubmit } = useForm<Input>();

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
      error: (err: Error) => {
        return err.message;
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
      <div className="min-w-screen min-h-screen bg-gray-100">
        <Main title="ログイン" isLarge={false}>
          <Form
            fields={fields}
            submitValue="ログイン"
            register={register}
            onSubmit={handleSubmit(onSubmit)}
          ></Form>
        </Main>
        <div className="max-w-fit mx-auto cursor-pointer">
          <Link href="/signup">
            <a className="text-gray-600 hover:underline hover:text-gray-400">
              新規登録
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
