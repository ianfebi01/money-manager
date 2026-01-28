export const queryClientOptions = {
  defaultOptions : {
    queries : {
      refetchOnWindowFocus : false,
      staleTime            : 1000 * 60 * 5,
      cacheTime            : 1000 * 60 * 5,
    },
  },
};
