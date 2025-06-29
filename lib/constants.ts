export const queryClientOptions = {
  defaultOptions : {
    queries : {
      refetchOnWindowFocus : false,
      staleTime            : 1000 * 60 * 60,
      cacheTime            : 1000 * 60 * 60,
	
    },
  },
};
