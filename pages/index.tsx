import type { NextPage, GetServerSideProps } from "next";
import type { BookData } from "../lib/fetch";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { getBooks } from "../lib/fetch";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

type DataState =
  | { state: "success"; data: BookData[] }
  | { state: "error"; message: string }
  | { state: "loading" };

const Home: NextPage = () => {
  const [dataWithState, setDataWithState] = useState<DataState>({
    state: "loading",
  });
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    // Get book data
    if (cookies.token) {
      getBooks(cookies.token, undefined)
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
        <title>Book Review</title>
        <meta
          name="description"
          content="Reactで実装した書籍レビューWebアプリ"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-w-screen min-h-screen bg-gray-100 space-y-16">
        <Header />
        <main className="space-y-16 px-8">
          <h1 className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
            {dataWithState.state === "loading"
              ? "Loading..."
              : dataWithState.state === "error"
              ? "エラー"
              : "Reactで作る書籍レビューアプリ"}
          </h1>
          <div className="max-w-4xl bg-gray-200 p-8 rounded-2xl space-y-4 mx-auto">
            <Link href="/new">
              <div className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 shadow w-fit ml-auto">
                <a className="text-gray-600 font-bold text-md">
                  レビューを投稿
                </a>
              </div>
            </Link>
            {dataWithState.state === "loading"
              ? "Loading..."
              : dataWithState.state === "error"
              ? dataWithState.message
              : dataWithState.data.map((book) => (
                  <Link key={book.id} href={`/detail/${book.id}`}>
                    <a className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer block">
                      {book.title} {book.detail}
                    </a>
                  </Link>
                ))}
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

export default Home;
