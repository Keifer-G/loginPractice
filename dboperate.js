let mongoClient = require('mongodb').MongoClient;
let objectId = require('mongodb').ObjectID;

let url = "mongodb://localhost:27017/";

class DbO{

    // 创建静态方法，目的：单例模式，解决实例不共享的问题
    static dbInterface(){
        if(!this.dbInterface){
            DbO.dbInterface = new DbO();  // 如果不存在dbInterface那么就把dbInterface用实例赋值
        }
        return DbO.dbInterface;  // 如果存在那就直接返回
    }

    constructor(){
        this.collecting="";
        this.connect();
    }

// 数据库连接
    connect(colName){
        return new Promise((resolve,reject)=>{
            if(!this.collecting){
                mongoClient.connect(url,(err,client)=>{
                    if(err){
                        console.log('connecterr');
                        return;
                    }
                    
                    // 连接库
                    let dbase = client.db('old');
                        this.collecting = dbase; // 让其第二次使用时，不再连接
                        resolve(dbase);                
                })
            }else{
                resolve(this.collecting);
            }

        })
    }

// 查询方法
    find(colName,f){
        return new Promise((resolve,reject)=>{
           this.connect().then(dbase=>{
               dbase.collection(colName).find(f).toArray((err,res)=>{
                   if(err){
                       console.log('finderr');
                       return;
                   }
                   console.log(res);
               })
           }) 
        })
    }

// 增加方法
    insert(colName,j){
        return new Promise((resolve,reject)=>{
            this.connect().then(dbase=>{
                dbase.collection(colName).insertMany([j],(err,res)=>{ // 这里j因为用了insertMany所以是个数组抱起来才行
                    if(err){
                        console.log('inserterr');
                        console.log(j);
                        return;
                    }
                    console.log(res.ops);
                })
            }) 
         })
    }

// 更新方法
    update(colName,f,j){
        return new Promise((resolve,reject)=>{
            this.connect().then(dbase=>{
                dbase.collection(colName).updateMany(f,{$set:j},(err,res)=>{
                    if(err){
                        console.log('updateerr');
                        return;
                    }
                    console.log(res);
                })
            }) 
         })
    }

// 删除方法
    delete(colName,f){
        return new Promise((resolve,reject)=>{
            this.connect().then(dbase=>{
                dbase.collection(colName).deleteMany(f,(err,res)=>{
                    if(err){
                        console.log('deleteerr');
                        return;
                    }
                    console.log(res);
                })
            }) 
         })
    }

// 将唯一ID _id对象普通化
    getObjectId(id){
        return new objectId(id);  // => 把id字符串转化为对象，用于使用id标识时
    }
}

module.exports=DbO;