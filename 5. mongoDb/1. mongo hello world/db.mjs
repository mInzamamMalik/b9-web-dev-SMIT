import mongoose from "mongoose";

// in schema we define what will be saved in database
const commentsSchema = new mongoose.Schema({
  name: { type: String, require: true },
  comment: { type: String, require: true },
  createdDate: { type: Date, default: Date.now },
});

export const commentsModel = mongoose.model("comments", commentsSchema);

// connecting mongodb with my app with mongoose
const mongodbURI =
  process.env.mongodbURI ||
  "mongodb+srv://dbuser:<yourpassword>@cluster0.gq9n2zr.mongodb.net/abcdatabase?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
  
    const myConnection = await mongoose.connect(mongodbURI);
   
    // this console should be removed (if for learning purpose)
    console.log(`MongoDB Connected: at ${myConnection.connection.host}`);
 
  } catch (err) {
 
    console.log("err", err);
    process.exit(1);
 
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  /////this function will run just before app is closing
  console.log("app is terminating");
  mongoose.connection.close(() => {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
