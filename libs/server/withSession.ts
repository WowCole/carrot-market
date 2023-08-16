import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOption = {
  cookieName: "carrotsession",
  password: process.env.COOKIE_PASSWORD!,
  // safari 임시 호환
  cookieOptions: { secure: false },
};

export const withApiSession = (fn: any) => {
  return withIronSessionApiRoute(fn, cookieOption);
};
