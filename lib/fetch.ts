export type ErrorMessage = {
  ErrorCode: number;
  ErrorMessageJP: string;
  ErrorMessageEN: string;
};

const base_url = "https://api-for-missions-and-railways.herokuapp.com";

//
// * Sign In
// [POST] `/signin`
//

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse =
  | { status: "success"; token: string }
  | ({ status: "failed" } & ErrorMessage);

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const url = base_url + "/signin";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return response.json().then((data) => ({ status: "failed", ...data }));
  }

  return response.json().then((data) => ({ status: "success", ...data }));
};

//
// * Create User (Sign Up)
// [POST] `/users`
//

export type UserCreateRequest = {
  name: string;
  email: string;
  password: string;
};

export type UserCreateResponse =
  | { status: "success"; token: string }
  | ({ status: "failed" } & ErrorMessage);

export const userCreate = async (
  data: UserCreateRequest
): Promise<UserCreateResponse> => {
  const url = base_url + "/users";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return response.json().then((data) => ({ status: "failed", ...data }));
  }

  return response.json().then((data) => ({ status: "success", ...data }));
};
