module.exports = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/",
        has: [
          {
            type: "cookie",
            key: "token",
            value: undefined,
          },
        ],
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/",
        has: [
          {
            type: "cookie",
            key: "token",
            value: undefined,
          },
        ],
        permanent: false,
      },
    ];
  },
};
