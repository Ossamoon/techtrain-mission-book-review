import type { FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label: string;
  type: string;
  registers: UseFormRegisterReturn;
};

export const InputForm: FC<Props> = ({ label, type, registers }) => {
  return (
    <div>
      <label>
        <div className="font-bold text-sm text-gray-600">{label}</div>
        <input
          {...registers}
          type={type}
          className="w-full px-1 py-1 rounded text-gray-800"
        />
      </label>
    </div>
  );
};
