import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import { parseTransactionByHash } from "../controllers";

const router = Router();

router.post("/parseTransactionByHash", async (req: Request, res: Response, next: NextFunction) => {
	await parseTransactionByHash(req, res, next);
});

export default router;
