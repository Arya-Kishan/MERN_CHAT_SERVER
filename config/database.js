import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Cloud Database connected');
    }).catch((error)=>{
        console.log(error);
    })
};
export default connectDB;



// import mongoose from "mongoose";

// const connectDB = async () => {
//     await mongoose.connect("mongodb://localhost:27017/chat-app").then(() => {
//         console.log('Database connected');
//     }).catch((error)=>{
//         console.log(error);
//     })
// };
// export default connectDB;