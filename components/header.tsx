import type { FC } from "react";

import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUser } from "../lib/fetch";

export const Header: FC = () => {
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();

  const [cookies, _, removeCookie] = useCookies(["token"]);

  const logout = () => {
    removeCookie("token");
    toast.success("ログアウトしました");
    router.push("/login");
    return;
  };

  useEffect(() => {
    // Get user name
    getUser(cookies.token)
      .then((data) => {
        setUserName(data.name);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <header className="w-full bg-gray-800 flex p-4 space-x-4">
      {userName !== "" ? (
        <>
          <div className="flex-none text-md text-gray-50 w-fit my-auto">
            ようこそ<span className="font-bold px-1">{userName}</span>さん
          </div>
          <div className="flex-1"></div>
          <div className="flex-none w-fit cursor-pointer my-auto">
            <Link href="/profile">
              <a className="text-gray-200 hover:underline">プロフィール設定</a>
            </Link>
          </div>
          <div
            onClick={logout}
            className="flex-none text-gray-200 hover:underline w-fit cursor-pointer my-auto"
          >
            ログアウト
          </div>
        </>
      ) : (
        <>
          <div className="flex-none text-md text-gray-50 w-fit my-auto">
            ようこそ
          </div>
          <div className="flex-1"></div>
          <div className="w-fit cursor-pointer my-auto">
            <Link href="/login">
              <a className="text-gray-200 hover:underline">ログイン</a>
            </Link>
          </div>
        </>
      )}
    </header>
  );
};
