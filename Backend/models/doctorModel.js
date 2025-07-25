import mongoose from "mongoose";

const doctorsSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    image: {type:String, required:true},
    speciality: {type:String, required:true},
    degree: {type:String, required:true},
    experience: {type:String, required:true},
    about: {type:String, required:true},
    avalaible: {type:Boolean},
    fees: {type:Number, required:true},
    address: {type:Object, required:true},
    date: {type:Number, required:true},
    slots_booked: {type:Object, default:{}},
}, {minimize:false});
//minimize is for doesn´t delete empty objects (slots_booked)

// If doctor model doesn´t exist, create one, otherwise uses it
const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorsSchema);

export default doctorModel;