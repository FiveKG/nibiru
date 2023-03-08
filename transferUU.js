const childProcess = require("child_process");
const dateFns = require('date-fns');
const schedule = require('node-schedule');
let rule = new schedule.RecurrenceRule();
let secondRule = [];
for(let i=0; i<60; i+=1) {
    secondRule.push(i)
}
console.log("=========transferUU定时任务开始：==========")
rule.second = secondRule;

const mysql = require('mysql');
const pool = mysql.createPool({
      host     : '127.0.0.1',
      post     :  3306,
      user     : 'root',
      password : 'Uranus12#$',
      database : 'nibiru'
    }); 
/**
 * @description 返回当前时间
 * @returns {String}}
 */
function getNow() {
    return dateFns.format(new Date(), "yyyy-MM-dd HH:mm:ss");
}

function query( sql, values ) {
    // 返回一个 Promise
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
        if (err) {
            reject( err )
        } else {
            connection.query(sql, values, ( err, rows) => {
    
            if ( err ) {
                reject( err )
            } else {
                resolve( rows )
            }
            // 结束会话
            connection.release()
            })
        }
        })
    })
}
 
const LIMIT = 1;
const RECEIVE = "nibi1lx9q6xvmfr8fpypsjp79mn7jlzrp6hjl8u2aa0";
LOCK = false;

let job = schedule.scheduleJob(rule, async () => {
   //最新id
   let selectSql = `SELECT * FROM faucet WHERE status = 2 order by id  limit ${LIMIT};`;
   const arr = await query(selectSql);


    if (arr.length < 1) {
        console.log("结束")
        childProcess.execSync(`pm2 stop 5`);
        return
        
    }

    if(LOCK) {
        console.log("LOCK")
        return
    }


    LOCK = true;
    let outputBuf_UU, output_UU;

    for(let one of arr) {
        try {
            outputBuf_UU = childProcess.execSync(`/root/nibiru-eggjs/sendUU.sh ${one.name} ${RECEIVE}`);
            output_UU = outputBuf_UU.toString();
            if(output_UU && output_UU.includes("code: 0")) {
                let tx = output_UU.slice(output_UU.indexOf("txhash:")+"txhash:".length).trim();
                console.log(one.address+'发送UU成功:',tx)
                // let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) VALUES (${one.id}, '${tx}', ${1}, '${getNow()}');`;
                // //transfer记录
                // await query(insertSql, {faucetId:one.id, tx:tx, type:1, create_time: getNow()});
            }

        } catch (error) {
            console.error(error)
            continue;
        }
        const updatebStatusSql = `UPDATE faucet SET status=3 WHERE id =${one.id};`;
        await query(updatebStatusSql);
    }
    LOCK = false;


});



// //test
// (async()=> {
//    //全部发送
//    let lastIdSql = `select id from faucet where status = 0 order by id limit 1`;
//    const lastIdResult = await query(lastIdSql);

//    let selectSql = `SELECT * FROM faucet WHERE id > ${lastIdResult[0].id} AND status = 0  order by id  limit ${SEND_TIME};`;
//    const arr = await query(selectSql);

//     if (arr.length < 1 ) {
//     console.log("结束")
//         return
//     }
//     let outputBuf_UU, output_UU;

//     for(let one of arr) {
//         // transfer U
//         console.log(one)
//         try {
//             outputBuf_UU = childProcess.execSync(`/root/nibiru-eggjs/sendB.sh ${one.name} ${RECEIVE}`);
//             output_UU = outputBuf_UU.toString();
//             console.log("============output_UU",output_UU)
//             if(output_UU && output_UU.includes("code: 0")) {
//                 let tx = output_UU.slice(output_UU.indexOf("txhash:")+"txhash:".length).trim();
//                 console.log(one.address+'发送b成功:',tx)
    
//                 let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) VALUES (${one.id}, '${tx}', ${1}, '${getNow()}');`;
//                 //transfer记录
//                 await query(insertSql, {faucetId:one.id, tx:tx, type:1, create_time: getNow()});
//             }
//             else{
//                 throw new Error(one.address+'发送uu失败:\r' + output_UU)
//             }

//             await sleep(100);
//         } catch (error) {
//             console.error(error)
//             return
//         }


//         const updatebStatusSql = `UPDATE faucet SET status=1 WHERE id =${one.id};`;
//         await query(updatebStatusSql);
//         }
// })()

