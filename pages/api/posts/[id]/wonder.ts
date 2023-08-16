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
    session: { user },
  } = req;

  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +id!,
    },
    select: {
      id: true,
    },
  });
  if (!!alreadyExists)
    await client.wondering.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  else
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id!,
          },
        },
      },
    });

  return res.json({ ok: true });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
