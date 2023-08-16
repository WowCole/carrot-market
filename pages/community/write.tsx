import type { NextPage } from "next";
import Button from "@/components/button";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";

interface WritingForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<WritingForm>();
  const {
    data,
    mutate: post,
    isLoading,
  } = useMutation<WriteResponse>("/api/posts");

  const onValid = (data: WritingForm) => {
    if (isLoading) return;
    post(data);
  };

  useEffect(() => {
    if (!!data?.ok) {
      router.push(`/community/${data?.post?.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
        />
        <Button text={isLoading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
