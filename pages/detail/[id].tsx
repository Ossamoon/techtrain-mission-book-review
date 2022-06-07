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
        <Main
          title={
            dataWithState.state === "success" ? dataWithState.data?.title : ""
          }
          isLarge={true}
        >
          {dataWithState.state === "loading" ? (
            "Loading..."
          ) : dataWithState.state === "error" ? (
            dataWithState.message
          ) : (
            <>
              <div>{dataWithState.data.detail}</div>
              <div>{dataWithState.data.url}</div>
              <div>{dataWithState.data.review}</div>
              <div>{dataWithState.data.reviewer}</div>
              <div>{dataWithState.data.isMine}</div>
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
