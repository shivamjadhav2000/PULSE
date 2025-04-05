const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
//Configure Database
const dbConnect=async ()=>{
  conn_msg='';
  
  
  if(process.env.NODE_ENV == 'local') {
    connectionString = process.env.LOCAL_DB
    conn_msg="connected to local DB"
  } else if(process.env.NODE_ENV == 'production') {
    connectionString = process.env.PROD_DB
    conn_msg="connected to Prod DB"
  }
  const isMongooseDebugMode = process.env.IS_MONGOOSE_DEBUG_MODE == 'true'
  await mongoose.connect(connectionString).then(()=>{
  console.log(conn_msg)
  })
  if(isMongooseDebugMode) {
    mongoose.set('debug', true)
  }
}
module.exports = dbConnect