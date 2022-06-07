import { FC, ReactNode } from "react";

type Props = {
  title: string;
  isLarge: boolean;
  children: ReactNode;
};

export const Main: FC<Props> = ({ title, isLarge, children }) => {
  return (
    <main className="space-y-16 py-16">
      <h1 className="text-2xl text-gray-600 font-bold max-w-fit mx-auto">
        {title}
      </h1>
      <div className="mx-8">
        <div
          className={`${
            isLarge ? "max-w-4xl" : "max-w-lg"
          } bg-gray-200 p-8 rounded-2xl space-y-4 mx-auto`}
        >
          {children}
        </div>
      </div>
    </main>
  );
};
