const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['candidate','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        place:{type:String},
        pin:{type:Number},
        qualification:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type:String,
            default:""
        }
    },
},{timestamps:true})

const User = mongoose.model('User', userSchema)

module.exports = User