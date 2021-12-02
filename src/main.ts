if (require.main === module) {
    main().catch((err) => console.log(`Uncaught exception: \n\n${err}`));
}

async function main() {
    console.log('This is some cool async stuff');
}
