import type { BookData } from "../lib/fetch";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { getBooks, getUser } from "../lib/fetch";

export default function Home() {
  const [data, setData] = useState<BookData[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [cookies] = useCookies(["token"]);
  const offset = useRef<number>(0);

  useEffect(() => {
    // Get book data
    const fn = async () => {
      const response = await getBooks({
        token: cookies.token,
        offset: undefined,
      });
      if (response.status === "failed") {
        console.error(response.ErrorMessageEN);
        return;
      }
      setData(response.data);
      return;
    };
    fn();
  }, []);

  useEffect(() => {
    // Get user name
    const fn = async () => {
      const response = await getUser({ token: cookies.token });
      if (response.status === "failed") {
        console.error(response.ErrorMessageEN);
        return;
      }
      setUserName(response.data.name);
      return;
    };
    fn();
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

      <div className="min-w-screen min-h-screen px-8 py-16 bg-gray-100 space-y-12">
        <div className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
          Reactで作る書籍レビューアプリ
        </div>
        <div className="text-md text-gray-800 max-w-fit mx-auto">
          ようこそ、{userName}さん
        </div>
        <div className="max-w-4xl bg-gray-200 py-12 rounded-2xl space-y-8 mx-auto">
          {data.map((book) => (
            <div key={book.id}>
              {book.title} {book.detail}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
