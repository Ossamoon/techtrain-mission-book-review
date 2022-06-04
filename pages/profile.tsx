import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { getUser, putUser } from "../lib/fetch";
import { InputForm } from "../components/inputForm";

export type Input = {
  name: string;
};

const Profile: NextPage = () => {
  const [cookies] = useCookies(["token"]);

  const initUserName = useRef<string>("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    toast.promise(putUser(cookies.token, data), {
      loading: "Loading",
      success: (res) => {
        return `プロフィールの変更を適用しました`;
      },
      error: (err) => {
        console.error(err);
        return `プロフィールの変更に失敗しました`;
      },
    });
  };

  useEffect(() => {
    // Redirect if viewer do not have token
    if (!cookies.token) {
      router.replace("/login");
      return;
    }
    // Get user name
    getUser(cookies.token)
      .then((data) => {
        initUserName.current = data.name;
        setValue("name", data.name);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="プロフィール変更画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen px-8 py-16 bg-gray-100 space-y-12">
        <div className="text-center text-2xl text-gray-600 font-bold">
          プロフィール
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg bg-gray-200 py-12 rounded-2xl space-y-8 mx-auto"
        >
          <div className="space-y-4 w-80 mx-auto">
            <InputForm
              key="name"
              label="名前"
              type="text"
              registers={register("name", { required: true })}
              error={errors.name}
            />
          </div>

          <input
            type="submit"
            value="適用"
            className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
          />
        </form>
        <div className="max-w-fit mx-auto cursor-pointer">
          <Link href="/">
            <a className="text-gray-600 hover:underline hover:text-gray-400">
              ホームへ戻る
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
