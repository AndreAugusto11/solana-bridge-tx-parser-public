/* eslint-disable no-console */
import "mocha";
import assert from "assert";

import { Connection, clusterApiUrl } from "@solana/web3.js";

import { SolanaParser } from "../src";
import { ParsedIdlEvent, ParsedIdlInstruction } from "../src/interfaces";

import { IDL as DlnDstIdl, DlnDst } from "./idl/dst";
import { Jupiter } from "./idl/jupiter_v6";

const rpcConnection = new Connection(clusterApiUrl("mainnet-beta"));
const parser = new SolanaParser([{ idl: DlnDstIdl, programId: "dst5MGcFPoBeREFAA5E3tU5ij8m5uVYwkzkSAbsLbNo" }]);

describe("Test parse transaction", () => {
	it("can parse fulfill tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"4FvWxFVKcK88Z7rsXAmhTYqWaKJhhGMH1oYXybHJzZiMH2hnFWt4naw9M7du6j4SoNsjFg5j7ku4uSrnskGViAZv",
			true,
		);

		// const fulfillOrder = parsed?.find((pix) => pix.name === "fulfill_order") as ParsedIdlInstruction<DlnDst, "fulfill_order">;
		// assert.equal(fulfillOrder.args.unvalidated_order.maker_order_nonce.toString(), "1737321940254");

		const swapEvent = parsed?.find((pix) => pix.name === "SwapEvent") as ParsedIdlEvent<Jupiter, "SwapEvent">;
		console.log("AMM:", swapEvent.args.amm.toBase58());
		console.log("Input Token:", swapEvent.args.input_mint.toBase58());
		console.log("Output Token:", swapEvent.args.output_mint.toBase58());
		console.log("Input amount:", Number(swapEvent.args.input_amount));
		console.log("Output amount:", Number(swapEvent.args.output_amount));
		assert.equal(Number(swapEvent.args.output_amount), "1663373135");
		assert.equal(Number(swapEvent.args.input_amount), "254897332");
	});

	it("can parse send_batch_unlock tx", async () => {
		const parsed = await parser.parseTransactionByHash(
			rpcConnection,
			"HLNFpn7Aj9AgL5umSKQyKPHgvnK5YvmLMBfJQnRZTQQ23ZFRh9wi1gxusj7WWGgFG1DFZ5zmsPnZ7N6AtC4Tzaq",
			false,
		);

		const unlock = parsed?.find((v) => v.name === "send_batch_unlock") as ParsedIdlInstruction<DlnDst, "send_batch_unlock">;
		assert.equal(unlock.accounts[10].name, "sending.bridge");
	});
});
