/* eslint-disable no-console */
import "mocha";
import assert from "assert";

import { Connection, clusterApiUrl } from "@solana/web3.js";

import { SolanaParser } from "../src";
import { ParsedIdlInstruction } from "../src/interfaces";
import { DlnSrc } from "../src/programs/debridge-src";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([]);

beforeEach(async () => {
	console.log("----------------------");
	console.log("Waiting for 5 seconds before starting new test...");
	await new Promise((resolve) => setTimeout(resolve, 5000));
	console.log("----------------------");
});

describe("Test parse transaction", () => {
	it("can parse create order tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"3ggTVbZvk38HfKTQ8fcTYkvTeDc1uw75KTGUzpm1MVHFJWHhFSbQBALshBmszepZDULqTqxnMJhAPiT6UgXMUK5d",
			false,
		);

		const createOrder = parsed?.find((pix) => pix.name === "create_order_with_nonce") as ParsedIdlInstruction<DlnSrc, "create_order_with_nonce">;
		assert.equal(createOrder.accounts[0].name, "maker");
		assert.equal(createOrder.accounts[0].pubkey.toBase58(), "5cSGMBfJt451RSXPQEMMr7k8T3f9GQjc7uh3MWnaGLRV");

		assert.equal(createOrder.accounts[1].pubkey.toBase58(), "HJEPgYkbqjetrphNHG2W33SjG9mB4PrXorW358MzfggY");

		assert.equal(createOrder.accounts[2].pubkey.toBase58(), "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

		assert.equal(createOrder.accounts[3].pubkey.toBase58(), "7atKDGEZLqTbHFNwK8wdvPwZAPZ5h451uywv9aeZyVBS");

		assert.equal(createOrder.accounts[4].pubkey.toBase58(), "5vzSToEbBPB2PW1n7U7Qx5GKSSAYg4EU1mfwBGWimJc9");

		assert.equal(createOrder.accounts[5].pubkey.toBase58(), "77Ro2o91HYxCcRVALW6qeBJrzVjbRBbCdZgKL2LAHVhk");

		assert.equal(createOrder.accounts[6].pubkey.toBase58(), "Hosuuu5qQ3QuR9qNQBvpSExrXY3632pxsvR41wVK3zzQ");

		assert.equal(createOrder.accounts[7].pubkey.toBase58(), "ELE2uPTGiSM2zTMigXW85AN91WH93CXz6FRf1jrHDz7J");

		assert.equal(createOrder.accounts[8].pubkey.toBase58(), "9yfN3qv6tKxhniWcrQi7bP1kZgXmdd4dLm84rostKvQG");

		assert.equal(createOrder.accounts[9].pubkey.toBase58(), "11111111111111111111111111111111");

		assert.equal(createOrder.accounts[10].pubkey.toBase58(), "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

		assert.equal(createOrder.accounts[11].pubkey.toBase58(), "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

		assert.equal(createOrder.name, "create_order_with_nonce");
		assert.equal(createOrder.args.referral_code, 4850);
		assert.equal(BigInt(createOrder.args.nonce.toString()), 1730322253366);

		const orderArgs = createOrder.args.order_args;

		// assert.equal(orderArgs.allowed_cancel_beneficiary_src, null);
		// assert.equal(orderArgs.allowed_taker_dst, null);
		assert.equal(orderArgs.give_original_amount.toString(), "3011764280");

		assert.equal(parseInt(Buffer.from(orderArgs.take.amount).toString("hex"), 16), 2999126098);
		assert.equal(parseInt(Buffer.from(orderArgs.take.chain_id).toString("hex"), 16), 1);
		assert.equal(Buffer.from(orderArgs.take.token_address).toString("hex"), "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

		assert.equal(Buffer.from(orderArgs.receiver_dst).toString("hex"), "6f050bb29fcc910891be4f17d3a123cb57cd9a50");
		assert.equal(orderArgs.external_call, null);
		assert.equal(orderArgs.give_patch_authority_src.toBase58(), "5cSGMBfJt451RSXPQEMMr7k8T3f9GQjc7uh3MWnaGLRV");
		assert.equal(orderArgs.allowed_cancel_beneficiary_src, null);
		assert.equal(Buffer.from(orderArgs.order_authority_address_dst).toString("hex"), "6f050bb29fcc910891be4f17d3a123cb57cd9a50");
		assert.equal(orderArgs.allowed_taker_dst, null);
	});

	it("can parse create order tx 2", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"3trGBaFd7xvHNe5varLXrcn7MdQM3GryMzTi2U1UeDwnf5hQQqtdN3ymbShgkebMqDfxN1ybyXyNebzdWkckyqSC",
			false,
		);

		const createOrder = parsed?.find((pix) => pix.name === "create_order_with_nonce") as ParsedIdlInstruction<DlnSrc, "create_order_with_nonce">;
		assert.equal(createOrder.accounts[0].name, "maker");
		assert.equal(createOrder.accounts[0].pubkey.toBase58(), "DdAtZ15yF3rHdfdp3uQ94H8M7icYYD2kDTWBB7jC59um");

		assert.equal(createOrder.accounts[1].pubkey.toBase58(), "HJEPgYkbqjetrphNHG2W33SjG9mB4PrXorW358MzfggY");

		assert.equal(createOrder.accounts[2].pubkey.toBase58(), "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

		assert.equal(createOrder.accounts[3].pubkey.toBase58(), "73KVdHAt8yT9xqqnjwu1FjskfSaP7KBC6t31R9TVLhzH");

		assert.equal(createOrder.accounts[4].pubkey.toBase58(), "E1wEhZUxu4EpiMGduUuNhvt6LTcXf7jHj96a514PQwH2");

		assert.equal(createOrder.accounts[5].pubkey.toBase58(), "ARKa7fp4p9PL5joR4AeiP3sX6DmMeq1ansaa2K9bMWJX");

		assert.equal(createOrder.accounts[6].pubkey.toBase58(), "G3iqXb9rmhTGghHZ4bFsb9NxhxmYP1b3LeXLRL4TufjF");

		assert.equal(createOrder.accounts[7].pubkey.toBase58(), "HXpoZHCnCqgPbFABpBSQ83gRwyLqs6Asm2sJ29hcX4MW");

		assert.equal(createOrder.accounts[8].pubkey.toBase58(), "9yfN3qv6tKxhniWcrQi7bP1kZgXmdd4dLm84rostKvQG");

		assert.equal(createOrder.accounts[9].pubkey.toBase58(), "11111111111111111111111111111111");

		assert.equal(createOrder.accounts[10].pubkey.toBase58(), "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

		assert.equal(createOrder.accounts[11].pubkey.toBase58(), "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

		assert.equal(createOrder.name, "create_order_with_nonce");
		assert.equal(createOrder.args.referral_code, 30830);
		assert.equal(BigInt(createOrder.args.nonce.toString()), 1755793048246);

		const orderArgs = createOrder.args.order_args;

		// assert.equal(orderArgs.allowed_cancel_beneficiary_src, null);
		// assert.equal(orderArgs.allowed_taker_dst, null);
		assert.equal(orderArgs.give_original_amount.toString(), "105000001");

		assert.equal(parseInt(Buffer.from(orderArgs.take.amount).toString("hex"), 16), 23836042820738136);
		assert.equal(parseInt(Buffer.from(orderArgs.take.chain_id).toString("hex"), 16), 8453);
		assert.equal(Buffer.from(orderArgs.take.token_address).toString("hex"), "0000000000000000000000000000000000000000");

		assert.equal(Buffer.from(orderArgs.receiver_dst).toString("hex"), "2f9d37323b5f2279ee512e86fcd98196bbdd47e5");
		assert.equal(orderArgs.external_call, null);
		assert.equal(orderArgs.give_patch_authority_src.toBase58(), "DdAtZ15yF3rHdfdp3uQ94H8M7icYYD2kDTWBB7jC59um");
		assert.equal(orderArgs.allowed_cancel_beneficiary_src?.toBase58(), "DdAtZ15yF3rHdfdp3uQ94H8M7icYYD2kDTWBB7jC59um");
		assert.equal(Buffer.from(orderArgs.order_authority_address_dst).toString("hex"), "0746e7e4d15f30885616b4ac3d274393354e80c0");
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		assert.equal(Buffer.from(orderArgs.allowed_taker_dst!).toString("hex"), "555ce236c0220695b68341bc48c68d52210cc35b");
	});

	it("can parse claim unlock tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"peaSXGKx24ff3yev4Z9JTgQ21iUxmXtJCykypeAWupZ9PTgVWurWxHTuApnNr3NQV4FmqzBNdrFhcC2d3pJ75aR",
			true,
		);

		const claimUnlock = parsed?.find((pix) => pix.name === "claim_unlock") as ParsedIdlInstruction<DlnSrc, "claim_unlock">;

		assert.equal(claimUnlock.accounts[0].pubkey.toBase58(), "9YxCG8ZxHffxt8dezxx3CGtuNLAhHk1kVgmRBDTqX2aD");

		assert.equal(claimUnlock.accounts[1].pubkey.toBase58(), "FQFjXtotHr2LwPm5rU4kYb7joD6zorArprf99YS4MsVK");

		assert.equal(claimUnlock.accounts[2].pubkey.toBase58(), "HJEPgYkbqjetrphNHG2W33SjG9mB4PrXorW358MzfggY");

		assert.equal(claimUnlock.accounts[3].pubkey.toBase58(), "6p6RCUtoXDvrwqx9AJmyM3wCFd9nDvMaLs3Fwif6QeXH");

		assert.equal(claimUnlock.accounts[4].pubkey.toBase58(), "9yfN3qv6tKxhniWcrQi7bP1kZgXmdd4dLm84rostKvQG");

		assert.equal(claimUnlock.accounts[5].pubkey.toBase58(), "Sysvar1nstructions1111111111111111111111111");

		assert.equal(claimUnlock.accounts[6].pubkey.toBase58(), "3qgbarYyXjLvwEwkjnGfZqEiRgL4rzmXp2YnA7CrSP4s");

		assert.equal(claimUnlock.accounts[7].pubkey.toBase58(), "DYU4yerNMB48M8vJPGCgdhduosocF6HgYFtHfVrGJ9wt");

		assert.equal(claimUnlock.accounts[8].pubkey.toBase58(), "2snHHreXbpJ7UwZxPe37gnUNf7Wx7wv6UKDSR2JckKuS");

		assert.equal(claimUnlock.accounts[9].pubkey.toBase58(), "ujn1JAXjTZupz56Z27sVCXrH6JM7TVAFdT24N87jt6U");

		assert.equal(claimUnlock.accounts[10].pubkey.toBase58(), "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

		assert.equal(claimUnlock.accounts[11].pubkey.toBase58(), "E1wEhZUxu4EpiMGduUuNhvt6LTcXf7jHj96a514PQwH2");

		assert.equal(claimUnlock.accounts[12].pubkey.toBase58(), "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

		assert.equal(claimUnlock.name, "claim_unlock");

		assert.equal(Buffer.from(claimUnlock.args.order_id).toString("hex"), "0dd21976f046b4f6a1e56a0a00c96da868dcf80f40af79a43ffa662b3420a258");
	});
});
