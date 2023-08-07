import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

const withHandler = (method: "GET" | "POST" | "DELETE", fn: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) {
      return res.status(401).end();
    }
    try {
      await fn(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
};
export default withHandler;
