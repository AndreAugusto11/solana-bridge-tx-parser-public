import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";
import { zeroPadValue } from "ethers";

export const CHAIN_ID_UNSET = 0;
export const CHAIN_ID_SOLANA = 1;
export const CHAIN_ID_ETH = 2;
export const CHAIN_ID_BSC = 4;
export const CHAIN_ID_POLYGON = 5;
export const CHAIN_ID_AVAX = 6;
export const CHAIN_ID_ARBITRUM = 23;
export const CHAIN_ID_OPTIMISM = 24;
export const CHAIN_ID_BASE = 30;
export const CHAIN_ID_UNICHAIN = 44;
export const CHAIN_ID_LINEA = 38;

export const hexToUint8Array = (h: string): Uint8Array => {
	if (h.startsWith("0x")) h = h.slice(2);

	return new Uint8Array(Buffer.from(h, "hex"));
};

/**
 *
 * Convert an address in a chain's native representation into a 32-byte hex string
 * understood by wormhole.
 *
 * @throws if address is a malformed string for the given chain id
 */
export const tryNativeToHexString = (address: string, chainId: number): string => {
	if (chainId !== CHAIN_ID_SOLANA) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
		return zeroPadValue(address, 32);
	} else if (chainId === CHAIN_ID_SOLANA) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
		return zeroPadValue(new PublicKey(address).toBytes(), 32);
	} else {
		throw Error("Don't know how to convert address from chain " + String(chainId));
	}
};

/**
 *
 * Convert an address in a chain's native representation into a 32-byte array
 * understood by wormhole.
 *
 * @throws if address is a malformed string for the given chain id
 */
export function tryNativeToUint8Array(address: string, chainId: number): Uint8Array {
	return hexToUint8Array(tryNativeToHexString(address, chainId));
}

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
