/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
import "mocha";
import assert from "assert";

import { hexToUint8Array } from "@mayanfinance/swap-sdk";
import { ethers } from "ethers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import { ParsedAccount, ParsedIdlInstruction, SolanaParser, idl } from "../src";

import { tryNativeToHexString } from "./buffer";
import { CHAIN_ID_SOLANA } from "./buffer";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([]);

function stringifyAccount(account: ParsedAccount) {
	return `${account.name || "unknown"} @ ${account.pubkey.toBase58()}`;
}

beforeEach(async () => {
	console.log("----------------------");
	console.log("Waiting for 5 seconds before starting new test...");
	await new Promise((resolve) => setTimeout(resolve, 5000));
	console.log("----------------------");
});

describe("Test parse transaction", () => {
	it("can parse initOrder tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"5dYcKoFLzUT6ffkVt5buWCxJGtDLfRu8xvRpoZDUanJ64VUPicSWsyc8Gr3hBsfUiBRgniaEPwbTwEUuL8gPSXuX",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		// we can find instruction by name
		const order = parsed?.find((pix) => pix.name === "initOrder") as ParsedIdlInstruction<idl.MayanSwiftIdl, "initOrder">;

		assert(order, "Order instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${order?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${order?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, order.args);

		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const trader = `${order.accounts.find((acc) => acc.name === "trader")?.pubkey.toBase58()}`;
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const tokenFrom = `${order.accounts.find((acc) => acc.name === "mintFrom")?.pubkey.toBase58()}`;

		assert(trader, "Trader account not found");
		assert(tokenFrom, "Token from account not found");

		const orderHash = reconstructOrderHash(
			trader,
			CHAIN_ID_SOLANA,
			tokenFrom,
			order.args.params.chainDest,
			`0x${Buffer.from(order.args.params.tokenOut).toString("hex").slice(24)}`,
			BigInt(order.args.params.amountOutMin.toString()),
			BigInt(order.args.params.gasDrop.toString()),
			BigInt(order.args.params.feeCancel.toString()),
			BigInt(order.args.params.feeRefund.toString()),
			Number(order.args.params.deadline),
			`0x${Buffer.from(order.args.params.addrDest).toString("hex").slice(24)}`,
			`0x${Buffer.from(order.args.params.addrRef).toString("hex").slice(24)}`,
			order.args.params.feeRateRef,
			order.args.params.feeRateMayan,
			order.args.params.auctionMode,
			Buffer.from(order.args.params.keyRnd).toString("hex"),
		);

		console.log("Order Hash:", orderHash);
		console.log("Order Hash (hex):", Buffer.from(orderHash).toString("hex"));

		assert(Buffer.from(orderHash).toString("hex") === "69c102b971fa4758450865d6741c961c0e73d8246a7fb11709e4970bced9777b", "Order hash is not valid");

		console.log("--- end output ---");
	});

	it("can parse unlockBatch tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"3rEHm4akHVRFqTwMeh5HBYRK15UA8aYqD1XTigQmhKPQioGLweHetM1PeAX6DXFgQfF64jEf6h8x3TcRtyYgn27h",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		console.log("Parsed transaction:", parsed);

		// we can find instruction by name
		const unlockBatch = parsed?.find((pix) => pix.name === "unlockBatch") as ParsedIdlInstruction<idl.MayanSwiftIdl, "unlockBatch">;

		assert(unlockBatch, "UnlockBatch instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${unlockBatch?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${unlockBatch?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, unlockBatch.args);
	});

	it("can parse settle tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"2J8gET123tncwpgsCt4BJPMLFVzNzsZhc5Y6RKdA6VG82NuJXy7tTrTMjg2SAz7brCkiQkhGSrZqKNoQ6YkNBA4P",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		// we can find instruction by name
		const settle = parsed?.find((pix) => pix.name === "settle") as ParsedIdlInstruction<idl.MayanSwiftIdl, "settle">;

		assert(settle, "settle instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${settle?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${settle?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, settle.args);
	});

	it("can parse fulfill tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"5nmo9fdEBXDH4ukMvgZM9VJMXaYyxEpYMLWfsN11zvnWrBy3xwyVvjYefK7qWGxupb4WFBjZPKyyxFEibNqxaTCB",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		// we can find instruction by name
		const fulfill = parsed?.find((pix) => pix.name === "fulfill") as ParsedIdlInstruction<idl.MayanSwiftIdl, "fulfill">;

		assert(fulfill, "fulfill instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${fulfill?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${fulfill?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, fulfill.args);

		console.log("Fulfill address:", Buffer.from(fulfill.args.addrUnlocker).toString("hex"));

		assert(
			Buffer.from(fulfill.args.addrUnlocker).toString("hex") === "000000000000000000000000cbb0cb4492afbcd9963441cc6aea50f35807ff96",
			"Fulfill address is not valid",
		);
	});

	it("can parse setAuctionWinner tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"4wX4pjPsU87rkFjh8o8NJLzkNFKDN9ofAyH5YouPZ5vKzLueyiToZRyqTjczgrzxb3yVSj3vEnb2cmLy4Rahz4h6",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		// we can find instruction by name
		const auctionWinner = parsed?.find((pix) => pix.name === "setAuctionWinner") as ParsedIdlInstruction<idl.MayanSwiftIdl, "setAuctionWinner">;

		assert(auctionWinner, "setAuctionWinner instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${auctionWinner?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${auctionWinner?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, auctionWinner.args);

		console.log("AuctionWinner address:", auctionWinner.args.expectedWinner.toBase58());

		assert(auctionWinner.args.expectedWinner.toBase58() === "GnWFhrfgciKVoqgAqarwWEQ79NuD2LnRd9EEYaB1kUoc", "AuctionWinner address is not valid");
	});

	it("can parse RegisterOrder tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"4wX4pjPsU87rkFjh8o8NJLzkNFKDN9ofAyH5YouPZ5vKzLueyiToZRyqTjczgrzxb3yVSj3vEnb2cmLy4Rahz4h6",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		// we can find instruction by name
		const registerOrder = parsed?.find((pix) => pix.name === "registerOrder") as ParsedIdlInstruction<idl.MayanSwiftIdl, "registerOrder">;

		assert(registerOrder, "registerOrder instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${registerOrder?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${registerOrder?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, registerOrder.args);

		const relayer = registerOrder.accounts.find((acc) => acc.name === "relayer")?.pubkey.toBase58();

		const trader = `0x${Buffer.from(registerOrder.args.args.trader).toString("hex").slice(24)}`;

		assert(relayer == "GnWFhrfgciKVoqgAqarwWEQ79NuD2LnRd9EEYaB1kUoc", "Relayer account not found");

		assert(trader === "0xf8b60511e38e60a5ed5b6d3618d0ce5f44b64020", "Trader address is not valid");

		assert(registerOrder.args.args.deadline.toNumber() === 1750713461, "Deadline is incorrect");

		const orderHash = reconstructOrderHash(
			trader,
			registerOrder.args.args.chainSource,
			`0x${Buffer.from(registerOrder.args.args.tokenIn).toString("hex").slice(24)}`,
			registerOrder.args.args.chainDest,
			new PublicKey(registerOrder.args.args.tokenOut).toBase58(),
			BigInt(registerOrder.args.args.amountOutMin.toString()),
			BigInt(registerOrder.args.args.gasDrop.toString()),
			BigInt(registerOrder.args.args.feeCancel.toString()),
			BigInt(registerOrder.args.args.feeRefund.toString()),
			Number(registerOrder.args.args.deadline),
			new PublicKey(registerOrder.args.args.addrDest).toBase58(),
			new PublicKey(registerOrder.args.args.addrRef).toBase58(),
			registerOrder.args.args.feeRateRef,
			registerOrder.args.args.feeRateMayan,
			registerOrder.args.args.auctionMode,
			Buffer.from(registerOrder.args.args.keyRnd).toString("hex"),
		);

		console.log("Order Hash:", orderHash);
		console.log("Order Hash (hex):", Buffer.from(orderHash).toString("hex"));

		assert(Buffer.from(orderHash).toString("hex") === "5dc4be321450f703726e552f5767a2fef88d7b183396ac74108579f160440716", "Order hash is not valid");

		console.log("--- end output ---");
	});

	it("can parse unlock tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"3WeNhkDuVMCkpo2bFRebyQcxqLi3vQCTPLzVcc7yeNwSKLjSKisGHM3desqUEG7iuUvSxMsUMpUQk1PebUBGWnUR",
			false,
		);

		if (!parsed) {
			console.error("Transaction not found or parsing failed");

			return;
		}

		// we can find instruction by name
		const unlock = parsed?.find((pix) => pix.name === "unlock") as ParsedIdlInstruction<idl.MayanSwiftIdl, "unlock">;

		assert(unlock, "unlock instruction not found");

		console.log("--- test output ---");

		console.log(`Parsed instruction name: ${unlock?.name}`);
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`Accounts: ${unlock?.accounts.map((account) => stringifyAccount(account))}`);
		console.log(`Data:`, unlock.args);

		assert(unlock.accounts[2].pubkey.toBase58() === "Bau7vceq6c4FgQ9yxtmymnnBV2fWpHeZZuRaVaEf7yMC", "State account is not valid");
		assert(unlock.accounts[3].pubkey.toBase58() === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Mint account is not valid");
	});
});

