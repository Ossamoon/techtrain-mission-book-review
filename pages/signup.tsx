import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { createUser } from "../lib/fetch";
import { Form } from "../components/form";
import { Main } from "../components/main";

export type Input = {
  name: string;
  email: string;
  password: string;
  re_password: string;
};
const fields = [
  { name: "name", label: "名前", type: "text" },
  { name: "email", label: "メールアドレス", type: "email" },
  { name: "password", label: "パスワード", type: "password" },
  { name: "re_password", label: "パスワード（再入力）", type: "password" },
];

const Signup: NextPage = () => {
  const [_, setCookie] = useCookies(["token"]);

  const { register, handleSubmit } = useForm<Input>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (data.password !== data.re_password) {
      toast.error("パスワードが一致していません");
      return;
    }

    toast.promise(createUser(data), {
      loading: "Loading",
      success: (res) => {
        setCookie("token", res.token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          secure: true,
          sameSite: true,
        });
        router.push("/");
        return `${data.name}さんのアカウントを作成しました`;
      },
      error: (err: Error) => {
        return err.message;
      },
    });
  };

  return (
    <>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="新規ユーザー登録画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-w-screen min-h-screen bg-gray-100">
        <Main title="新規登録" isLarge={false}>
          <Form
            fields={fields}
            submitValue="登録"
            register={register}
            onSubmit={handleSubmit(onSubmit)}
          ></Form>
        </Main>
        <div className="max-w-fit mx-auto cursor-pointer">
          <Link href="/login">
            <a className="text-gray-600 hover:underline hover:text-gray-400">
              ログイン
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
