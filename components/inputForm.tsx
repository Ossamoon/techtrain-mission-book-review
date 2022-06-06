import type { FC } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label: string;
  type: string;
  registers: UseFormRegisterReturn;
  error: FieldError | undefined;
};

export const InputForm: FC<Props> = ({ label, type, registers, error }) => {
  return (
    <div>
      <label>
        <div className="font-bold text-sm text-gray-600">
          {label}
          {error && (
            <span className="text-red-400 ml-2">値を入力してください</span>
          )}
        </div>
        <input
          {...registers}
          type={type}
          className="w-full px-1 py-1 rounded text-gray-800"
        />
      </label>
    </div>
  );
};
