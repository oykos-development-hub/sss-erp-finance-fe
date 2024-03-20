export type QueryOptions<T> = {
  onSuccess?: (data?: T) => void;
  onError?: (data?: T) => void;
};

// export type QueryParams<P, T> = {
//   input: P;
//   options: QueryOptions<T>;
// };
