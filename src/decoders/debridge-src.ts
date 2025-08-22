import { PublicKey, TransactionInstruction } from "@solana/web3.js";

import { ParsedInstruction, ParsedIdlInstruction } from "../interfaces";
import { DeBridgeSourceIdl } from "../programs";

import { decodeCreateOrderArgs } from "./debridge/decodeOrderArgs";

export enum DeBridgeSourceInstruction {
	CREATE_ORDER_WITH_NONCE = 130,
	CLAIM_UNLOCK = 89,
}

function decodeDeBridgeSourceInstruction(instruction: TransactionInstruction): ParsedInstruction<DeBridgeSourceIdl> {
	const instructionSelector = instruction.data[0]; // First byte is the instruction selector
	const remainingData = instruction.data.slice(1); // Remaining data after the selector

	switch (instructionSelector) {
		case DeBridgeSourceInstruction.CREATE_ORDER_WITH_NONCE: {
			return {
				name: "create_order_with_nonce",
				programId: instruction.programId,
				accounts: [
					{ name: "maker", pubkey: instruction.keys[0].pubkey },
					{ name: "state", pubkey: instruction.keys[1].pubkey },
					{ name: "token_mint", pubkey: instruction.keys[2].pubkey },
					{ name: "give_order_state", pubkey: instruction.keys[3].pubkey },
					{ name: "authorized_native_sender", pubkey: instruction.keys[4].pubkey },
					{ name: "maker_wallet", pubkey: instruction.keys[5].pubkey },
					{ name: "give_order_wallet", pubkey: instruction.keys[6].pubkey },
					{ name: "nonce_master", pubkey: instruction.keys[7].pubkey },
					{ name: "fee_ledger_wallet", pubkey: instruction.keys[8].pubkey },
					{ name: "system_program", pubkey: instruction.keys[9].pubkey },
					{ name: "spl_token_program", pubkey: instruction.keys[10].pubkey },
					{ name: "associated_spl_token_program", pubkey: instruction.keys[11].pubkey },
				],
				args: decodeCreateOrderArgs(remainingData),
			} as ParsedIdlInstruction<DeBridgeSourceIdl, "create_order_with_nonce">;
		}
		case DeBridgeSourceInstruction.CLAIM_UNLOCK: {
			return {
				name: "claim_unlock",
				programId: instruction.programId,
				accounts: [
					{ name: "submission", pubkey: instruction.keys[0].pubkey },
					{ name: "submission_authority", pubkey: instruction.keys[1].pubkey, isWritable: true },
					{ name: "state", pubkey: instruction.keys[2].pubkey, isWritable: true },
					{ name: "fee_ledger", pubkey: instruction.keys[3].pubkey, isWritable: true },
					{ name: "fee_ledger_wallet", pubkey: instruction.keys[4].pubkey, isWritable: true },
					{ name: "instructions", pubkey: instruction.keys[5].pubkey },
					{ name: "give_order_state", pubkey: instruction.keys[6].pubkey, isWritable: true },
					{ name: "action_beneficiary_wallet", pubkey: instruction.keys[7].pubkey, isWritable: true },
					{ name: "action_beneficiary", pubkey: instruction.keys[8].pubkey, isWritable: true },
					{ name: "give_order_wallet", pubkey: instruction.keys[9].pubkey, isWritable: true },
					{ name: "token_mint", pubkey: instruction.keys[10].pubkey },
					{ name: "authorized_native_sender", pubkey: instruction.keys[11].pubkey },
					{ name: "spl_token_program", pubkey: instruction.keys[12].pubkey },
				],
				args: {
					order_id: Array.from(remainingData.slice(remainingData.length - 32)),
				},
			} as ParsedIdlInstruction<DeBridgeSourceIdl, "claim_unlock">;
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
	} as unknown as ParsedIdlInstruction<DeBridgeSourceIdl, "create_order_with_nonce">;
}

export { decodeDeBridgeSourceInstruction };
