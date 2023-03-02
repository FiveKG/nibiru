const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { sleep, getNow } = require("./app/extend/helper");
const schedule = require('node-schedule');
let rule = new schedule.RecurrenceRule();
let secondRule = [];
for(let i=0; i<60; i+=5) {
    secondRule.push(i)
}
console.log("=========定时任务开始：5s==========")
rule.second = secondRule;

const mysql = require('mysql');
const pool = mysql.createPool({
      host     : '127.0.0.1',
      post     :  3306,
      user     : 'root',
      password : 'Uranus12#$',
      database : 'nibiru'
    }); 

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
     
let job = schedule.scheduleJob(rule, async () => {
   //全部发送
   let selectSql = `SELECT * FROM faucet WHERE status <> 3 AND status <> 1  order by id  limit 1;`;
   let one = await query(selectSql);
   if (one.length < 1 )
       return
   console.log('执行:',one)
   let outputBuff, output;


   // transfer B
   try {
       outputBuff = childProcess.execSync(`/root/sendB.sh ${one[0].name} nibi15ce6jgw8p5f0vt8jlgwt8zu7clkruav9p8x796`);
   } catch (error) {
       console.log(one[0].address+'发送b失败:',outputBuff.toString())
   }
   output = outputBuff.toString()
   if(output) {
       let txB = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
       console.log(one[0].address+'发送b成功:',txB)

       let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) VALUES (${one[0].id}, '${txB}', ${1}, '${getNow()}');`;
       //transfer记录
       await query(insertSql, {faucetId:one[0].id, tx:txB, type:1, create_time: getNow()});
   }

//   // transfer U
//    try {
//        outputBuff = childProcess.execSync(`/root/sendU.sh ${one[0].name} nibi1nhltz0erh8p22kwwulywkhklk2g4p4k9lfvrj3`);
//    } catch (error) {
//        console.error(one[0].address+ "发送发送u失败:",error)
//    }
//    output = outputBuff.toString()
   
//    if(output) {
//        let txU = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
//        console.log(one[0].address+'发送u成功:',txU)

//        updateStatus = 2;
//        let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) VALUES (${one[0].id}, '${txU}', ${2}, '${getNow()}');`;
//        //transfer记录
//        await query(insertSql);
//    }

//    updateStatus=3
    updateStatus = 1
   if(one[0].status !== 0) {
        updateStatus = 3 //完成
   }

    const updatebStatusSql = `UPDATE faucet SET status=${updateStatus}, update_time='${getNow()}' WHERE id =${one[0].id};`;
    await query(updatebStatusSql);

});



// (async () => {
//    //全部发送
//     let selectSql = `SELECT * FROM faucet WHERE status = 0 limit 1;`;
//     let one = await query(selectSql);
//     if (one.length < 1 )
//         return
//     let updateStatus = 0;
//     console.log('执行:',one)
//     let outputBuff, output;


//     // transfer B
//     try {
//         outputBuff = childProcess.execSync(`/root/sendB.sh ${one[0].name} nibi1nhltz0erh8p22kwwulywkhklk2g4p4k9lfvrj3`);
//     } catch (error) {
//         console.log(one[0].address+'发送b失败:',outputBuff.toString())
//     }
//     output = outputBuff.toString()
//     if(output) {
//         let txB = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
//         console.log(one[0].address+'发送b成功:',txB)

//         updateStatus = 1;
//         let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) VALUES (${one[0].id}, '${txB}', ${1}, '${getNow()}');`;
//         //transfer记录
//         await query(insertSql, {faucetId:one[0].id, tx:txB, type:1, create_time: getNow()});
//     }

//    // transfer U
//     try {
//         outputBuff = childProcess.execSync(`/root/sendU.sh ${one[0].name} nibi1nhltz0erh8p22kwwulywkhklk2g4p4k9lfvrj3`);
//     } catch (error) {
//         console.error(one[0].address+ "发送发送u失败:",error)
//     }
//     output = outputBuff.toString()
    
//     if(output) {
//         let txU = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
//         console.log(one[0].address+'发送u成功:',txU)

//         updateStatus = 2;
//         let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) VALUES (${one[0].id}, '${txU}', ${2}, '${getNow()}');`;
//         //transfer记录
//         await query(insertSql);
//     }

//     updateStatus=3
//     if(updateStatus!== 0) {
//         const updatebStatusSql = `UPDATE faucet SET status=${updateStatus} WHERE id =${one[0].id};`;
//         await query(updatebStatusSql);
//     }
// })();

      
