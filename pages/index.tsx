import type { BookData } from "../lib/fetch";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { getBooks, getUser } from "../lib/fetch";

export default function Home() {
  const [data, setData] = useState<BookData[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [cookies, _, removeCookie] = useCookies(["token"]);
  const offset = useRef<number>(0);

  const router = useRouter();

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
      setUserName(response.name);
      return;
    };
    fn();
  }, []);

  useEffect(() => {
    // Redirect if viewer do not have token
    if (!cookies.token) {
      router.replace("/login");
    }
  }, []);

  const logout = () => {
    removeCookie("token");
    router.push("/login");
    return;
  };

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

      <div className="min-w-screen min-h-screen bg-gray-100 space-y-12">
        <header className="w-full h-12 bg-gray-800 flex">
          {userName !== "" ? (
            <div className="text-md text-gray-50 max-w-fit my-auto mr-auto ml-4">
              ようこそ、<span className="font-bold">{userName}</span>さん
            </div>
          ) : null}
          {userName !== "" ? (
            <div
              onClick={logout}
              className="text-md text-gray-50 hover:underline max-w-fit px-2 py-0.5 my-auto ml-auto mr-4 cursor-pointer"
            >
              ログアウト
            </div>
          ) : (
            <Link href="/login">
              <div className="border border-gray-50 rounded max-w-fit px-2 py-0.5 my-auto ml-auto mr-4 cursor-pointer">
                <a className="text-md text-gray-50">ログイン</a>
              </div>
            </Link>
          )}
        </header>
        <div className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
          Reactで作る書籍レビューアプリ
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
