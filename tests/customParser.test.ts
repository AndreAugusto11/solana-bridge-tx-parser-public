import { Connection, clusterApiUrl, TransactionInstruction, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

import { ParsedAccount, ParsedCustomInstruction, SolanaParser } from "../src";

function customParser(instruction: TransactionInstruction): ParsedCustomInstruction {
	let args: unknown;
	let keys: ParsedAccount[];
	let name: string;

	switch (instruction.data[0]) {
		case 0:
			args = { message: instruction.data.slice(1).toString("utf8") };
			keys = [instruction.keys[0], { name: "messageFrom", ...instruction.keys[1] }];
			name = "echo";
			break;
		case 1:
			args = { a: instruction.data.readBigInt64LE(1), b: instruction.data.readBigInt64LE(9) };
			keys = instruction.keys;
			name = "sum";
			break;
		default:
			throw new Error("unknown instruction!");
	}

	return {
		programId: instruction.programId,
		accounts: keys,
		args,
		name,
	};
}

function customTest() {
	const connection = new Connection(clusterApiUrl("devnet"));
	const ix0Tx = "5xEeZMdrWVG7i8Fbcbu718FtbgSbXsK9c4GPBv21W2e35vP4DdkVghqH4p8dPKdmroUzNe2mBkctm4RAxaVbo78G";
	const ix1Tx = "5xEeZMdrWVG7i8Fbcbu718FtbgSbXsK9c4GPBv21W2e35vP4DdkVghqH4p8dPKdmroUzNe2mBkctm4RAxaVbo78G";
	const parser = new SolanaParser([]);

	it("can take custom parser", () => {
		parser.addParser(new PublicKey("5wZA8owNKtmfWGBc7rocEXBvTBxMtbpVpkivXNKXNuCV"), customParser);
	});

	it("can parse instruction 0", async () => {
		const parsed = await parser.parseTransactionByHash(connection, ix0Tx);
		if (!parsed) return Promise.reject("failed to get/parse tx");
		assert.equal(parsed[0].name, "echo");
		assert.equal((parsed[0].args as { message: string }).message, "ewjlkdewjd;lkewjd;ekjdqe");
	});

	it("can parse instruction 1", async () => {
		const parsed = await parser.parseTransactionByHash(connection, ix1Tx);
		if (!parsed) return Promise.reject("failed to get/parse tx");

		assert.equal(parsed[1].name, "sum");
		const args = parsed[1].args as { a: bigint; b: bigint };
		assert.equal(args.a, BigInt(1));
		assert.equal(args.b, BigInt(2));
	});
}

describe("Custom parser test", customTest);
