import type { NextPage, GetServerSideProps } from "next";
import type { SubmitHandler } from "react-hook-form";

import Head from "next/head";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { postBooks } from "../lib/fetch";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { type FieldData, Form } from "../components/form";
import { Main } from "../components/main";

type Input = {
  title: "string";
  url: "string";
  detail: "string";
  review: "string";
};

const fields: FieldData<Input>[] = [
  { name: "title", label: "タイトル", type: "text" },
  { name: "url", label: "URL", type: "url" },
  { name: "detail", label: "詳細", type: "textarea" },
  { name: "review", label: "レビュー", type: "textarea" },
];

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

      <div className="min-w-screen min-h-screen bg-gray-100">
        <Header />
        <div className="min-w-screen min-h-screen bg-gray-100">
          <Main title="新規書籍レビュー投稿" isLarge={false}>
            <Form
              fields={fields}
              submitValue="投稿"
              register={register}
              onSubmit={handleSubmit(onSubmit)}
            ></Form>
          </Main>
        </div>
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
