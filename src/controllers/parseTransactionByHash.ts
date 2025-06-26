import { Request, Response, NextFunction } from "express";
import { Connection } from "@solana/web3.js";

import { SolanaParser } from "../parsers";

const parser = new SolanaParser([]);

// Create an item
export const parseTransactionByHash = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { rpcUrl, signature } = req.body;

		// console.log("Rpc URL:", rpcUrl);
		console.log("Decoding transaction with signature:", signature);

		if (!rpcUrl || !signature) {
			return res.status(400).json({ error: "rpcUrl and signature are required" });
		}

		if (!process.env.SOLANA_RPC_URL) {
			return res.status(500).json({ error: "SOLANA_RPC_URL is not set in environment variables" });
		}

		const rpcConnection = new Connection(process.env.SOLANA_RPC_URL, {
			httpHeaders: {
				Authorization: `Bearer ${process.env.SOLANA_API_KEY}`,
			},
		});

		const parsed = await parser.parseTransactionByHashV2(rpcConnection, signature, true);

		return res.status(200).json(parsed);
	} catch (error) {
		next(error);
	}
};
