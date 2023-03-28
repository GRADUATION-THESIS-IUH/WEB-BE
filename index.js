import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";
import morgan from "morgan";
import http from "http";
import socketDevice from "./src/socketIO/socket.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("common"));

app.use("/api/v1", routes);

// bot.on('callback_query', (query) => {
//   const photoPath = './src/assets/image/QR.png';
//   if (query.data === 'show_photo') {
//     bot.sendPhoto(chatId, photoPath);
//   }
// });

const port = process.env.PORT || 5000;
const server = http.createServer(app);

socketDevice(server);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
      console.log(`Server is listening on port  ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
