import { TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";

import { ParsedInstruction, ParsedIdlInstruction } from "../interfaces";
import { MayanSwiftAuction } from "../programs/swift.auction.program";

import { decodeOrderInfo } from "./mayan/decodeOrderInfo";

export enum MayanSwiftAuctionInstruction {
	BID = 199,
	POST_AUCTION = 62,
	POST_AUCTION_OLD = 82,
	CLOSE_AUCTION = 225,
}

function decodeMayanSwiftAuctionInstruction(instruction: TransactionInstruction): ParsedInstruction<MayanSwiftAuction> {
	const instructionSelector = instruction.data[0];
	const remainingData = instruction.data.slice(1);

	let parsed: ParsedIdlInstruction<MayanSwiftAuction> | null;

	switch (instructionSelector) {
		case MayanSwiftAuctionInstruction.BID:
			parsed = decodeBidInstruction(instruction, remainingData);
			break;

		case MayanSwiftAuctionInstruction.POST_AUCTION:
			parsed = decodePostAuctionInstruction(instruction, remainingData);
			break;

		case MayanSwiftAuctionInstruction.CLOSE_AUCTION:
			parsed = decodeCloseAuctionInstruction(instruction);
			break;

		default: {
			parsed = null;
		}
	}

	return parsed
		? parsed
		: {
				programId: instruction.programId,
				name: "unknown",
				accounts: instruction.keys,
				args: { unknown: instruction.data },
			};
}

export { decodeMayanSwiftAuctionInstruction };

function decodeBidInstruction(instruction: TransactionInstruction, data: Buffer): ParsedIdlInstruction<MayanSwiftAuction, "bid"> {
	return {
		name: "bid",
		programId: instruction.programId,
		accounts: [
			{ name: "config", pubkey: instruction.keys[0].pubkey },
			{ name: "driver", pubkey: instruction.keys[1].pubkey },
			{ name: "auctionState", pubkey: instruction.keys[2].pubkey },
			{ name: "systemProgram", pubkey: instruction.keys[3].pubkey },
		],
		args: {
			order: decodeOrderInfo(data),
			amountBid: new BN(data.readBigUInt64LE(data.length - 8).toString()),
		},
	} as ParsedIdlInstruction<MayanSwiftAuction, "bid">;
}

function decodePostAuctionInstruction(instruction: TransactionInstruction, data: Buffer): ParsedIdlInstruction<MayanSwiftAuction, "postAuction"> {
	return {
		name: "postAuction",
		programId: instruction.programId,
		accounts: [
			{ name: "auction", pubkey: instruction.keys[0].pubkey },
			{ name: "driver", pubkey: instruction.keys[1].pubkey },
			{ name: "emitter", pubkey: instruction.keys[2].pubkey },
			{ name: "config", pubkey: instruction.keys[3].pubkey },
			{ name: "emitterSequence", pubkey: instruction.keys[4].pubkey },
			{ name: "feeCollector", pubkey: instruction.keys[5].pubkey },
			{ name: "message", pubkey: instruction.keys[6].pubkey },
			{ name: "coreBridgeProgram", pubkey: instruction.keys[7].pubkey },
			{ name: "systemProgram", pubkey: instruction.keys[8].pubkey },
			{ name: "clock", pubkey: instruction.keys[9].pubkey },
			{ name: "rent", pubkey: instruction.keys[10].pubkey },
		],
		args: {
			order: decodeOrderInfo(data),
			foreignDriver: Array.from(data.slice(data.length - 32, data.length)),
		},
	} as ParsedIdlInstruction<MayanSwiftAuction, "postAuction">;
}

function decodeCloseAuctionInstruction(instruction: TransactionInstruction): ParsedIdlInstruction<MayanSwiftAuction, "closeAuction"> {
	return {
		name: "closeAuction",
		programId: instruction.programId,
		accounts: [
			{ name: "auction", pubkey: instruction.keys[0].pubkey },
			{ name: "initializer", pubkey: instruction.keys[1].pubkey },
		],
		args: {},
	} as ParsedIdlInstruction<MayanSwiftAuction, "closeAuction">;
}
