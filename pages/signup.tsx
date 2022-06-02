import Head from "next/head";
import { postUser, PostUserData } from "../lib/fetch";

export default function Signup() {
  return (
    <>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="新規ユーザー登録画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen h-screen">サインアップ画面だよー</div>
    </>
  );
}
