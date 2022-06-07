import type { NextPage, GetServerSideProps } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { getUser, putUser } from "../lib/fetch";
import { InputForm } from "../components/inputForm";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export type Input = {
  name: string;
};

const Profile: NextPage = () => {
  const [cookies] = useCookies(["token"]);

  const { register, handleSubmit, setValue } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    toast.promise(putUser(cookies.token, data), {
      loading: "Loading",
      success: () => {
        return `プロフィールの変更を適用しました`;
      },
      error: (err: Error) => {
        console.error(err);
        return err.message;
      },
    });
  };

  useEffect(() => {
    if (typeof cookies.token !== "string") {
      return;
    }
    // Get user name
    getUser(cookies.token)
      .then((data) => {
        setValue("name", data.name);
      })
      .catch((err: Error) => {
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

      <div className="min-w-screen min-h-screen bg-gray-100 space-y-16">
        <Header />
        <main className="space-y-16 px-8">
          <div className="text-center text-2xl text-gray-600 font-bold">
            プロフィール設定
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
              />
            </div>

            <input
              type="submit"
              value="適用"
              className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
            />
          </form>
        </main>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies["token"];
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
};

export default Profile;
