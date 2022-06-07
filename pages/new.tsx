import type { NextPage, GetServerSideProps } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { postBooks } from "../lib/fetch";
import { InputForm } from "../components/inputForm";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export type Input = {
  title: "string";
  url: "string";
  detail: "string";
  review: "string";
};

type DataState =
  | {
      state: "success";
      data: Input;
    }
  | { state: "error"; message: string }
  | { state: "loading" };

const fields = [
  { name: "title", label: "タイトル", type: "text" },
  { name: "url", label: "URL", type: "url" },
  { name: "detail", label: "詳細", type: "text" },
  { name: "review", label: "レビュー", type: "text" },
] as const;

const NewBook: NextPage = () => {
  const [cookies] = useCookies(["token"]);

  const { register, handleSubmit, reset } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    toast.promise(postBooks(cookies.token, data), {
      loading: "Loading",
      success: () => {
        reset;
        return `新しい書籍レビューを投稿しました`;
      },
      error: (err: Error) => {
        console.error(err);
        return err.message;
      },
    });
  };

  return (
    <>
      <Head>
        <title>New Book</title>
        <meta name="description" content="書籍レビュー投稿画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen bg-gray-100 space-y-16">
        <Header />
        <main className="space-y-16 px-8">
          <div className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
            新規書籍レビュー投稿
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg bg-gray-200 py-12 rounded-2xl space-y-8 mx-auto"
          >
            <div className="space-y-4 w-80 mx-auto">
              {fields.map((field) => (
                <InputForm
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  registers={register(field.name, { required: true })}
                />
              ))}
            </div>

            <input
              type="submit"
              value="投稿"
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

export default NewBook;
