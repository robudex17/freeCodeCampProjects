const mongoose = require('mongoose')


const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected')
    }catch(error){
        console.log('Error in Connecting to the MongoDB', error)
        process.exit(1) // exit when there is an error
    }
}

module.exports = connectDB