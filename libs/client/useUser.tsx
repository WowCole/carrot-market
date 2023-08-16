import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { ResponseType } from "../server/withHandler";
import { queryClient } from "@/pages/_app";

const useUser = () => {
  const { data, isLoading } = useQuery<ResponseType>(["/api/users/me"]);
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      queryClient.clear();
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading };
};

export default useUser;
