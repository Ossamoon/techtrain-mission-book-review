import type { NextPage, GetServerSideProps } from "next";

import Head from "next/head";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";
import { getBook, putBook } from "../../lib/fetch";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { InputForm } from "../../components/inputForm";

type Input = {
  title: string;
  url: string;
  detail: string;
  review: string;
};

type FetchState =
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

const fields = [
  { name: "title", label: "タイトル", type: "text" },
  { name: "url", label: "URL", type: "url" },
  { name: "detail", label: "詳細", type: "text" },
  { name: "review", label: "レビュー", type: "text" },
] as const;

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

  const onSubmit: SubmitHandler<Input> = async (data) => {
    const { id } = router.query;
    if (typeof id !== "string") {
      return;
    }
    toast.promise(putBook(cookies.token, id, data), {
      loading: "Loading",
      success: () => {
        return `書籍レビューの変更を適用しました`;
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
        <title>Edit Page</title>
        <meta name="description" content="書籍レビューの編集画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen bg-gray-100 space-y-16">
        <Header />
        <main className="space-y-16">
          <h1 className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
            編集画面
          </h1>
          <div className="mx-8">
            <div className="max-w-4xl bg-gray-200 p-8 rounded-2xl space-y-4 mx-auto">
              {fetchState.state === "loading" ? (
                "Loading..."
              ) : fetchState.state === "error" ? (
                fetchState.message
              ) : (
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
              )}
            </div>
          </div>
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

export default Edit;
