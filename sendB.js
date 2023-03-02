const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { sleep } = require("./app/extend/helper");
const jsonPath = path.join(__dirname, "/config/transferStatus.json");
(async () => {
    let array = fs.readFileSync(jsonPath, "utf8");
    let parsedArray = JSON.parse(array);
    let walletIndex = parsedArray.findIndex((wallet) => {
        return wallet.isSendB === false ? true : false
    });

    if ( walletIndex != -1) {
        let wallet = parsedArray[walletIndex];
        console.log(wallet)
        let outputBuff = childProcess.execSync(`/root/sendB.sh ${wallet.name} nibi1nhltz0erh8p22kwwulywkhklk2g4p4k9lfvrj3`);
        let output = outputBuff.toString()
        let codeIndex = output.indexOf("code: 0");
        console.info("EVM task success: true")
        //虚拟机交易失败
        if(codeIndex == 1) {
            console.error("EVM task success: false")
            return
        }
        
        
        await sleep(25000)
        let hash = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
        let txBuffer = childProcess.execSync(`nibid query tx ${hash} --chain-id=nibiru-testnet-1`);
        let tx = txBuffer.toString();
        let txCodeIndex = tx.indexOf("code: 0");
        if (txCodeIndex === -1) {
            console.error("check tx from blockchain success: false")
            return
        }
            
        console.info("check tx from blockchain success: true")

        parsedArray[walletIndex].isSendB = true;
        fs.writeFileSync(jsonPath, JSON.stringify(parsedArray, null, 2), 'utf8');
    }
})();

// setInterval(async () => {
//     let array = fs.readFileSync(jsonPath, "utf8");
//     let parsedArray = JSON.parse(array);
//     let walletIndex = parsedArray.findIndex((wallet) => {
//         return wallet.isSendB === false ? true : false
//     });

//     if ( walletIndex != -1) {
//         let wallet = parsedArray[walletIndex];
//         console.log('=============wallet',wallet)
//         let outputBuff = childProcess.execSync(`/root/sendB.sh ${wallet.name} nibi1nhltz0erh8p22kwwulywkhklk2g4p4k9lfvrj3`);
//         let output = outputBuff.toString()
//         console.log("outputBuff",output);

//         let codeIndex = output.indexOf("code: 0");
//         //虚拟机交易失败
//         if(codeIndex == 1) 
//             return
        
//         await sleep(12000)
//         let hash = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
//         let txBuffer = childProcess.execSync(`nibid query tx ${hash} --chain-id=nibiru-testnet-1`);
//         let tx = txBuffer.toString();

//         let txCodeIndex = tx.indexOf("code: 0");
//         console.log('==========tx',tx)
//         console.log('==========txCodeIndex',txCodeIndex)

//         if (txCodeIndex === -1)
//             return
        
//         parsedArray[walletIndex].isSendB = true;
//         fs.writeFileSync(jsonPath, JSON.stringify(parsedArray, null, 2), 'utf8');
//     }
// },15000)
