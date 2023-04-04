// json-rules-engine dùng giải thuật RETE để thực thi các quy tắc

// Thư viện json-rules-engine dùng giải thuật RETE để thực thi các quy tắc. 
//RETE là một giải thuật dựa trên đồ thị được phát triển để xử lý các hệ thống chuyên gia (expert systems). Giải thuật RETE được phát triển bởi Charles Forgy vào năm 1979 và vẫn được sử dụng rộng rãi trong c

// Giải thuật RETE có thể đánh giá một tập hợp các quy tắc với các điều kiện 
//phức tạp và các sự kiện đầu vào một cách hiệu quả. RETE cải thiện hiệu suất bằng cách lưu trữ các điều kiện của các quy tắc trong một cấu trúc dữ liệu được tối ưu hóa để nhanh chóng đối sánh với các sự kiện mới đầu vào.

// Do đó, RETE được sử dụng rộng rãi trong các hệ thống logic dựa trên quy tắc, 
//các hệ thống trí tuệ nhân tạo, và các ứng dụng thương mại điện tử để phân tích và đưa ra các quyết định dựa trên các luật và dữ liệu đầu vào.

import { Engine } from "json-rules-engine";

const conditionRule = (bmp) => {
  if (bmp < 60) {
    return "Nhịp tim của bệnh nhân này thấp, có thể bị suy tim hoặc bệnh lý nhịp tim.";
  } else if (bmp >= 60 && bmp <= 100) {
    return "Nhịp tim của bệnh nhân này bình thường, nhưng nếu bạn có các triệu chứng như khó thở, đau ngực, chóng mặt, hoặc mệt mỏi, liên hệ bác sĩ để kiểm tra và đánh giá tình trạng sức khỏe của bệnh nhân";
  } else if (bmp > 100 && bmp <= 120) {
    return "Nhịp tim của bệnh nhân này cao, có thể là do tăng huyết áp, loạn nhịp, hoặc các vấn đề khác liên quan đến tim mạch. Liên hệ bác sĩ để kiểm tra sức khỏe và được chẩn đoán chính xác.";
  } else {
    return "Nhịp tim của bệnh nhân này quá cao, có thể là do nhồi máu cơ tim, loạn nhịp, hoặc các vấn đề tim mạch nghiêm trọng khác. Hãy đến gấp phòng cấp cứu hoặc gọi điện cho xe cấp cứu để được chăm sóc và điều trị kịp thời.";
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

export default { conditionRule, conditionRuleHistory };
