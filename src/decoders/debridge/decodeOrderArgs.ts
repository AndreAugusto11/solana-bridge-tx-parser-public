import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

import { ParsedIdlArgs, ParsedIdlType } from "../../interfaces";
import { idl } from "../..";

export function decodeCreateOrderArgs(data: Buffer): ParsedIdlArgs<idl.DeBridgeSourceIdl, "create_order_with_nonce"> {
	let offset = 7;

	console.log("Decoding create_order_with_nonce args from data:", data);

	const giveOriginalAmount = data.readBigUInt64LE(offset);
	offset += 8;

	// Offer struct decoding
	const chainId = Array.from(data.slice(offset, offset + 32));
	offset += 32;

	// token_address: bytes [20]

	offset += 4; // Skip 4 bytes for alignment

	const tokenAddress = data.slice(offset, offset + 20);
	offset += 20;

	const amount = Array.from(data.slice(offset, offset + 32));
	offset += 32;

	const take = {
		chain_id: chainId,
		token_address: tokenAddress,
		amount: amount,
	};

	offset += 4; // Skip 4 bytes for alignment
	const receiverDst = data.slice(offset, offset + 20);
	offset += 20;

	const hasExternalCall = data.readUInt8(offset) !== 0;
	offset += 1;
	let externalCall: Buffer | null = null;
	if (hasExternalCall) {
		externalCall = data.slice(offset, offset + 32);
		offset += 32;
	}

	const givePatchAuthoritySrc = data.slice(offset, offset + 32);
	offset += 32;

	const hasAllowedCancelBeneficiarySrc = data.readUInt8(offset) !== 0;
	offset += 1;
	let allowedCancelBeneficiarySrc: Buffer | null = null;
	if (hasAllowedCancelBeneficiarySrc) {
		allowedCancelBeneficiarySrc = data.slice(offset, offset + 32);
		offset += 32;
	}

	offset += 4; // Skip 4 bytes for alignment
	const orderAuthorityAddressDst = data.slice(offset, offset + 20);
	offset += 20;

	const hasAllowedTakerDst = data.readUInt8(offset) !== 0;
	offset += 1;
	let allowedTakerDst: Buffer | null = null;
	if (hasAllowedTakerDst) {
		offset += 4;
		allowedTakerDst = data.slice(offset, offset + 20);
		offset += 20;
	}

	// Decode affiliate_fee struct (if present)
	// Assuming affiliate_fee is 40 bytes: 32 bytes pubkey + 8 bytes u64
	const affiliateFeeOffset = data.length - 4 - 40; // 4 bytes for referral_code at end

	const beneficiary = Array.from(data.slice(affiliateFeeOffset, affiliateFeeOffset + 32));
	const amt = new BN(data.readBigUInt64LE(affiliateFeeOffset + 32).toString());
	const affiliateFee = {
		beneficiary: new PublicKey(beneficiary),
		amount: amt,
	};

	return {
		order_args: {
			give_original_amount: new BN(giveOriginalAmount.toString()),
			take,
			receiver_dst: receiverDst,
			external_call: externalCall,
			give_patch_authority_src: new PublicKey(givePatchAuthoritySrc),
			allowed_cancel_beneficiary_src: allowedCancelBeneficiarySrc ? new PublicKey(allowedCancelBeneficiarySrc) : null,
			order_authority_address_dst: orderAuthorityAddressDst,
			allowed_taker_dst: allowedTakerDst,
		},
		affiliate_fee: affiliateFee,
		referral_code: data.readUInt32LE(data.length - 82), // Assuming referral_code is a 4-byte integer before nonce
		nonce: new BN(data.readBigUInt64LE(data.length - 78).toString()), // Nonce is a u64 before metadata (+4 bytes for alignment)
		metadata: data.slice(data.length - 66), // Assuming metadata is the last 66 bytes
	};
}

export function decodeFulfillOrderArgs(data: Buffer): ParsedIdlType<idl.DeBridgeDestinationIdl, "Order"> {
	let offset = 7;

	const makerOrderNonce = new BN(data.readBigUInt64LE(offset).toString());
	offset += 8;

	offset += 4; // alignment
	const makerSrc = data.slice(offset, offset + 20);
	offset += 20;

	// Decode 'give' Offer struct
	const giveChainId = Array.from(data.slice(offset, offset + 32));
	offset += 32;

	offset += 4; // alignment
	const giveTokenAddress = data.slice(offset, offset + 20);
	offset += 20;

	const giveAmount = Array.from(data.slice(offset, offset + 32));
	offset += 32;

	const give = {
		chain_id: giveChainId,
		token_address: giveTokenAddress,
		amount: giveAmount,
	};

	// Decode 'take' Offer struct
	const takeChainId = Array.from(data.slice(offset, offset + 32));
	offset += 32;

	offset += 4; // alignment
	const takeTokenAddress = data.slice(offset, offset + 32);
	offset += 32;

	const takeAmount = Array.from(data.slice(offset, offset + 32));
	offset += 32;

	const take = {
		chain_id: takeChainId,
		token_address: takeTokenAddress,
		amount: takeAmount,
	};

	offset += 4; // alignment
	const receiverDst = data.slice(offset, offset + 32);
	offset += 32;

	offset += 4; // alignment
	const givePatchAuthoritySrc = data.slice(offset, offset + 20);
	offset += 20;

	offset += 4; // alignment
	const orderAuthorityAddressDst = data.slice(offset, offset + 32);
	offset += 32;

	// allowed_taker_dst: Option<bytes>
	const hasAllowedTakerDst = data.readUInt8(offset) !== 0;
	offset += 1;
	let allowedTakerDst: Buffer | null = null;
	if (hasAllowedTakerDst) {
		offset += 4; // alignment
		allowedTakerDst = data.slice(offset, offset + 32);
		offset += 32;
	}

	// allowed_cancel_beneficiary_src: Option<bytes>
	const hasAllowedCancelBeneficiarySrc = data.readUInt8(offset) !== 0;
	offset += 1;
	let allowedCancelBeneficiarySrc: Buffer | null = null;
	if (hasAllowedCancelBeneficiarySrc) {
		offset += 4; // alignment
		allowedCancelBeneficiarySrc = data.slice(offset, offset + 20);
		offset += 20;
	}

	// external_call: Option<ExternalCallParams>
	const hasExternalCall = data.readUInt8(offset) !== 0;
	offset += 1;
	let externalCall: Buffer | null = null;
	if (hasExternalCall) {
		externalCall = data.slice(offset, offset + 20);
		offset += 20;
	}

	return {
		maker_order_nonce: makerOrderNonce,
		maker_src: makerSrc,
		give,
		take,
		receiver_dst: receiverDst,
		give_patch_authority_src: givePatchAuthoritySrc,
		order_authority_address_dst: orderAuthorityAddressDst,
		allowed_taker_dst: allowedTakerDst,
		allowed_cancel_beneficiary_src: allowedCancelBeneficiarySrc,
		external_call: {
			external_call_shortcut: externalCall ? Array.from(externalCall) : Array.from(Buffer.alloc(32)),
		},
	};
}
