import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { type } from "os";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
type method = "GET" | "POST" | "DELETE";

interface configType {
  methods: method[];
  handler: NextApiHandler;
  isPrivate?: boolean;
}

const withHandler = ({ methods, handler, isPrivate = true }: configType) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method && !methods.includes(req.method as method)) {
      return res.status(401).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "need to login" });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
};
export default withHandler;
