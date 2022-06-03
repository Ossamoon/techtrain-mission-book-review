import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import type { PostSignUpData } from "../lib/fetch";

import Head from "next/head";
import { useForm } from "react-hook-form";
import { postSignUp } from "../lib/fetch";
import { InputForm } from "../components/inputForm";

export type Input = PostSignUpData & {
  re_password: string;
};

const getLabel = (item: keyof Input) => {
  switch (item) {
    case "name":
      return "名前";
      break;
    case "email":
      return "メールアドレス";
      break;
    case "password":
      return "パスワード";
      break;
    case "re_password":
      return "パスワード（再入力）";
      break;
  }
};

const getType = (item: keyof Input) => {
  switch (item) {
    case "name":
      return "text";
      break;
    case "email":
      return "email";
      break;
    case "password":
      return "password";
      break;
    case "re_password":
      return "password";
      break;
  }
};

const Signup: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const fields = ["name", "email", "password", "re_password"] as const;

  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (data.password !== data.re_password) {
      console.error("パスワードの不一致");
      return;
    }

    const response = await postSignUp(data);
    console.log(response);
    return;
  };

  return (
    <>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="新規ユーザー登録画面" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen h-screen bg-gray-100">
        <div className="container max-w-lg mx-auto p-4 flex-cols">
          <div className="text-center text-2xl text-gray-600 font-bold py-8">
            新規登録
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-gray-200 py-12 rounded-2xl space-y-8"
          >
            <div className="space-y-4 w-80 mx-auto">
              {fields.map((field) => (
                <InputForm
                  label={getLabel(field)}
                  type={getType(field)}
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
};

export default Signup;
