import "mocha";

import { Connection, clusterApiUrl } from "@solana/web3.js";

import { SolanaParser } from "../src";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([]);

beforeEach(async () => {
	console.log("----------------------");
	console.log("Waiting for 5 seconds before starting new test...");
	await new Promise((resolve) => setTimeout(resolve, 5000));
	console.log("----------------------");
});

describe("Test parse transaction", () => {
	it("can parse bid tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"Ahy9GEyiPzkrw54Js6rw43bD6m6V3zmDDK6nn6e8N2tskrbkiozhsMjcdBLvCgH5JAc8CFyUZiwWpyCNqQ4wmQb",
			true,
		);

		console.log(parsed);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}
	});
});
