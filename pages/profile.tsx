import type { NextPage, GetServerSideProps } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { getUser, putUser } from "../lib/fetch";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { type FieldData, Form } from "../components/form";
import { Main } from "../components/main";

type Input = {
  name: string;
};

const fields: FieldData<Input>[] = [
  { name: "name", label: "名前", type: "text" },
];

type FetchState =
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

const Profile: NextPage = () => {
  const [fetchState, setState] = useState<FetchState>({ state: "loading" });
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
        setState({ state: "success" });
      })
      .catch((err: Error) => {
        setState({ state: "error", message: err.message });
      });
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="プロフィール変更画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen bg-gray-100">
        <Header />
        <Main title="プロフィール設定" isLarge={false}>
          {fetchState.state === "loading" ? (
            "Loading..."
          ) : fetchState.state === "error" ? (
            fetchState.message
          ) : (
            <Form
              fields={fields}
              submitValue="適用"
              register={register}
              onSubmit={handleSubmit(onSubmit)}
            ></Form>
          )}
        </Main>
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
