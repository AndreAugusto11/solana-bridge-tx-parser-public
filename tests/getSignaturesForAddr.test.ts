/* eslint-disable no-console */
import "mocha";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { ParsedIdlInstruction, SolanaParser, idl } from "../src";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([]);

const MAYAN_PROGRAM_ID = new PublicKey("BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY");

describe("Test parse transaction", () => {
	it("can parse unlockBatch tx", async () => {
		const signatures = await rpcConnection.getSignaturesForAddress(MAYAN_PROGRAM_ID, {
			limit: 1000,
			before: "2DKayyRUsaqWEM85Ttmw4zSRSVtedxd5CDV8nSusFZTCFXvz2sJP1exGvbqRhQazm8KknLxFyxh1i3p1soGhw9YH",
			until: "3NVSsqQe2bsnqr4eV7By3HdYCcNXEFf1a6pAcNudqdAPptWYjhbm5NBRmdihRb5z975zcQc1Kp8WHzHy6Yqwy4ri",
		});

		console.log("Signatures:", signatures);

		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"3rEHm4akHVRFqTwMeh5HBYRK15UA8aYqD1XTigQmhKPQioGLweHetM1PeAX6DXFgQfF64jEf6h8x3TcRtyYgn27h",
			false,
		);

		console.log("Parsed transaction:", parsed);

		const order = parsed?.find((pix) => pix.name === "unlockBatch") as ParsedIdlInstruction<idl.MayanIdl, "unlockBatch">;
		console.log(`Data:`, order.args);
	});
});
