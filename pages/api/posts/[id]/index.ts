import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiHandler, NextApiResponse } from "next";
const handler: NextApiHandler = async (
  req,
  res: NextApiResponse<ResponseType>,
) => {
  const {
    query: { id },
  } = req;
  const post = await client.post.findUnique({
    where: { id: +id! },
    include: {
      answers: {
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answers: true,
          wondering: true,
        },
      },
    },
  });

  if (!post)
    return res.status(404).json({ ok: false, error: "Not found post" });
  return res.json({ ok: true, post });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
