import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/widthHandler";
import { NextApiHandler, NextApiResponse } from "next";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler: NextApiHandler = async (
  req,
  res: NextApiResponse<ResponseType>,
) => {
  const { phone, email } = req.body;
  const user = phone ? { phone: +phone } : { email };
  const payload = String(Math.random()).substring(2, 8);
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `yout login token is ${payload}`,
    });
  } else if (email) {
    const email = await sgMail.send({
      from: "woohs0130@naver.com",
      to: "tda.cole@gmail.com",
      subject: "Your Carrot Market Verification Email",
      text: `Your token is ${payload}`,
      html: `<strong>Your token is ${payload}</strong>`,
    });
    console.log(email);
  }

  return res.json({ ok: true });
};

export default withHandler("POST", handler);
