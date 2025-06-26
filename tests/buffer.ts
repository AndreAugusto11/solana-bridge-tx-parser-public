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
