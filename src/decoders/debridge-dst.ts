import { PublicKey, TransactionInstruction } from "@solana/web3.js";

import { ParsedInstruction, ParsedIdlInstruction } from "../interfaces";
import { DeBridgeDestinationIdl } from "../programs";

import { decodeFulfillOrderArgs } from "./debridge/decodeOrderArgs";

export enum DeBridgeDestinationInstruction {
	FULFILL_ORDER = 61,
}

function decodeDeBridgeDestinationInstruction(instruction: TransactionInstruction): ParsedInstruction<DeBridgeDestinationIdl> {
	const instructionSelector = instruction.data[0];
	const remainingData = instruction.data.slice(1);

	switch (instructionSelector) {
		case DeBridgeDestinationInstruction.FULFILL_ORDER: {
			return {
				name: "fulfill_order",
				programId: instruction.programId,
				accounts: [
					{ name: "take_order_state", pubkey: instruction.keys[0].pubkey, isWritable: true, isSigner: false },
					{ name: "taker", pubkey: instruction.keys[1].pubkey, isWritable: true, isSigner: true },
					{ name: "taker_wallet", pubkey: instruction.keys[2].pubkey, isWritable: true, isSigner: false },
					{ name: "receiver_dst", pubkey: instruction.keys[3].pubkey, isWritable: false, isSigner: false },
					{ name: "authorized_src_contract", pubkey: instruction.keys[4].pubkey, isWritable: false, isSigner: false },
					{ name: "take_order_patch", pubkey: instruction.keys[5].pubkey, isWritable: false, isSigner: false },
					{ name: "spl_token_program", pubkey: instruction.keys[6].pubkey, isWritable: false, isSigner: false },
					{ name: "system_program", pubkey: instruction.keys[7].pubkey, isWritable: false, isSigner: false },
				],
				args: {
					unvalidated_order: decodeFulfillOrderArgs(remainingData),
					order_id: Array.from(remainingData.slice(remainingData.length - 65, remainingData.length - 33)), // 64 bytes from unlock_authority
					unlock_authority: new PublicKey(remainingData.slice(remainingData.length - 32)),
				},
			} as ParsedIdlInstruction<DeBridgeDestinationIdl, "fulfill_order">;
		}
		// Keep other cases as is, or refactor similarly if needed
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
	} as unknown as ParsedIdlInstruction<DeBridgeDestinationIdl, "fulfill_order">;
}

export { decodeDeBridgeDestinationInstruction };
