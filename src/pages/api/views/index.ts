import { withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalViews = await prisma.views.aggregate({
      _sum: {
        count: true,
      },
    });

    return res.status(200).json({ total: totalViews._sum.count?.toString() });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}

export default withSentry(handler);
