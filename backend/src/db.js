const mongoose=require('mongoose')

const connectedDB=async()=>{
try {
    await mongoose.connect(process.env.DB_URI)
    console.log('connected to DB')
} catch (error) {
    console.log('db connection failed' ,error )
}
}

  module.exports=connectedDB