import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";

type InputProps = {
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: ChangeEventHandler;
};

const Input: FC<InputProps> = ({ name, label, type, value, onChange }) => {
  return (
    <label>
      <span className="block font-bold text-sm text-gray-600">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-1 py-1 rounded text-gray-800"
      />
    </label>
  );
};

type FormProps = {
  fields: { name: string; label: string; type: string; initValue?: string }[];
};

export const Form: FC<FormProps> = ({ fields }) => {
  const [value, setValue] = useState<Map<string, string>>(() => {
    return new Map(fields.map((field) => [field.name, field.initValue ?? ""]));
  });

  const handleSubmit: FormEventHandler = (event) => {
    return;
  };

  const handleChange = (name: string): ChangeEventHandler<HTMLInputElement> => {
    return (event) => {
      const value = event.target.value;
      setValue((map) => map.set(name, value));
    };
  };

  return (
    <form
      className="max-w-lg bg-gray-200 py-12 rounded-2xl space-y-8 mx-auto"
      onSubmit={handleSubmit}
    >
      <>
        {fields.map((field) => {
          <Input
            {...field}
            value={value.get(field.name) ?? ""}
            onChange={handleChange(field.name)}
          />;
        })}
        <input
          type="submit"
          value="適用"
          className="cursor-pointer bg-blue-300 rounded-md px-4 py-2 text-gray-600 font-bold text-md block mx-auto"
        />
      </>
    </form>
  );
};
