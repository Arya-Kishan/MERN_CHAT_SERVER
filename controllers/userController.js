import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const registerUser = async (req, res) => {

    try {

        let { userName, password, gender } = req.body;
        let profilePic;

        if (gender == "male") {
            profilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`
        } else {
            profilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        let user = new User({ ...req.body, password: hashedPassword, profilePic });
        const newUser = await user.save();

        let token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).cookie("jwt_token_chat", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }).json({ message: 'NEW USER CREATED', data: newUser })


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN CREATING USER', data: null })
    }


}

export const loginUser = async (req, res) => {

    try {

        let { userName, password } = req.body;


        let user = await User.findOne({ userName })


        if (!user) {
            return res.status(400).json({ message: 'USER NOT FOUND', data: null })
        }

        let checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({ message: 'PASSWORD IS WRONG', data: null })
        }

        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).cookie("jwt_token_chat", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }).json({ message: 'LOGGING USER', data: user })


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN LOGGING USER', data: null })
    }

}


export const getAllUsers = async (req, res) => {

    try {
        let allUsers = await User.find();

        res.status(200).json({ message: "ALL USERS", data: allUsers })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN GETTING ALL USERS', Error: error, data: null })
    }


}