// SOME USEFUL UTILS FUNCTION

export function reconstructOrderHash(
	trader: string,
	srcChainId: number,
	tokenIn: string,
	destChainId: number,
	tokenOut: string,
	minAmountOut64: bigint,
	gasDrop64: bigint,
	refundFeeDest64: bigint,
	refundFeeSrc64: bigint,
	deadline: number,
	destAddr: string,
	referrerAddr: string,
	referrerBps: number,
	mayanBps: number,
	auctionMode: number,
	random: string,
): Buffer {
	const writeBuffer = Buffer.alloc(239);
	let offset = 0;

	const trader32 = Buffer.from(tryNativeToUint8Array(trader, srcChainId));
	writeBuffer.set(trader32, offset);
	offset += 32;

	writeBuffer.writeUInt16BE(srcChainId, offset);
	offset += 2;

	const tokenIn32 = Buffer.from(tryNativeToUint8Array(tokenIn, srcChainId));
	writeBuffer.set(tokenIn32, offset);
	offset += 32;

	const destinationAddress32 = Buffer.from(tryNativeToUint8Array(destAddr, destChainId));
	writeBuffer.set(destinationAddress32, offset);
	offset += 32;

	writeBuffer.writeUInt16BE(destChainId, offset);
	offset += 2;

	const tokenOut32 = Buffer.from(tryNativeToUint8Array(tokenOut, destChainId));
	writeBuffer.set(tokenOut32, offset);
	offset += 32;

	writeBuffer.writeBigUInt64BE(minAmountOut64, offset);
	offset += 8;

	writeBuffer.writeBigUInt64BE(gasDrop64, offset);
	offset += 8;

	writeBuffer.writeBigUInt64BE(refundFeeDest64, offset);
	offset += 8;

	writeBuffer.writeBigUInt64BE(refundFeeSrc64, offset);
	offset += 8;

	const deadline64 = BigInt(deadline);
	writeBuffer.writeBigUInt64BE(deadline64, offset);
	offset += 8;

	const referrerAddress32 = Buffer.from(tryNativeToUint8Array(referrerAddr, destChainId));
	writeBuffer.set(referrerAddress32, offset);
	offset += 32;

	writeBuffer.writeUInt8(referrerBps, offset);
	offset += 1;

	writeBuffer.writeUInt8(mayanBps, offset);
	offset += 1;

	writeBuffer.writeUInt8(auctionMode, offset);
	offset += 1;

	const randomKey32 = Buffer.from(hexToUint8Array(random));
	writeBuffer.set(randomKey32, offset);
	offset += 32;

	if (offset !== 239) {
		throw new Error("Invalid offset");
	}

	const orderHash = ethers.keccak256(writeBuffer);

	return Buffer.from(hexToUint8Array(orderHash));
}

export function tryNativeToUint8Array(address: string, chainId: number): Uint8Array {
	return hexToUint8Array(tryNativeToHexString(address, chainId));
}
