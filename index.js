import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import http from "http"
import mongoose from "mongoose"
import "dotenv/config"
import routes from "./src/routes/index.js"
import morgan from "morgan"
import { WebSocketServer } from 'ws';

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(morgan('common'));

app.use("/api/v1", routes)

const port = process.env.PORT || 5000

const server = http.createServer(app)

// Tạo một WebSocket server và liên kết nó với HTTP server
const wss = new WebSocketServer({ server });

// Lắng nghe các kết nối tới WebSocket server
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Gửi dữ liệu tới client khi nhận được tin nhắn từ client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server received message: ${message}`);
  });

  // Xử lý lỗi khi có lỗi xảy ra trên WebSocket
  ws.on('error', (err) => {
    console.error(`WebSocket error: ${err}`);
  });

  // Xử lý sự kiện khi client đóng kết nối
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
        console.log(`Server is listening on port  ${port}`)
    })
}).catch((err) => {
    console.log(err)
    process.exit(1)
}
)