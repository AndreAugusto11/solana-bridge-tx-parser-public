import { BN } from "bn.js";

import { ParsedIdlArgs } from "../../interfaces";
import { idl } from "../../../src";

export function decodeInitOrderParams(data: Buffer, trader: string, token: string): ParsedIdlArgs<idl.MayanSwiftIdl, "initOrder"> {
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
