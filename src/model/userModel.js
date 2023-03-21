const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    credentials:{type:Object, default:undefined},
    ip:{type:String}
},{timestamps:true})





module.exports=mongoose.model('User',userSchema)