import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// API to register user
const registerUser = async (req,res) => {
    try {

        const {name, email, password} = req.body;

        if (!name || !password || !email) {
            return res.json({success:false,message:'Missing Details'});
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:'Enter a valid email'});
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({success:false,message:'Enter a strong password'});
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password:hashPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.json({success:true,token})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// API for user login
const loginUser = async (req,res) => {

    try {

        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if (!user) {
            res.json({success:false,message:'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            res.json({success:true,token});
        } else {
            res.json({success:false,message:'Invalid credentials'});
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }

}

// API to get user profile data
const getProfile = async (req,res) => {
    try {

        const { userId } = req;
        const userData = await userModel.findById(userId).select('-password');

        res.json({success:true,userData})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// API to update user profile
const updateProfile =  async (req,res) => {
    try {
        
        const { name, phone, address, dob, gender } = req.body;
        const userId = req.userId;
        const imageFile = req.file;

        if (!userId || !name || !phone || !address || !dob || !gender) {
            return res.json({success:false,message:'Missing required fields'});
        }

        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (e) {
                return res.json({ success: false, message: "Invalid address format" });
            }
        }
        //res.json({user:userId})
        await userModel.findByIdAndUpdate(userId, {name,phone,address:parsedAddress,dob,gender});

        if (imageFile) {

            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'});
            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {image:imageURL});
        }

        res.json({success:true,message:'Profile Updated'});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.avalaible) {
        return res.json({ success: false, message: 'Doctor not available' });
        }

        let slots_booked = docData.slots_booked || {};

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
            } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked;

        const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save the updated slots
        await doctorModel.findByIdAndUpdate(
        docId,
        { slots_booked },
        { new: true }
        );

        res.json({ success: true, message: 'Appointment booked' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment};