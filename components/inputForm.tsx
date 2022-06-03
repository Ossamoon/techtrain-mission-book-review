import type { FC } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";
import { Input } from "../pages/signup";

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

type Props = {
  field: keyof Input;
  register: UseFormRegister<Input>;
  error: FieldError | undefined;
};

export const InputForm: FC<Props> = ({ field, register, error }) => {
  return (
    <div>
      <label>
        <div className="font-bold text-sm text-gray-600">
          {getLabel(field)}
          {error && (
            <span className="text-red-400 ml-2">値を入力してください</span>
          )}
        </div>
        <input
          {...register(field, { required: true })}
          type={getType(field)}
          className="w-full px-1 py-1 rounded text-gray-800"
        />
      </label>
    </div>
  );
};
