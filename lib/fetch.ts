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
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }

  // Error
  console.error(obj);
  if (response.status === 400) {
    throw new Error("有効でない値を検出しました");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("ログインに失敗しました");
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
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }

  // Error
  console.error(obj);
  if (response.status === 400) {
    throw new Error("有効でない値を検出しました");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("新規アカウントの作成に失敗しました");
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
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }

  // Error
  console.error(obj);
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("ユーザーの取得に失敗しました");
};

//
// * Put User Name (with Authentication)
// [PUT] `/users`
//

export type PutUser = (
  token: string,
  data: { name: string }
) => Promise<{ name: string }>;

export const putUser: PutUser = async (token, data) => {
  const url = base_url + "/users";
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }
  // Error
  console.error(obj);
  if (response.status === 400) {
    throw new Error("有効でない値を検出しました");
  }
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("ユーザー情報の更新に失敗しました");
};

//
// * Get Book List (with Authentication)
// [GET] `/books`
//

export type GetBooks = (token: string, offset?: number) => Promise<BookData[]>;

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
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }
  // Error
  console.error(obj);
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("情報の取得に失敗しました");
};

//
// * POST Book (with Authentication)
// [POST] `/books`
//

export type PostBooks = (
  token: string,
  data: {
    title: "string";
    url: "string";
    detail: "string";
    review: "string";
  }
) => Promise<void>;

export const postBooks: PostBooks = async (token, data) => {
  const url = base_url + "/books";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return;
  }
  // Error
  console.error(obj);
  if (response.status === 400) {
    throw new Error("有効でない値を検出しました");
  }
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("書籍レビューの登録に失敗しました");
};

//
// * Get Book with ID (with Authentication)
// [GET] `/books/{id}`
//

export type GetBook = (token: string, id: string) => Promise<BookData>;

export const getBook: GetBook = async (token, id) => {
  const url = base_url + "/books/" + id;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }
  // Error
  console.error(obj);
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 404) {
    throw new Error("書籍レビューが存在しません");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("情報の取得に失敗しました");
};

//
// * Put Book with ID (with Authentication)
// [PUT] `/books/{id}`
//

export type PutBook = (
  token: string,
  id: string,
  data: { title: string; url: string; detail: string; review: string }
) => Promise<BookData>;

export const putBook: PutBook = async (token, id, data) => {
  const url = base_url + "/books/" + id;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return obj;
  }
  // Error
  console.error(obj);
  if (response.status === 400) {
    throw new Error("有効でない値を検出しました");
  }
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 404) {
    throw new Error("書籍レビューが存在しません");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("情報の更新に失敗しました");
};

//
// * Delete Book with ID (with Authentication)
// [DELETE] `/books/{id}`
//

export type DeleteBook = (token: string, id: string) => Promise<void>;

export const deleteBook: DeleteBook = async (token, id) => {
  const url = base_url + "/books/" + id;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const obj = await response.json();

  // Success
  if (response.ok) {
    return;
  }
  // Error
  console.error(obj);
  if (response.status === 401) {
    throw new Error("認証エラーが発生しました");
  }
  if (response.status === 404) {
    throw new Error("書籍レビューが存在しません");
  }
  if (response.status === 500) {
    throw new Error("サーバーでエラーが発生しました");
  }
  throw new Error("書籍レビューを削除できませんでした");
};
