export type Token = { token: string };

export type ErrorMessage = {
  ErrorCode: number;
  ErrorMessageJP: string;
  ErrorMessageEN: string;
};

const base_url = "https://api-for-missions-and-railways.herokuapp.com";

export type PostSignUpData = {
  name: string;
  email: string;
  password: string;
};

export const postSignUp = async (
  data: PostSignUpData
): Promise<Token | ErrorMessage> => {
  const url = base_url + "/users";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export type PostSignInData = {
  email: string;
  password: string;
};
