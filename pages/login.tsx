import type { SubmitHandler } from "react-hook-form";
import type { PostSignInData } from "../lib/fetch";

import Head from "next/head";
import { useForm } from "react-hook-form";
import { InputForm } from "../components/inputForm";

const getLabel = (item: keyof PostSignInData) => {
  switch (item) {
    case "email":
      return "メールアドレス";
      break;
    case "password":
      return "パスワード";
      break;
  }
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSignInData>();

  const fields = ["email", "password"] as const;

  const onSubmit: SubmitHandler<PostSignInData> = async (data) => {
    console.log(data);
    return;
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="ログイン画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen h-screen bg-gray-100">
        <div className="container max-w-lg mx-auto p-4 flex-cols">
          <div className="text-center text-2xl text-gray-600 font-bold py-8">
            ログイン
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-gray-200 py-12 rounded-2xl space-y-8"
          >
            <div className="space-y-4 w-80 mx-auto">
              {fields.map((field) => (
                <InputForm
                  label={getLabel(field)}
                  type={field}
                  registers={register(field, { required: true })}
                  error={errors[field]}
                />
              ))}
            </div>

            <input
              type="submit"
              value="登録"
              className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
            />
          </form>
        </div>
      </div>
    </>
  );
}
