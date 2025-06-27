import { PublicKey, TransactionInstruction } from "@solana/web3.js";

import { ParsedInstruction, ParsedIdlInstruction } from "../interfaces";
import { MayanSwiftIdl } from "../programs";

import { decodeInitOrderParams } from "./mayan/decodeInitOrderParams";
import { decodeOrderInfo } from "./mayan/decodeOrderInfo";

export enum MayanSwiftInstruction {
	REGISTER_ORDER = 92,
	SET_AUCTION_WINNER = 63,
	FULFILL_ORDER = 143,
	SETTLE = 175,
	INIT_ORDER = 32,
	UNLOCK_BATCH = 167,
	UNLOCK = 101,
	REFUND = 10,
}

function decodeMayanSwiftInstruction(instruction: TransactionInstruction): ParsedInstruction<MayanSwiftIdl> {
	const instructionSelector = instruction.data[0]; // First byte is the instruction selector
	const remainingData = instruction.data.slice(1); // Remaining data after the selector

	switch (instructionSelector) {
		case MayanSwiftInstruction.INIT_ORDER: {
			return {
				name: "initOrder",
				programId: instruction.programId,
				accounts: [
					{ name: "trader", pubkey: instruction.keys[0].pubkey },
					{ name: "relayer", pubkey: instruction.keys[1].pubkey },
					{ name: "state", pubkey: instruction.keys[2].pubkey },
					{ name: "stateFromAcc", pubkey: instruction.keys[3].pubkey },
					{ name: "relayerFeeAcc", pubkey: instruction.keys[4].pubkey },
					{ name: "mintFrom", pubkey: instruction.keys[5].pubkey },
					{ name: "feeManagerProgram", pubkey: instruction.keys[6].pubkey },
					{ name: "tokenProgram", pubkey: instruction.keys[7].pubkey },
					{ name: "systemProgram", pubkey: instruction.keys[8].pubkey },
				],
				args: decodeInitOrderParams(
					remainingData,
					instruction.keys[0].pubkey.toBase58(), // trader
					instruction.keys[5].pubkey.toBase58(), // token
				),
			} as ParsedIdlInstruction<MayanSwiftIdl, "initOrder">;
		}
		case MayanSwiftInstruction.UNLOCK_BATCH: {
			return {
				name: "unlockBatch",
				programId: instruction.programId,
				accounts: [
					{ name: "vaaUnlock", pubkey: instruction.keys[0].pubkey },
					{ name: "state", pubkey: instruction.keys[1].pubkey },
					{ name: "stateFromAcc", pubkey: instruction.keys[2].pubkey },
					{ name: "mintFrom", pubkey: instruction.keys[3].pubkey },
					{ name: "driver", pubkey: instruction.keys[4].pubkey },
					{ name: "driverAcc", pubkey: instruction.keys[5].pubkey },
					{ name: "tokenProgram", pubkey: instruction.keys[6].pubkey },
					{ name: "systemProgram", pubkey: instruction.keys[7].pubkey },
				],
				args: {
					index: instruction.data.readInt16LE(1),
				},
			} as ParsedIdlInstruction<MayanSwiftIdl, "unlockBatch">;
		}
		case MayanSwiftInstruction.UNLOCK: {
			return {
				name: "unlock",
				programId: instruction.programId,
				accounts: [
					{ name: "vaaUnlock", pubkey: instruction.keys[0].pubkey },
					{ name: "state", pubkey: instruction.keys[1].pubkey },
					{ name: "stateFromAcc", pubkey: instruction.keys[2].pubkey },
					{ name: "mintFrom", pubkey: instruction.keys[3].pubkey },
					{ name: "driver", pubkey: instruction.keys[4].pubkey },
					{ name: "driverAcc", pubkey: instruction.keys[5].pubkey },
					{ name: "tokenProgram", pubkey: instruction.keys[6].pubkey },
					{ name: "systemProgram", pubkey: instruction.keys[7].pubkey },
				],
				args: {},
			} as ParsedIdlInstruction<MayanSwiftIdl, "unlock">;
		}
		case MayanSwiftInstruction.FULFILL_ORDER: {
			return {
				name: "fulfill",
				programId: instruction.programId,
				accounts: [
					{ name: "state", pubkey: instruction.keys[0].pubkey },
					{ name: "driver", pubkey: instruction.keys[1].pubkey },
					{ name: "stateToAcc", pubkey: instruction.keys[2].pubkey },
					{ name: "mintTo", pubkey: instruction.keys[3].pubkey },
					{ name: "dest", pubkey: instruction.keys[4].pubkey },
					{ name: "systemProgram", pubkey: instruction.keys[5].pubkey },
				],
				args: {
					addrUnlocker: instruction.data.slice(8, 40),
				},
			} as unknown as ParsedIdlInstruction<MayanSwiftIdl, "fulfill">;
		}
		case MayanSwiftInstruction.SETTLE: {
			return {
				name: "settle",
				programId: instruction.programId,
				accounts: [
					{ name: "state", pubkey: instruction.keys[0].pubkey },
					{ name: "stateToAcc", pubkey: instruction.keys[1].pubkey },
					{ name: "relayer", pubkey: instruction.keys[2].pubkey },
					{ name: "mintTo", pubkey: instruction.keys[3].pubkey },
					{ name: "dest", pubkey: instruction.keys[4].pubkey },
					{ name: "referrer", pubkey: instruction.keys[5].pubkey },
					{ name: "feeCollector", pubkey: instruction.keys[6].pubkey },
					{ name: "referrerFeeAcc", pubkey: instruction.keys[7].pubkey },
					{ name: "mayanFeeAcc", pubkey: instruction.keys[8].pubkey },
					{ name: "destAcc", pubkey: instruction.keys[9].pubkey },
					{ name: "tokenProgram", pubkey: instruction.keys[10].pubkey },
					{ name: "systemProgram", pubkey: instruction.keys[11].pubkey },
					{ name: "associatedTokenProgram", pubkey: instruction.keys[12].pubkey },
				],
				args: {},
			} as ParsedIdlInstruction<MayanSwiftIdl, "settle">;
		}
		case MayanSwiftInstruction.SET_AUCTION_WINNER: {
			return {
				name: "setAuctionWinner",
				programId: instruction.programId,
				accounts: [
					{ name: "state", pubkey: instruction.keys[0].pubkey },
					{ name: "auction", pubkey: instruction.keys[1].pubkey },
				],
				args: {
					expectedWinner: new PublicKey(instruction.data.slice(8, 40)),
				},
			} as ParsedIdlInstruction<MayanSwiftIdl, "setAuctionWinner">;
		}
		case MayanSwiftInstruction.REGISTER_ORDER: {
			return {
				name: "registerOrder",
				programId: instruction.programId,
				accounts: [
					{ name: "relayer", pubkey: instruction.keys[0].pubkey },
					{ name: "state", pubkey: instruction.keys[1].pubkey },
					{ name: "systemProgram", pubkey: instruction.keys[2].pubkey },
				],
				args: decodeOrderInfo(remainingData),
			} as ParsedIdlInstruction<MayanSwiftIdl, "registerOrder">;
		}
	}

	return {
		name: "unknown",
		accounts: instruction.keys.map((key) => ({
			name: key.pubkey.toBase58(),
			isSigner: key.isSigner,
			isWritable: key.isWritable,
			pubkey: key.pubkey,
		})),
		args: {},
		programId: instruction.programId,
	} as unknown as ParsedIdlInstruction<MayanSwiftIdl, "refund">;
}

export { decodeMayanSwiftInstruction };
