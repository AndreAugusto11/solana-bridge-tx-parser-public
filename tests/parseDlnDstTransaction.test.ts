/* eslint-disable no-console */
import "mocha";
import assert from "assert";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { SolanaParser } from "../src";
import { ParsedIdlEvent, ParsedIdlInstruction } from "../src/interfaces";
import { DlnDst } from "../src/programs/debridge-dst";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([]);

describe("Test parse transaction", () => {
	it("can parse fulfill order tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"4c21MfB6wX5jWWJDrFNpjHXhMZpWp4yBQqVZPxjT8GYeBzdKDfxuhKcHufB2XtrxMxTryfEW1Jg6d558YGUQLb8i",
			true,
		);

		const fulfillOrder = parsed?.find((pix) => pix.name === "fulfill_order") as ParsedIdlInstruction<DlnDst, "fulfill_order">;

		assert.equal(fulfillOrder.accounts[0].name, "take_order_state");
		assert.equal(fulfillOrder.accounts[0].pubkey.toBase58(), "6SX2pceyJF4RW5nZ8U6cndpDvDJ9AH9QSrs7TfRRoS65");

		assert.equal(fulfillOrder.accounts[1].name, "taker");
		assert.equal(fulfillOrder.accounts[1].pubkey.toBase58(), "2snHHreXbpJ7UwZxPe37gnUNf7Wx7wv6UKDSR2JckKuS");

		assert.equal(fulfillOrder.accounts[2].name, "taker_wallet");
		assert.equal(fulfillOrder.accounts[2].pubkey.toBase58(), "DYU4yerNMB48M8vJPGCgdhduosocF6HgYFtHfVrGJ9wt");

		assert.equal(fulfillOrder.accounts[3].name, "receiver_dst");
		assert.equal(fulfillOrder.accounts[3].pubkey.toBase58(), "Bgp3fzRERV6kmEfEFEbSgaFhLmRAJZDK5BxJNduoyVVN");

		assert.equal(fulfillOrder.accounts[4].name, "authorized_src_contract");
		assert.equal(fulfillOrder.accounts[4].pubkey.toBase58(), "GogzZVjiCDWBitry7gtYGG7Pef9mr4CNbM4p4ooRpueQ");

		assert.equal(fulfillOrder.accounts[5].name, "take_order_patch");
		assert.equal(fulfillOrder.accounts[5].pubkey.toBase58(), "9Hyj8XFjXzfzme4zDrxistgHMKZDbKxyJtPiyv5GpBy8");

		assert.equal(fulfillOrder.accounts[6].name, "spl_token_program");
		assert.equal(fulfillOrder.accounts[6].pubkey.toBase58(), "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

		assert.equal(fulfillOrder.accounts[7].name, "system_program");
		assert.equal(fulfillOrder.accounts[7].pubkey.toBase58(), "11111111111111111111111111111111");

		assert.equal(fulfillOrder.args.unlock_authority?.toBase58(), "2snHHreXbpJ7UwZxPe37gnUNf7Wx7wv6UKDSR2JckKuS");
		assert.equal(Buffer.from(fulfillOrder.args.order_id).toString("hex"), "6c8c1aae1439d4611dd12ad7ed5644752d69ef78715bb2bd205ce2d38dfe71e6");

		const unvalidatedOrder = fulfillOrder.args.unvalidated_order;

		assert.equal(BigInt(unvalidatedOrder.maker_order_nonce.toString()), "1755792338821");
		assert.equal(Buffer.from(unvalidatedOrder.maker_src).toString("hex"), "f972bc1f27853ee904dd800e8422deebd582ea14");

		assert.equal(parseInt(Buffer.from(unvalidatedOrder.give.amount).toString("hex"), 16), 133739146);
		assert.equal(parseInt(Buffer.from(unvalidatedOrder.give.chain_id).toString("hex"), 16), 1);
		assert.equal(Buffer.from(unvalidatedOrder.give.token_address).toString("hex"), "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

		assert.equal(parseInt(Buffer.from(unvalidatedOrder.take.amount).toString("hex"), 16), 130209132);
		assert.equal(parseInt(Buffer.from(unvalidatedOrder.take.chain_id).toString("hex"), 16), 7565164);
		assert.equal(new PublicKey(Buffer.from(unvalidatedOrder.take.token_address)).toBase58(), "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

		assert.equal(new PublicKey(Buffer.from(unvalidatedOrder.receiver_dst)).toBase58(), "H5PVX8yJwJRqs6PbbZQtmYrRCVUGaGwgbReDRHYCW6t7");
		assert.equal(Buffer.from(unvalidatedOrder.give_patch_authority_src).toString("hex"), "f972bc1f27853ee904dd800e8422deebd582ea14");
		assert.equal(new PublicKey(Buffer.from(unvalidatedOrder.order_authority_address_dst)).toBase58(), "CjP5XNYCCkDTkvRJQ8knTYTKT6EAqTTxm8A6eM899yFH");
		assert.equal(
			unvalidatedOrder.allowed_taker_dst ? new PublicKey(Buffer.from(unvalidatedOrder.allowed_taker_dst)).toBase58() : null,
			"2snHHreXbpJ7UwZxPe37gnUNf7Wx7wv6UKDSR2JckKuS",
		);
		assert.equal(
			unvalidatedOrder.allowed_cancel_beneficiary_src ? Buffer.from(unvalidatedOrder.allowed_cancel_beneficiary_src).toString("hex") : null,
			"f972bc1f27853ee904dd800e8422deebd582ea14",
		);
	});
});
