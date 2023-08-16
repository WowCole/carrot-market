import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiHandler, NextApiResponse } from "next";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";
import { withApiSession } from "@/libs/server/withSession";

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler: NextApiHandler = async (
  req,
  res: NextApiResponse<ResponseType>,
) => {
  const { session } = req;

  session.destroy();
  return res.json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: true }),
);
