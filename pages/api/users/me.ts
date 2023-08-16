import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiHandler, NextApiResponse } from "next";

const handler: NextApiHandler = async (
  req,
  res: NextApiResponse<ResponseType>,
) => {
  const id = req.session.user?.id;
  const profile = await client.user.findUnique({ where: { id } });
  res.json({ ok: true, profile });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
