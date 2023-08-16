import { queryClient } from "@/pages/_app";
import { UseQueryOptions, useQuery, Updater } from "@tanstack/react-query";

const useQueryWithMutate = <T extends {}>({
  url,
  options,
  mutateQueryFn,
}: {
  url: string;
  options?: UseQueryOptions<T>;
  mutateQueryFn?: (prev: T) => T;
}) => {
  const query = useQuery<T>([url], { ...options });
  const mutateQuery = () =>
    queryClient.setQueryData(
      [url],
      mutateQueryFn as Updater<T | undefined, T | undefined>,
    );
  return { ...query, mutateQuery };
};

export default useQueryWithMutate;
