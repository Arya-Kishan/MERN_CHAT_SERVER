import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const registerUser = async (req, res) => {

    try {

        let { userName, password, gender } = req.body;

        let profilePic;

        let findUser = await User.findOne({ userName })
        console.log(findUser);

        if (gender == "male") {
            profilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`
        } else {
            profilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`
        }

        if (findUser) {
            res.status(202).json({ message: 'NAME IS ALREADY TAKEN', data: null })
        } else {



            let profilePic = `https://api.multiavatar.com/${userName}.svg`;

            let hashedPassword = await bcrypt.hash(password, 10)

            let user = new User({ ...req.body, password: hashedPassword, profilePic });
            let newUser = await user.save();
            newUser = await newUser.populate({
                path: 'friends',
                select: "-password"
            })

            let token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

            res.status(200).cookie("jwt_token_chat", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }).json({ message: 'NEW USER CREATED', data: newUser })

        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN CREATING USER', data: null })
    }


}

export const loginUser = async (req, res) => {

    try {

        let { userName, password } = req.body;

        let user = await User.findOneAndUpdate({ userName }, { $set: { active: Date.now() } }).populate({
            path: 'friends',
            select: "-password"
        })
        console.log(user);


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


export const searchUsers = async (req, res) => {

    try {
        const docs = await User.find({ "userName": { $regex: '^' + req.query.search, $options: 'i' } });
        res.status(200).json(docs);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN SEARCHING USERS', Error: error, data: null })
    }


}

export const addFriend = async (req, res) => {

    try {

        console.log(req.body);

        const { senderRequestUserId, receiverRequestUserId } = req.body;

        let user = await User.findById(senderRequestUserId)

        if (user.friends.includes(receiverRequestUserId)) {

            res.status(202).json({ message: "ALREADY FRIEND", data: null })

        } else {

            let newFriends = await User.findByIdAndUpdate(receiverRequestUserId, { $push: { friends: senderRequestUserId } });
            let newFriends2 = await User.findByIdAndUpdate(senderRequestUserId, { $push: { friends: receiverRequestUserId } });

            res.status(200).json({ message: "FRIEND ADDED", data: newFriends })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'ERROR IN ADDING FRIEND', Error: error, data: null })
    }


}


// export const registerUser = async (req, res) => {

//     try {

//         console.log(req.body);

//         req.body.forEach(async (e) => {

//             let { userName, password, gender } = e;
//             let profilePic;
//             console.log(e);


//             if (gender == "male") {
//                 profilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`
//             } else {
//                 profilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`
//             }

//             let hashedPassword = await bcrypt.hash(password, 10)

//             let user = new User({ userName, password: hashedPassword, profilePic, gender });
//             const newUser = await user.save();


//         })

//         res.send("apple")




//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: 'ERROR IN CREATING USER', data: null })
//     }


// }