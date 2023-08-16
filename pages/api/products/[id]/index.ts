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
  const product = await client.product.findUnique({
    where: { id: +id! },
    include: { user: { select: { id: true, name: true } } },
  });
  const terms = product?.name
    .split(" ")
    .map((word) => ({ name: { contains: word } }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLinked = Boolean(
    await client.fav.findFirst({
      where: { productId: product?.id, userId: user?.id },
      select: { id: true },
    }),
  );
  res.json({ ok: true, product, relatedProducts, isLinked });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
