// json-rules-engine dùng giải thuật RETE để thực thi các quy tắc

// Thư viện json-rules-engine dùng giải thuật RETE để thực thi các quy tắc.
//RETE là một giải thuật dựa trên đồ thị được phát triển để xử lý các hệ thống chuyên gia (expert systems). Giải thuật RETE được phát triển bởi Charles Forgy vào năm 1979 và vẫn được sử dụng rộng rãi trong c

// Giải thuật RETE có thể đánh giá một tập hợp các quy tắc với các điều kiện
//phức tạp và các sự kiện đầu vào một cách hiệu quả. RETE cải thiện hiệu suất bằng cách lưu trữ các điều kiện của các quy tắc trong một cấu trúc dữ liệu được tối ưu hóa để nhanh chóng đối sánh với các sự kiện mới đầu vào.

// Do đó, RETE được sử dụng rộng rãi trong các hệ thống logic dựa trên quy tắc,
//các hệ thống trí tuệ nhân tạo, và các ứng dụng thương mại điện tử để phân tích và đưa ra các quyết định dựa trên các luật và dữ liệu đầu vào.

import { Engine } from "json-rules-engine";
import ruleModel from "../models/rule.model.js";

const changeStream = ruleModel.watch();
const ruleBradycardia = [];
const ruleNormal = [];
const ruleTachycardia = [];

async function getRules() {
  ruleModel.find({}).then((rules) => {
    console.log("🚀 ~ file: conditionsRule.js:22 ~ ruleModel.find ~ rules:", rules)
    rules.forEach((rule) => {
    if (rule.name === "Bradycardia") {
      ruleBradycardia.push(rule);
    } else if (rule.name === "Normal") {
      ruleNormal.push(rule);
    } else if (rule.name === "Tachycardia") {
      ruleTachycardia.push(rule);
    }
  });
    console.log("🚀 ~ file: conditionsRule.js:25 ~ ruleModel.find ~ ruleBradycardia:", ruleBradycardia)
  });
}

changeStream.on("change", (change) => {
  ruleModel
    .findOne({ _id: change.documentKey._id })
    .then((rules) => {
      if (rules.name === "Bradycardia") {
        ruleBradycardia.pop();
        ruleBradycardia.push(rules);
      } else if (rules.name === "Normal") {
        ruleNormal.pop();
        ruleNormal.push(rules);
      } else if (rules.name === "Tachycardia") {
        ruleTachycardia.pop();
        ruleTachycardia.push(rules);
      }
    })
    .catch((error) => {
      console.error("Error getting user:", error);
    });
});

const conditionRule = (bmp) => {
  if (
    bmp > ruleBradycardia[0].heartRateFrom &&
    bmp < ruleBradycardia[0].heartRateTo
  ) {
    return "Heart rate is falling, immediately check the heart rate monitor and monitor the patient's health status";
  } else if (
    bmp > ruleNormal[0].heartRateFrom &&
    bmp < ruleNormal[0].heartRateTo
  ) {
    return "This patient's heart rate is normal, please continue to monitor the patient's health.";
  } else if (
    bmp > ruleTachycardia[0].heartRateFrom &&
    bmp < ruleTachycardia[0].heartRateTo
  ) {
    return "The heart rate is increasing suddenly, now check the heart rate monitor again and monitor the patient's health status";
  } else {
    return "This patient's heart rate is too high, intervene immediately.";
  }
};

const conditionRuleHistory = (bmp) => {
  // Khai báo biến bpmHistory (lịch sử nhịp tim)
  let bpmHistory = bmp;

  // Khai báo biến highBpmCount (số lần nhịp tim giao động cao trong 5 phút)
  let highBpmCount = 0;

  // Kiểm tra lịch sử nhịp tim và tăng giá trị highBpmCount nếu nhịp tim cao
  for (let i = 0; i < bpmHistory.length; i++) {
    if (bpmHistory[i] > 100) {
      highBpmCount++;
    }
  }

  // Kiểm tra số lần nhịp tim giao động cao và in ra cảnh báo tương ứng
  if (highBpmCount > 3 && highBpmCount < 6) {
    console.log(
      "Bạn đã có nhiều lần nhịp tim giao động cao trong vòng 5 phút gần đây. Điều này có thể là dấu hiệu của một số vấn đề tim mạch như tăng huyết áp, loạn nhịp hoặc nhồi máu cơ tim. Hãy đến gặp bác sĩ để được kiểm tra và chẩn đoán chính xác."
    );
  } else if (highBpmCount >= 6) {
    console.log(
      "Bạn đã có quá nhiều lần nhịp tim giao động cao trong vòng 5 phút gần đây. Điều này có thể là dấu hiệu của các vấn đề tim mạch nghiêm trọng như nhồi máu cơ tim, rối loạn nhịp hay đột quỵ. Hãy gọi ngay xe cấp cứu hoặc đến gấp phòng cấp cứu để được chăm sóc và điều trị kịp thời."
    );
  } else {
    console.log("Nhịp tim của bạn trong khoảng bình thường.");
  }
};

const rule = {
  conditions: {
    all: [
      {
        fact: "customer",
        path: "$.age",
        operator: "greaterThanInclusive",
        value: 18,
      },
      {
        fact: "customer",
        path: "$.orders",
        operator: "greaterThan",
        value: 5,
      },
    ],
  },
  event: {
    type: "eligible for discount",
    params: {
      discount: 10,
    },
  },
};

// Tạo engine và thêm quy tắc
const engine = new Engine();
engine.addRule(rule);

// Kiểm tra dữ liệu đầu vào
const customer = {
  name: "John",
  age: 25,
  orders: 6,
};

// Thực hiện quy tắc và trả về kết quả
engine.run({ customer }).then((results) => {
  results.events.map((event) => console.log(event.params));
});

export default { conditionRule, conditionRuleHistory, getRules };
