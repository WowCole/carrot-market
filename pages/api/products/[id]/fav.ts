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
  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: +id!,
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await client.fav.delete({
      where: { id: alreadyExists.id },
    });
  } else {
    await client.fav.create({
      data: {
        user: { connect: { id: user?.id } },
        product: { connect: { id: +id! } },
      },
    });
  }
  res.json({ ok: true });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
