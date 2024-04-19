export type QueryOptions<T> = {
  onSuccess?: (data?: T) => void;
  onError?: (data?: T) => void;
  transform?: (data: T) => any[];
};

// export type QueryParams<P, T> = {
//   input: P;
//   options: QueryOptions<T>;
// };
