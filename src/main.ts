import * as fs from 'fs';
import { resolve } from 'path';

import { PBBackup } from './interfaces';
import { convertPaperback } from './converter';

const main = async (args: any[]) => {
	// Args 0 and 1 are the path to node and then the path to the current file
	// Get the input file
	const inputFile = args[2];

	// Check if the input file exists
	if (!fs.existsSync(inputFile)) {
		console.error(`The input file ${inputFile} does not exist.`);
		process.exit(1);
	}

	// Get the output file
	const outputFile = args[3];

	// Get the absolute path to the output file
	const outputFileAbsolutePath = resolve(outputFile);

	// Log that we are starting the conversion
	console.log('Converting...');

	// Import the backup
	const importJson = fs.readFileSync(inputFile, 'utf8');

	// Parse the json as a paperback backup
	const pbObj: PBBackup = JSON.parse(importJson);

	// Convert the backup to aidoku
	const aidokuObject = convertPaperback(pbObj);

	// Stringify the aidoku object
	const data = JSON.stringify(aidokuObject, null, 4);

	// Write to the output file
	fs.writeFileSync(outputFileAbsolutePath, data);

	console.log(`Done!\nCheck ${outputFileAbsolutePath}`);
};

main(process.argv);
