import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) =>
        await fetch(queryKey[0] as string).then((response) => response.json()),
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto w-full max-w-xl">
        <Component {...pageProps} />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
