let mongoClient = require('mongodb').MongoClient;  // 获取连接方法

let dataUrl = "mongodb://localhost:27017";   // 设置连接url
let dbName = "old";  // 设置当前为数据库中db名

mongoClient.connect(dataUrl,(err,client)=>{
    if(err){
        throw err;
        return;
    }
    
    let db = client.db(dbName);

    db.collection('people').insertOne({
        "name":"顾克凡",
        "age":23,
        "sex":1,
        "collage":'南京工程学院'
    })
})

