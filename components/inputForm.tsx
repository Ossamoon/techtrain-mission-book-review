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
  item: keyof Input;
  register: UseFormRegister<Input>;
  error: FieldError | undefined;
};

export const InputForm: FC<Props> = ({ item, register, error }) => {
  return (
    <div>
      <label>
        <div>{getLabel(item)}</div>
        <input
          {...(register(item), { required: true })}
          type={getType(item)}
          className="w-48 border"
        />
      </label>
      {error && <span>必須項目です</span>}
    </div>
  );
};
