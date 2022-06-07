import type { NextPage, GetServerSideProps } from "next";
import type { BookData } from "../lib/fetch";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { getBooks } from "../lib/fetch";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Main } from "../components/main";

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

      <div className="min-w-screen min-h-screen bg-gray-100">
        <Header />
        <Main title="Reactで作る書籍レビューアプリ" isLarge={true}>
          <Link href="/new">
            <div className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 shadow w-fit ml-auto">
              <a className="text-gray-600 font-bold text-md">レビューを投稿</a>
            </div>
          </Link>
          {dataWithState.state === "loading"
            ? "Loading..."
            : dataWithState.state === "error"
            ? dataWithState.message
            : dataWithState.data.map((book) => (
                <div key={book.id} className="relative">
                  <Link href={`/detail/${book.id}`}>
                    <div className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer space-y-1 text-gray-800">
                      <a className="font-bold block truncate pr-12">
                        {book.title}
                      </a>
                      <div className="block truncate">{book.detail}</div>
                    </div>
                  </Link>
                  {book.isMine ? (
                    <Link href={`/edit/${book.id}`}>
                      <a className="block bg-gray-500 absolute top-2 right-2 w-fit hover:shadow-md hover:bg-gray-600 cursor-pointer px-2 py-1 text-sm text-gray-200 rounded">
                        編集
                      </a>
                    </Link>
                  ) : null}
                </div>
              ))}
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

export default Home;
