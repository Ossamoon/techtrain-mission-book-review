import type { FC } from "react";

import Link from "next/link";

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-gray-800 py-8">
      <div className="max-w-fit mx-auto cursor-pointer">
        <Link href="/">
          <a className="text-gray-200 hover:underline hover:text-gray-300">
            ホームへ戻る
          </a>
        </Link>
      </div>
    </footer>
  );
};
