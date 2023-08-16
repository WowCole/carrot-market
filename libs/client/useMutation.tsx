import { useMutation as mutation } from "@tanstack/react-query";

const useMutation = <T extends {}>(url: string, refetch?: any) => {
  return mutation({
    mutationFn: (data: unknown) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data: T) => {
          refetch ? refetch() : null;
          return data;
        }),
  });
};

export default useMutation;
