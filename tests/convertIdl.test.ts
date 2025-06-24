/* eslint-disable no-console */
import "mocha";
import { writeFileSync } from "fs";

import { convertLegacyIdlToV30 } from "../src/legacy.idl.converter";

import { Mayan } from "./idl/mayan";

describe("Test convert legacy IDL to v3.0", () => {
	it("can convert legacy idl", () => {
		try {
			console.log("Converting Mayan IDL to v3.0...");

			const formattedIdl = convertLegacyIdlToV30(Mayan, "BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY");
			// writeFileSync(".idl/formatted-mayan-idl.ts", `export const formattedIdl = ${JSON.stringify(formattedIdl, null, 2)};\n`);
			console.log("Mayan IDL converted successfully.");
		} catch (e) {
			console.log("Error converting Mayan IDL:", e);

			console.error("Error converting IDL:", e);
			throw e;
		}
	});
});
