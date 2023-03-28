import tf from "@tensorflow/tfjs-node";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
// Đọc dữ liệu từ file CSV
const data = [];
//console.log(__dirname);
fs.createReadStream(`${__dirname}/heart.csv`)
  .pipe(csv())
  
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    console.log('Đọc dữ liệu xong');
    // Chuyển dữ liệu sang định dạng số
    const inputData = data.map((row) => {
      return [
        parseInt(row.age),
        parseInt(row.sex),
        parseInt(row.cp),
        parseInt(row.trestbps),
        parseInt(row.chol),
        parseInt(row.fbs),
        parseInt(row.restecg),
        parseInt(row.thalach),
        parseInt(row.exang),
        parseFloat(row.oldpeak),
        parseInt(row.slope),
        parseInt(row.ca),
        parseInt(row.thal)
      ];
    });
    const outputData = data.map((row) => {
      return parseInt(row.target) > 0 ? 1 : 0;
    });
    // Tạo mô hình
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [13], units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    // Compile model với hàm loss và optimizer
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
    // Train mô hình
    console.log('Bắt đầu train mô hình', inputData);
    const xs = tf.tensor2d(inputData);
    const ys = tf.tensor2d(outputData, [outputData.length, 1]);
    model.fit(xs, ys, {
      epochs: 50,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
        }
      },
    }).then(() => {
      console.log('Train mô hình xong');
      //saveModel(model);
      // Dự đoán
      const newPatient = tf.tensor2d([[45, 1, 2, 110, 264, 0, 0, 132, 0, 1.2, 1, 0, 2]]);
      run(newPatient);
      //const prediction = model.predict(newPatient);
      //console.log(`Khả năng mắc bệnh tim mạch: ${prediction.dataSync()[0]}`);
    });
  });

  async function saveModel(model) {
    const saveResult = await model.save(`file://${__dirname}/model`);
    console.log('Đã lưu trữ mô hình thành công!');
  }

  async function runModel(inputData) {
    // Tải mô hình đã lưu vào biến `model`
    const model = await tf.loadLayersModel(`file://${__dirname}/model/model.json`);
    
    // Chuyển dữ liệu sang định dạng Tensor và dự đoán kết quả
    //const inputData = tf.tensor2d(data);
    const prediction = model.predict(inputData);
  
    // In kết quả dự đoán
    console.log(`Khả năng mắc bệnh tim mạch: ${prediction.dataSync()[0]}`);
  }

  export default runModel;