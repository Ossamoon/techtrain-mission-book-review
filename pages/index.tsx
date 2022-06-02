import Head from "next/head";

export default function Home() {
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

      <div className="w-screen h-screen">インデックス画面だよー</div>
    </>
  );
}
