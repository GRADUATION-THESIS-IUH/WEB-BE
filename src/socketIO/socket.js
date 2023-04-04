import { WebSocketServer } from "ws";
import tele from "node-telegram-bot-api";
import axios from "axios";
import telegrambot from "../utils/telegramBot.js";
import beatAvgModel from "../models/beatAvg.model.js";
import hearthBeatModel from "../models/hearthbeat.model.js";
import warningModel from "../models/warning.model.js";
import conditionRule from "../utils/conditionsRule.js";
import fbAdmin from "firebase-admin";
import serviceAccount from "./serviceKey.json" assert { type: "json" };

const socketDevice = async (server) => {
  fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://iuh-da-default-rtdb.asia-southeast1.firebasedatabase.app/'
  });
  // Tạo một WebSocket server và liên kết nó với HTTP server
  const wss = new WebSocketServer({ server });
  // Lắng nghe các kết nối tới WebSocket server
  const clients = [];

  var messageApp = {
    notification: {
      title: "Title of your notification",
      body: "Body of your notification",
    },
    token:
      "c4S6TrciQjKBXLmiMtQpjx:APA91bHlk87isWU2xs8pXlcReJTGyrKcAF3jCulNPBEaPWdVTFgdyrxPtkhHnoyct-QnQH5mYwzNIJAOp8XgV-tEvAp027AIMHYovCNnly-Cmd3gcKLa2d7zdzxhSl02oX1eSDN5CmRz",
  };

  const token = "6298542409:AAGLk0uCMAJ6LFG3C5YN7EOh7bzHizY_tIU";
  const chatId = "-1001541503853";

  const bot = new tele(token, { polling: true });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    clients.push(ws);
    // Gửi dữ liệu tới client khi nhận được tin nhắn từ client
    ws.on("message", async (message) => {
      console.log(`Received message: ${message}`);
      //ws.send(`Server received message: ${message}`);
      if (message.toString() === "Connected") return;
      const dataBeat = JSON.parse(message.toString());

      if (dataBeat?.data[1] >= 50 || dataBeat?.data[1] === "BT") {
        // save beatAVG to database
        const cccdPatientUsingIOT = await hearthBeatModel.findOne({
          ip_mac: dataBeat.data[0],
        });
        const today = new Date();
        const beatavg = new beatAvgModel();
        beatavg.ip_mac = dataBeat.data[0];
        beatavg.avg = dataBeat.data[1];
        beatavg.date = today;
        beatavg.patient_cccd = cccdPatientUsingIOT.patient_cccd;
        await beatavg.save();

        const warningBeat = conditionRule.conditionRule(dataBeat.data[1]);

        //const warningBeat = `HearthBeat is too low, please check your patient or device ${dataBeat.data[0]}}`;
        //send warning to telegram
        if (warningBeat) {
          const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${warningBeat}`;
          await axios
            .get(telegramUrl)
            .then((response) => {
              console.log("Message sent successfully");
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });

          // send warning to web
          broadcastMessage(warningBeat);
          //ws.send(`Server received message: ${warningBeat}`);

          //send mobile notification
          // fbAdmin
          //   .messaging()
          //   .send(messageApp)
          //   .then((response) => {
          //     console.log("Successfully sent message:", response);
          //   })
          //   .catch((error) => {
          //     console.log("Error sending message:", error);
          //   });

          // // save warning to database
          // const warning = new warningModel();
          // warning.warning = warningBeat;
          // warning.date = new Date();
          // await warning.save();
        }
      } else {
        //send warning to web
        //ws.send(`HearthBeat is too low, please check your patient or device ${dataBeat.data[0]} or no active IOT`);
        // save warning to database
        // const warning = new warningModel();
        // warning.warning = `HearthBeat is too low, please check your patient or device ${dataBeat.data[0]} or no active IOT`;
        // warning.date = new Date();
        // await warning.save();
      }
      //ws.send("HearthBeat is too low");
    });

    // Xử lý lỗi khi có lỗi xảy ra trên WebSocket
    ws.on("error", (err) => {
      console.error(`WebSocket error: ${err}`);
    });

    // Xử lý sự kiện khi client đóng kết nối
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  function broadcastMessage(message) {
    clients.forEach((ws) => {
      ws.send(`${message}`);
    });
  }

  try {
    bot.on("message", async (msg) => {
      if (!msg) return;
      const chatId = msg.chat.id;
      if (msg.text === "/start" || msg.text === "/start@MediHearth_Bot") {
        // bot.sendMessage(
        //   chatId,
        //   "");
        const photoPath = "./src/assets/image/QR.png";
        bot.sendPhoto(chatId, photoPath, {
          caption:
            "Xin chào! Tôi là bot của MediHearth. Tôi sẽ giúp bạn kiểm tra trạng thái, cảnh báo của thiết bị MediHearth. Hãy sử dụng lệnh /help để xem danh sách các lệnh\n Trang web chính thức của ứng dụng:\n https://dashboard-medi.vercel.app/\nBạn có thể tải app trên di động tại đây: https://play.google.com/store/apps/details?id=com.medihearth.medihearth hoặc quét mã QR ở bên trên\n",
          // reply_markup: {
          //   inline_keyboard: [
          //     [{
          //       text: 'Ảnh',
          //       callback_data: 'show_photo'
          //     }]
          //   ]
          // }
        });
      } else if (msg.text === "/help" || msg.text === "/help@MediHearth_Bot") {
        bot.sendMessage(
          chatId,
          "Hãy sử dụng các lệnh sau để tương tác với bot:\n/start - Bắt đầu kích hoạt bot\n/help - Xem danh sách các lệnh\n/echo <nội dung> - Phản hồi lại tin nhắn của bạn\n/get <mac> - Kiểm tra trạng thái của thiết bị IOT"
        );
      } else if (msg && msg.text && msg.text.startsWith("/get ")) {
        const mac = msg.text.split(" ")[1];
        const statusIOT = await telegrambot.checkStatusIOT(mac);
        if (statusIOT) {
          if (statusIOT.status == false) {
            bot.sendMessage(chatId, `IOT ${mac} đang tắt`);
            bot.sendMessage(
              chatId,
              `Thông tin chi tiết:\nMAC: ${statusIOT.ip_mac}\nHospital: ${statusIOT.hospital}\nStatus: ${statusIOT.status}`
            );
          } else {
            bot.sendMessage(chatId, `IOT ${mac} đang bật`);
            bot.sendMessage(
              chatId,
              `Thông tin chi tiết:\nMAC: ${statusIOT.mac}\nHospital: ${statusIOT.hospital}\nStatus: ${statusIOT.status}`
            );
            bot.sendMessage(
              chatId,
              `Bạn có thể xem trực tiếp Realtime tại đây: http://localhost:3000/analytics/${mac}`
            );
          }
        }
      } else {
        bot.sendMessage(
          chatId,
          "Tôi không hiểu bạn đang nói gì. Hãy sử dụng lệnh /help để xem danh sách các lệnh."
        );
      }
    });
  } catch (error) {
    //console.log("Polling error no", error)
    let reconnectCount = 0;
    const maxReconnectAttempts = 3;

    bot.on("polling_error", (error) => {
      console.log(`Polling error: ${error}`);

      if (reconnectCount >= maxReconnectAttempts) {
        console.log("Max reconnect attempts reached. Bot is stopping.");
        return;
      }

      console.log(
        `Attempting to reconnect to Telegram API (attempt ${
          reconnectCount + 1
        })...`
      );
      reconnectCount++;
      setTimeout(() => {
        bot.startPolling();
      }, 5000);
    });
  }
};

export default socketDevice;
