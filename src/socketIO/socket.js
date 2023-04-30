import { WebSocketServer } from "ws";
import tele from "node-telegram-bot-api";
import axios from "axios";
import telegrambot from "../utils/telegramBot.js";
import beatAvgModel from "../models/beatAvg.model.js";
import hearthBeatModel from "../models/hearthbeat.model.js";
import warningModel from "../models/warning.model.js";
import conditionRule from "../utils/conditionsRule.js";
import fbAdmin from "firebase-admin";
//import serviceAccount from "./serviceKey.json" assert { type: "json" };

const socketDevice = async (server) => {
  fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(
      {
        "type": "service_account",
        "project_id": "iuh-da",
        "private_key_id": "3ddc5f4ac3b58bc4c6fe7a93feeefd49f1c80529",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5uhsQYmVZVtic\n9NhBj7dWLyh34kfWb8ffACZYm52EHs3BXpiwp8zkZ9T7KOMcQ3sARXAZidgzmrJf\nCiEP194mw1EmdugB6w/Qxwn4grnEBLkC7MZcgYZe6TgK9z1Be+z7rJJWAM/AlLZW\ngxABLVGERcWcdP3RQ/vBu7a7r2y3RqSjADS4ZJeDhNUJy/jHoSoK+45TmX75Iqo6\nXt3QI5Lk9ZOlIdMoriEC8uJcGFgkbhqFG0fVh0cRRhr63m1Ncoap/pBSzyVE+XN6\n4aprrH/JvHEndWvg0ENPBLqs9EWlnm2hjHoAhKE+yS5cZvs7e+F9xWDxQRfYTfgP\n2Iq5OSSfAgMBAAECggEAKseOx1HaxV7HKzQMgeFwGdZn7GE/Kcn6kEeRDZTejdmo\njBNVeU9VVwEBok5zLYXvlYro/MDu/0fxMQn8vpD69xPDI+h8nUB/FphaGBdIYbmy\nwdU3BYTCJidzBLeZMPWyCvBfjpbGQ7YdX8T1kUfWgHCvyU97TVHq8d9igk2wbXBg\nGaMw4UuSy+hvKbL1uURDUKEWHah+cPqokW0AYwmaLr74/C/1Xos008hmIUpZNGLF\nSuz53pLj+6fcCAjktsN9SDIk8dDYEcOc7AjWUlBlFfvjuYg3JPcR3SMwcgSQXP/o\nDMaUyRIufSa2G9eG0MMQwJOZSLYimGj+ZUIbMN+zyQKBgQDkYxl89X+Si/hn4mQy\nDkTDECuQG2O3z62bdZcxwZWJ2tutvJkjDyYzjB8MhWUd4z+XxxuDe6wv5zFEjHEC\nr1rWCmWxqQjmnp9PXJrBIsjultkzZYeeLefo7GwFRTpCOl611ALaEJAfJqqTmjdJ\nDSKpwwrDP54q0kIb5UsnDrpH6QKBgQDQLp2KblKHVCxLeMEQqyqvu//HS3B6k7F9\nPHb8XTWeDt9V9dBFA5XLI9PpwOITd1KfCND5EyI23AGYRWN9zbwLW5gSAZ2UaHmn\n2dX11w75g4bUa3/8BuaB6Y+4FvGWyfeVVMxFeiBr9R0IDEbMsOpgGwxkqBK2X5qL\nmYNVa8i7RwKBgQDcno5kk5JksimH0L4RTI9IDzrFvm+ZhFikL/eZ7PLTdEN5lRIp\nN90jNlxX8BQ5xugLah896B3xOFfza+dPPK12zhxmfm9GuDwUodQsdbm8IKQ4bf+P\n4bCA5MGEZdddWp1a8C7BD/bo4KUuaG63dqThcLPY4H+dxfZulBUA6c0w4QKBgHed\n0TdxHEpVuv3CbGw/bU98HgNM/Vvw8NKco2FtzRj8QqcJjpmY7cDC3Ug6Y6v7q6Vl\nU21J6SbMUr5DYF8wjxOXlVEDTJ+xR/WB3MZcw2XqhNYYznjpHhkXMlT8GeQiN/e9\nuYFSIr7lH8E4DJYgMQr3f692Qwo29H2xvxydycCRAoGBAMkfmcIlTp4RUQB0FkYv\ntvRhIaRlafIsHJQ0AMZhGTQ4ppc+yZc6B2V0Aj32Lmt/CZESRA/PcaiQlFFA7jLp\nNKIT+0cNGr4swNZ2bChigqoIobisNhJwoVvPaKFMM2VRHF6xXydQPeckyGLZU96d\nMfkD+CxGaGXP/900kW4d6a7o\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-ad8he@iuh-da.iam.gserviceaccount.com",
        "client_id": "113044899910773091609",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ad8he%40iuh-da.iam.gserviceaccount.com"
      }
    ),
    databaseURL: 'https://iuh-da-default-rtdb.asia-southeast1.firebasedatabase.app/'
  });
  // Tạo một WebSocket server và liên kết nó với HTTP server
  const wss = new WebSocketServer({ server });
  // Lắng nghe các kết nối tới WebSocket server
  const clients = [];

  const messageApp = {
    notification: {
      title: "MediHearth - Warning",
      body: "Body of Your Notification in Data",
    },
    token:
      "fTy72ynPTVKutu_nYF8UUQ:APA91bGS8KYISU8Dh6gloQqfmMlLXeFuv1ww-e8gm3wruDWM-HKL8EM_suQUFQxNVqshzino8I5bZQ1tYv1MLsQdKtUEIBCjux38VjnQ9eOyqNfSwAhbxgtzMjKDpRULI6Byxee46laG",
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
      if(dataBeat?.data[1] === "BT") return;
      if (dataBeat?.data[1] >= 40) {
        //save beatAVG to database
        const cccdPatientUsingIOT = await hearthBeatModel.findOne({
          ip_mac: dataBeat.data[0],
        }).populate("patient_cccd");
        const today = new Date();
        const beatavg = new beatAvgModel();
        beatavg.ip_mac = dataBeat.data[0];
        beatavg.avg = dataBeat.data[1];
        beatavg.date_received = today;
        beatavg.patient_cccd = cccdPatientUsingIOT.patient_cccd;
        await beatavg.save();

        const warningBeat = dataBeat.data[0] + " - " + conditionRule.conditionRule(dataBeat.data[1]);

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

         // send mobile notification
          messageApp.notification.body = warningBeat;
          fbAdmin
            .messaging()
            .send(messageApp)
            .then((response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });

          // save warning to database
          const warning = new warningModel();
          warning.warning = warningBeat;
          warning.patient_cccd = cccdPatientUsingIOT.patient_cccd.name;
          warning.ip_mac = dataBeat.data[0];
          warning.date = new Date();
          await warning.save();
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

  const warningJson = (message) => {
    return JSON.stringify({
      type: "warning",
      message: message,
    });
  }
  function broadcastMessage(message) {
    clients.forEach((ws) => {
      ws.send(warningJson(message));
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
