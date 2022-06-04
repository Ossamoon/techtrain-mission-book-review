import type { BookData } from "../lib/fetch";

import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
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
    // Redirect if viewer do not have token
    if (!cookies.token) {
      router.replace("/login");
      return;
    }
    // Get user name
    getUser(cookies.token)
      .then((data) => {
        setUserName(data.name);
      })
      .catch((err) => {
        console.error(err);
      });

    // Get book data
    getBooks(cookies.token, undefined)
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const logout = () => {
    removeCookie("token");
    toast("ログアウトしました");
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

      <div className="min-w-screen min-h-screen bg-gray-100 space-y-16">
        <header className="w-full h-12 bg-gray-800 flex px-4 space-x-4">
          {userName !== "" ? (
            <>
              <div className="flex-none text-md text-gray-50 w-fit my-auto">
                ようこそ、<span className="font-bold">{userName}</span>さん
              </div>
              <div className="flex-1 w-10"></div>
              <div className="flex-none w-fit cursor-pointer my-auto">
                <Link href="/profile">
                  <a className="text-md text-gray-50 hover:underline">
                    プロフィール設定
                  </a>
                </Link>
              </div>
              <div
                onClick={logout}
                className="flex-none text-md text-gray-50 hover:underline w-fit cursor-pointer my-auto"
              >
                ログアウト
              </div>
            </>
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
        <div className="mx-8">
          <div className="max-w-4xl bg-gray-200 p-8 rounded-2xl space-y-4 mx-auto">
            <Link href="/new">
              <div className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 shadow w-fit ml-auto">
                <a className="text-gray-600 font-bold text-md">
                  レビューを投稿
                </a>
              </div>
            </Link>
            {data.map((book) => (
              <div
                key={book.id}
                className="hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
              >
                {book.title} {book.detail}
              </div>
            ))}
          </div>
        </div>
        <footer className="w-full h-24 bg-gray-800 text-gray-200 pt-8">
          <div className="w-fit mx-auto text-sm">developed by ossamoon</div>
        </footer>
      </div>
    </>
  );
}
