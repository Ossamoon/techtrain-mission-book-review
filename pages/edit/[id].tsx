import type { NextPage, GetServerSideProps } from "next";

import Head from "next/head";
import toast from "react-hot-toast";
import { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";
import { getBook, putBook, deleteBook } from "../../lib/fetch";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { type FieldData, Form } from "../../components/form";
import { Main } from "../../components/main";

type FetchState =
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

type Input = {
  title: string;
  url: string;
  detail: string;
  review: string;
};

const fields: FieldData<Input>[] = [
  { name: "title", label: "タイトル", type: "text" },
  { name: "url", label: "URL", type: "url" },
  { name: "detail", label: "詳細", type: "textarea" },
  { name: "review", label: "レビュー", type: "textarea" },
];

const Edit: NextPage = () => {
  const [fetchState, setState] = useState<FetchState>({ state: "loading" });
  const [cookies] = useCookies();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<Input>();

  useEffect(() => {
    // Get book data
    const { id } = router.query;
    if (typeof id !== "string" || typeof cookies.token !== "string") {
      return;
    }
    getBook(cookies.token, id)
      .then((data) => {
        for (const field of fields) {
          setValue(field.name, data[field.name]);
        }
        setState({ state: "success" });
      })
      .catch((err: Error) => {
        setState({ state: "error", message: err.message });
      });
  }, []);

  const onClickDeleteButton: MouseEventHandler<HTMLButtonElement> = () => {
    // Delete book data
    const { id } = router.query;
    if (typeof id !== "string" || typeof cookies.token !== "string") {
      return;
    }
    toast.promise(deleteBook(cookies.token, id), {
      loading: "Loading...",
      success: () => {
        router.push("/");
        return "レビューを削除しました";
      },
      error: (err: Error) => err.message,
    });
  };

  const onSubmit: SubmitHandler<Input> = async (data) => {
    const { id } = router.query;
    if (typeof id !== "string") {
      return;
    }
    toast.promise(putBook(cookies.token, id, data), {
      loading: "Loading...",
      success: () => {
        return `書籍レビューの変更を適用しました`;
      },
      error: (err: Error) => err.message,
    });
  };

  return (
    <>
      <Head>
        <title>Edit Page</title>
        <meta name="description" content="書籍レビューの編集画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen bg-gray-100">
        <Header />
        <Main title="書籍レビュー編集" isLarge={false}>
          {fetchState.state === "loading" ? (
            "Loading..."
          ) : fetchState.state === "error" ? (
            fetchState.message
          ) : (
            <>
              <button
                className="block cursor-pointer bg-red-300 text-gray-600 font-bold text-sm rounded-md px-2 py-1 w-fit ml-auto"
                onClick={onClickDeleteButton}
              >
                レビューを削除
              </button>
              <Form
                fields={fields}
                submitValue="適用"
                register={register}
                onSubmit={handleSubmit(onSubmit)}
              ></Form>
            </>
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

export default Edit;
