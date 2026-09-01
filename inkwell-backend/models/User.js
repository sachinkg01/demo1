const mongoose= require('mongoose');

const UserSchema= new mongoose.Schema({
    name:{type:string, required:true, trim:true},
    email:{type:string, required:true, unique:true, lowercase:true, trim:true},
    password:{type:string, required:true}},{timestamps:true});
module.exports= mongoose.model('User', UserSchema);