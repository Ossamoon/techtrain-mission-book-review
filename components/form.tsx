import type { FC, FormEventHandler } from "react";
import type { UseFormRegister } from "react-hook-form";

type Props = {
  fields: {
    name: string;
    label: string;
    type: string;
  }[];
  submitValue: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<any>; // ここ何とかならんものか
};

export const Form: FC<Props> = ({
  fields,
  onSubmit,
  register,
  submitValue,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-4 w-80 mx-auto">
        {fields.map((field) => (
          <label key={field.name} className="block">
            <div className="font-bold text-sm text-gray-600">{field.label}</div>
            <input
              {...register(field.name, { required: true })}
              type={field.type}
              className="w-full px-1 py-1 rounded text-gray-800"
            />
          </label>
        ))}
      </div>
      <input
        type="submit"
        value={submitValue}
        className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
      />
    </form>
  );
};
