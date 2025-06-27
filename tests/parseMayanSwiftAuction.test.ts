import "mocha";

import assert from "assert";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { idl, ParsedIdlInstruction, SolanaParser } from "../src";

import { reconstructOrderHash } from "./buffer";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([]);

beforeEach(async () => {
	console.log("----------------------");
	console.log("Waiting for 5 seconds before starting new test because of RPC limits...");
	await new Promise((resolve) => setTimeout(resolve, 5000));
	console.log("----------------------");
});

describe("Test parse transaction", () => {
	it("can parse bid tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"4QPyaZXbQGVhwQagBAeLkaGZKZqrQtw7kfssae7fd3yeH1dPeqTRvf5y98KmHHpERge9APo4qfUiDyN6j8cWDuZm",
			true,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		const bid = parsed?.find((pix) => pix.name === "bid") as ParsedIdlInstruction<idl.MayanSwiftAuctionIdl, "bid">;

		if (!bid || !bid.accounts) {
			console.error("Bid instruction not found in parsed transaction");

			return;
		}

		assert(bid, "Bid instruction not found");
		assert(bid.name === "bid", "Instruction name should be 'bid'");
		assert(bid.accounts, "Accounts should be defined");

		assert(bid.accounts[0].name === "config", "First account should be config");
		assert(bid.accounts[1].name === "driver", "Second account should be driver");
		assert(bid.accounts[2].name === "auctionState", "Third account should be auctionState");
		assert(bid.accounts[3].name === "systemProgram", "Fourth account should be systemProgram");

		assert(bid.accounts[0].pubkey.toBase58() === "93boUvm9QnkHTa5sUGMuFegLaxYsJQVMrNCAz7HojnY5", "Config account pubkey should match");
		assert(bid.accounts[1].pubkey.toBase58() === "GnWFhrfgciKVoqgAqarwWEQ79NuD2LnRd9EEYaB1kUoc", "Driver account pubkey should match");
		assert(bid.accounts[2].pubkey.toBase58() === "4sECnQ7LK4KAm3VYcuf3ERCT738xrraXHwfE9tpPUNkD", "Auction state account pubkey should match");
		assert(bid.accounts[3].pubkey.toBase58() === "11111111111111111111111111111111", "System program account pubkey should match");
		console.log(Number(bid?.args.amountBid));

		assert(Number(bid?.args.amountBid) == 1655996714, "Amount bid should be 1655996714");
		assert(Number(bid.args.order.deadline) == 1748879633, "Order deadline should be 1748879633");
		assert(Number(bid.args.order.feeCancel) == 23817, "Order feeCancel should be 23817");

		const orderHash = reconstructOrderHash(
			`0x${Buffer.from(bid.args.order.trader).toString("hex").slice(24)}`,
			bid.args.order.chainSource,
			`0x${Buffer.from(bid.args.order.tokenIn).toString("hex").slice(24)}`,
			bid.args.order.chainDest,
			new PublicKey(bid.args.order.tokenOut).toBase58(),
			BigInt(bid.args.order.amountOutMin.toString()),
			BigInt(bid.args.order.gasDrop.toString()),
			BigInt(bid.args.order.feeCancel.toString()),
			BigInt(bid.args.order.feeRefund.toString()),
			Number(bid.args.order.deadline),
			new PublicKey(bid.args.order.addrDest).toBase58(),
			new PublicKey(bid.args.order.addrRef).toBase58(),
			bid.args.order.feeRateRef,
			bid.args.order.feeRateMayan,
			bid.args.order.auctionMode,
			Buffer.from(bid.args.order.keyRnd).toString("hex"),
		);

		console.log(`Order hash: ${orderHash}`);
		console.log("Order Hash (hex):", Buffer.from(orderHash).toString("hex"));

		assert(
			Buffer.from(orderHash).toString("hex") === "7ea702feda6f287d1f4a448738ab57e5052a05c62fabd5887bbfe6842c6670f0",
			"Order hash should match expected value",
		);
	});

	// the next test is very weird, the trader is always the same and the tokens are refunded -- not filled in the other blockchain
	// skipping this test for now because it is not useful

	// it("can parse postAuction tx", async () => {
	// 	const parsed = await parser.parseTransactionByHash(
	// 		rpcConnection,
	// 		"2igLpJGKr1bHCBTz4ChqEZyhbKP4urzFwKRTnBnvZnPA5ZQVLG992NzRtEZ8SLZfyPywnsbdWZ9Dq5Vg9hWZGRYi",
	// 		true,
	// 	);

	// 	if (!parsed) {
	// 		console.error("Transaction not found or parsing failed");

	// 		return;
	// 	}

	// 	const postAuction = parsed?.find((pix) => pix.name === "postAuction") as ParsedIdlInstruction<idl.MayanSwiftAuctionIdl, "postAuction">;

	// 	if (!postAuction || !postAuction.accounts) {
	// 		console.error("Bid instruction not found in parsed transaction");

	// 		return;
	// 	}

	// 	assert(postAuction, "postAuction instruction not found");
	// 	assert(postAuction.name === "postAuction", "Instruction name should be 'postAuction'");
	// 	assert(postAuction.accounts, "Accounts should be defined");

	// 	assert(postAuction.accounts[0].name === "auction", "First account should be config");
	// 	assert(postAuction.accounts[1].name === "driver", "Second account should be driver");
	// 	assert(postAuction.accounts[2].name === "emitter", "Third account should be emitter");
	// 	assert(postAuction.accounts[3].name === "config", "Fourth account should be config");
	// 	assert(postAuction.accounts[4].name === "emitterSequence", "Fifth account should be emitterSequence");
	// 	assert(postAuction.accounts[5].name === "feeCollector", "Sixth account should be feeCollector");
	// 	assert(postAuction.accounts[6].name === "message", "Seventh account should be message");
	// 	assert(postAuction.accounts[7].name === "coreBridgeProgram", "Eighth account should be coreBridgeProgram");
	// 	assert(postAuction.accounts[8].name === "systemProgram", "Ninth account should be systemProgram");
	// 	assert(postAuction.accounts[9].name === "clock", "Tenth account should be clock");
	// 	assert(postAuction.accounts[10].name === "rent", "Eleventh account should be rent");

	// 	assert(postAuction.accounts[1].pubkey.toBase58() === "83CUWomXzH75DV11YAevX4vfDjM7Yz2kujvQMFQ4QZhS", "Driver account pubkey should match");

	// 	assert(postAuction.args.order, "Order should be defined");

	// 	console.log(`0x${Buffer.from(postAuction.args.order.tokenIn).toString("hex").slice(24)}`);
	// 	console.log(`0x${Buffer.from(postAuction.args.order.tokenOut).toString("hex").slice(24)}`);
	// 	console.log(`0x${Buffer.from(postAuction.args.order.trader).toString("hex").slice(24)}`);
	// 	console.log(`0x${Buffer.from(postAuction.args.order.addrRef).toString("hex").slice(24)}`);
	// 	console.log(Number(postAuction.args.order.amountOutMin));

	// 	console.log(Buffer.from(postAuction.args.foreignDriver).toString("hex").slice(24));

	// 	const orderHash = reconstructOrderHash(
	// 		`0x${Buffer.from(postAuction.args.order.trader).toString("hex").slice(24)}`,
	// 		postAuction.args.order.chainSource,
	// 		`0x${Buffer.from(postAuction.args.order.tokenIn).toString("hex").slice(24)}`,
	// 		postAuction.args.order.chainDest,
	// 		`0x${Buffer.from(postAuction.args.order.tokenOut).toString("hex").slice(24)}`,
	// 		BigInt(postAuction.args.order.amountOutMin.toString()),
	// 		BigInt(postAuction.args.order.gasDrop.toString()),
	// 		BigInt(postAuction.args.order.feeCancel.toString()),
	// 		BigInt(postAuction.args.order.feeRefund.toString()),
	// 		Number(postAuction.args.order.deadline),
	// 		`0x${Buffer.from(postAuction.args.order.addrDest).toString("hex").slice(24)}`,
	// 		`0x${Buffer.from(postAuction.args.order.addrRef).toString("hex").slice(24)}`,
	// 		postAuction.args.order.feeRateRef,
	// 		postAuction.args.order.feeRateMayan,
	// 		postAuction.args.order.auctionMode,
	// 		Buffer.from(postAuction.args.order.keyRnd).toString("hex"),
	// 	);

	// 	console.log(`Order hash: ${orderHash}`);
	// 	console.log("Order Hash (hex):", Buffer.from(orderHash).toString("hex"));
	// });

	it("can parse closeAuction tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"bu3SGqQYsaU3TA9rV21fCAoQHa2qwNffVN4XLku1Q2RjJENuPHvDBCGXBNQMFLg4oQiH9FZXJrvbxD9zrZFtE81",
			true,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		const closeAuction = parsed?.find((pix) => pix.name === "closeAuction") as ParsedIdlInstruction<idl.MayanSwiftAuctionIdl, "closeAuction">;

		if (!closeAuction || !closeAuction.accounts) {
			console.error("closeAuction instruction not found in parsed transaction");

			return;
		}

		assert(closeAuction, "closeAuction instruction not found");
		assert(closeAuction.name === "closeAuction", "Instruction name should be 'closeAuction'");
		assert(closeAuction.accounts, "Accounts should be defined");

		assert(closeAuction.accounts[0].name === "auction", "First account should be config");
		assert(closeAuction.accounts[1].name === "initializer", "Second account should be driver");
	});
});
