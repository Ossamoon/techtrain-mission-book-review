import type { NextPage, GetServerSideProps } from "next";
import type { BookData } from "../../lib/fetch";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { getBook } from "../../lib/fetch";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Main } from "../../components/main";

type DataState =
  | { state: "success"; data: BookData }
  | { state: "error"; message: string }
  | { state: "loading" };

const Detail: NextPage = () => {
  const [dataWithState, setDataWithState] = useState<DataState>({
    state: "loading",
  });
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  useEffect(() => {
    // Get book data
    const { id } = router.query;
    if (cookies.token && typeof id === "string") {
      getBook(cookies.token, id)
        .then((data) => {
          setDataWithState({ state: "success", data: data });
        })
        .catch((err: Error) => {
          setDataWithState({ state: "error", message: err.message });
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Detail</title>
        <meta name="description" content="書籍レビューの詳細画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen bg-gray-100">
        <Header />
        <Main title="詳細画面" isLarge={true}>
          {dataWithState.state === "loading" ? (
            "Loading..."
          ) : dataWithState.state === "error" ? (
            dataWithState.message
          ) : (
            <>
              <div className="text-gray-800">
                <h2 className="text-gray-600 font-bold">タイトル</h2>
                {dataWithState.data.title}
              </div>
              <div className="text-gray-800">
                <h2 className="text-gray-600 font-bold">詳細</h2>
                {dataWithState.data.detail}
              </div>
              <div className="text-gray-800">
                <h2 className="text-gray-600 font-bold">URL</h2>
                <a
                  className="text-blue-600 hover:underline hover:text-blue-400"
                  href={dataWithState.data.url}
                >
                  {dataWithState.data.url}
                </a>
              </div>
              <div className="text-gray-800">
                <h2 className="text-gray-600 font-bold">レビュー</h2>
                {dataWithState.data.review}
              </div>
              <div className="text-gray-800">
                <h2 className="text-gray-600 font-bold">投稿者</h2>
                {dataWithState.data.reviewer}
              </div>
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

export default Detail;
