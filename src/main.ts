import * as fs from 'fs';
import { convertPaperback } from './converter';

if (require.main === module) {
    main().catch((err) => console.log(`Uncaught exception: \n\n${err}`));
}

// yarn build; yarn start;
async function main() {
    console.log("Converting...");

    // Importing backup
    const importJson = fs.readFileSync('./input-output/paperback.json', 'utf8');

    // Aidoku Backup JSON Object returned
    const aidokuObject = convertPaperback(importJson);

    // Write to file
    const data = JSON.stringify(aidokuObject);
    const date_str = new Date(Date.now()).toISOString().split('T')[0]
    fs.writeFileSync(`./input-output/aidoku_${date_str}.json`, data)

    console.log(`Done!\nCheck ./input-output/aidoku_${date_str}.json`);
}