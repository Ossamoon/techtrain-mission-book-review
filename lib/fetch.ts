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

export type SignIn = (data: {
  email: string;
  password: string;
}) => Promise<{ token: string }>;

export const signIn: SignIn = async (data) => {
  const url = base_url + "/signin";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err: ErrorMessage) => {
      console.error(err);
      throw err;
    });

  return response;
};

//
// * Create User (Sign Up)
// [POST] `/users`
//

export type CreateUser = (data: {
  name: string;
  email: string;
  password: string;
}) => Promise<{
  token: string;
}>;

export const createUser: CreateUser = async (data) => {
  const url = base_url + "/users";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err: ErrorMessage) => {
      console.error(err);
      throw err;
    });

  return response;
};

//
// * Get User Name (with Authentication)
// [GET] `/users`
//

export type GetUser = (token: string) => Promise<{ name: string }>;

export const getUser: GetUser = async (token) => {
  const url = base_url + "/users";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err: ErrorMessage) => {
      console.error(err);
      throw err;
    });

  return response;
};

//
// * Put User Name (with Authentication)
// [PUT] `/users`
//

export type PutUser = (
  token: string,
  data: { name: string }
) => Promise<{ name: string }>;

export const putUser: PutUser = async (token, { name }) => {
  const url = base_url + "/users";
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => res.json())
    .catch((err: ErrorMessage) => {
      console.error(err);
      throw err;
    });

  return response;
};

//
// * Get Book List (with Authentication)
// [GET] `/books`
//

export type GetBooks = (
  token: string,
  offset: number | undefined
) => Promise<BookData[]>;

export const getBooks: GetBooks = async (token, offset) => {
  const url =
    offset === undefined
      ? base_url + "/books"
      : base_url + "/books?offset=" + String(offset);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err: ErrorMessage) => {
      console.error(err);
      throw err;
    });

  return response;
};
