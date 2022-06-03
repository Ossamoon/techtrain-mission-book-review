export type Token = {
  token: string;
};

export type BookData = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean;
};

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
  | ({ status: "success" } & Token)
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
  | ({ status: "success" } & Token)
  | ({ status: "failed" } & ErrorMessage);

export const createUser = async (
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

//
// * Get User Name (with Authentication)
// [GET] `/users`
//

export type UserGetRequest = Token;

export type UserGetResponse =
  | { status: "success"; data: { name: string } }
  | ({ status: "failed" } & ErrorMessage);

export const getUser = async ({
  token,
}: UserGetRequest): Promise<UserGetResponse> => {
  const url = base_url + "/users";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return response.json().then((data) => ({ status: "failed", ...data }));
  }

  return response.json().then((data) => ({ status: "success", data: data }));
};

//
// * Get Book List (with Authentication)
// [GET] `/books`
//

export type BooksGetRequest = Token & { offset: number | undefined };

export type BooksGetResponse =
  | { status: "success"; data: BookData[] }
  | ({ status: "failed" } & ErrorMessage);

export const getBooks = async ({
  token,
  offset,
}: BooksGetRequest): Promise<BooksGetResponse> => {
  const url =
    offset === undefined
      ? base_url + "/books"
      : base_url + "/books?offset=" + String(offset);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return response.json().then((data) => ({ status: "failed", ...data }));
  }

  return response.json().then((data) => ({ status: "success", data: data }));
};
