import { hexToUint8Array } from "@mayanfinance/swap-sdk";
import { ethers } from "ethers";
import BN from "bn.js";

import { ParsedIdlArgs } from "../../interfaces";
import { idl } from "../../../src";

import { tryNativeToHexString } from "./buffer";

export function decodeInitOrderParams(data: Buffer): ParsedIdlArgs<idl.MayanIdl, "initOrder"> {
	let offset = 7;

	const amountInMin = data.readBigUInt64LE(offset);
	offset += 8;

	const nativeInput = data.readUInt8(offset) !== 0;
	offset += 1;

	const feeSubmit = data.readBigUInt64LE(offset);
	offset += 8;

	const addrDest = data.slice(offset, offset + 32);
	offset += 32;

	const chainDest = data.readUInt16LE(offset);
	offset += 2;

	const tokenOut = data.slice(offset, offset + 32);
	offset += 32;

	const amountOutMin = data.readBigUInt64LE(offset);
	offset += 8;

	const gasDrop = data.readBigUInt64LE(offset);
	offset += 8;

	const feeCancel = data.readBigUInt64LE(offset);
	offset += 8;

	const feeRefund = data.readBigUInt64LE(offset);
	offset += 8;

	const deadline = data.readBigUInt64LE(offset);
	offset += 8;

	const addrRef = data.slice(offset, offset + 32);
	offset += 32;

	const feeRateRef = data.readUInt8(offset);
	offset += 1;

	const feeRateMayan = data.readUInt8(offset);
	offset += 1;

	const auctionMode = data.readUInt8(offset);
	offset += 1;

	const keyRnd = data.slice(offset, offset + 32);
	offset += 32;

	// const orderHash = reconstructOrderHash(
	// 	"Br9WyhaWG4sxkQVExnq9cQMTKKijWmFNNPED4SuLASBb",
	// 	CHAIN_ID_SOLANA,
	// 	"7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
	// 	chainDest,
	// 	tokenOut,
	// 	amountOutMin,
	// 	gasDrop,
	// 	feeCancel,
	// 	feeRefund,
	// 	Number(deadline),
	// 	addrDest,
	// 	addrRef,
	// 	feeRateRef,
	// 	feeRateMayan,
	// 	auctionMode,
	// 	keyRnd,
	// );

	return {
		params: {
			amountInMin: new BN(amountInMin.toString()),
			nativeInput,
			feeSubmit: new BN(feeSubmit.toString()),
			addrDest: Array.from(addrDest),
			chainDest,
			tokenOut: Array.from(tokenOut),
			amountOutMin: new BN(amountOutMin.toString()),
			gasDrop: new BN(gasDrop.toString()),
			feeCancel: new BN(feeCancel.toString()),
			feeRefund: new BN(feeRefund.toString()),
			deadline: new BN(deadline.toString()),
			addrRef: Array.from(addrRef),
			feeRateRef,
			feeRateMayan,
			auctionMode,
			keyRnd: Array.from(keyRnd),
		},
	};
}

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
