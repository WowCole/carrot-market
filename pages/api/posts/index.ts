import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiHandler, NextApiResponse } from "next";
const handler: NextApiHandler = async (
  req,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method === "GET") {
    const post = await client.post.findMany({
      include: { _count: { select: { answers: true, wondering: true } } },
    });
    res.json({ ok: true, post });
  }

  if (req.method === "POST") {
    const {
      body: { question },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    console.log(post);
    res.json({ ok: true, post });
  }
};

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler }),
);
