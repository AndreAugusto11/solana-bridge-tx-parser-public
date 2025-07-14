import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";

import { ParsedInstruction, ParsedIdlInstruction } from "../interfaces";
import { Jupiter } from "../programs/jupiter_v6";

export enum JupiterInstruction {
	ROUTE = 229,
	ANCHOR_SELF_CPI_LOG = 228,
}

function decodeJupiterInstruction(instruction: TransactionInstruction): ParsedInstruction<Jupiter> {
	const instructionSelector = instruction.data[0];
	const remainingData = instruction.data.slice(1);

	let parsed: ParsedIdlInstruction<Jupiter> | null;

	switch (instructionSelector) {
		case JupiterInstruction.ROUTE:
			parsed = decodeRouteInstruction(instruction, remainingData);
			break;

		case JupiterInstruction.ANCHOR_SELF_CPI_LOG:
			// eslint-disable-next-line no-case-declarations
			const data = remainingData.slice(15);

			parsed = {
				name: "SwapEvent",
				programId: instruction.programId,
				accounts: [{ name: "account", pubkey: instruction.keys[0].pubkey }],
				args: {
					amm: new PublicKey(data.slice(0, 32)),
					input_mint: new PublicKey(data.slice(32, 64)),
					input_amount: new BN(data.readBigUInt64LE(64).toString()),
					output_mint: new PublicKey(data.slice(72, 104)),
					output_amount: new BN(data.readBigUInt64LE(104).toString()),
				},
			} as ParsedIdlInstruction<Jupiter, "SwapEvent">;
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

export { decodeJupiterInstruction };

function decodeRouteInstruction(instruction: TransactionInstruction, data: Buffer): ParsedIdlInstruction<Jupiter, "route"> {
	return {
		name: "route",
		programId: instruction.programId,
		accounts: [
			{ name: "token_program", pubkey: instruction.keys[0].pubkey },
			{ name: "user_transfer_authority", pubkey: instruction.keys[1].pubkey },
			{ name: "user_source_token_account", pubkey: instruction.keys[2].pubkey },
			{ name: "user_destination_token_account", pubkey: instruction.keys[3].pubkey },
			{ name: "destination_token_account", pubkey: instruction.keys[4].pubkey },
			{ name: "destination_mint", pubkey: instruction.keys[5].pubkey },
			{ name: "platform_fee_account", pubkey: instruction.keys[6].pubkey },
		],
		args: {
			route_plan: {
				swap: null,
				percent: 0,
				input_index: 0,
				output_index: 0,
			},
			in_amount: new BN(data.readBigUInt64LE(data.length - 19).toString()),
			quoted_out_amount: new BN(data.readBigUInt64LE(data.length - 11).toString()),
			slippage_bps: data.readUInt16LE(data.length - 3),
			platform_fee_bps: data.readUint8(data.length - 1),
		},
	} as unknown as ParsedIdlInstruction<Jupiter, "route">;
}
