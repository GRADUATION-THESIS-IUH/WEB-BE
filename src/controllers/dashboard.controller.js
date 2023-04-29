import responseHandler from "../handlers/response.handler.js";
import doctorModel from "../models/doctor.model.js";
import patientModel from "../models/patient.model.js";
import espModel from "../models/hearthbeat.model.js";
import hospitalModel from "../models/hospital.model.js";
import mediaRecordModel from "../models/medicalRecord.model.js";
import ruleModel from "../models/rule.model.js";
import moment from "moment";
import beatAvgModel from "../models/beatAvg.model.js";
import medicalRecordModel from "../models/medicalRecord.model.js";

const getDashBoardCard = async (req, res) => {
  try {
    const listDBCard = [];
    const doctor = await doctorModel.distinct("email");
    const patient = await patientModel.distinct("CCCD");
    const esp = await espModel.distinct("ip_mac");
    const hospital = await hospitalModel.distinct("phone");
    const rule = await ruleModel.distinct("id");
    const mediaRecord = await mediaRecordModel.distinct("_id");
    // if(!doctor || !patient || !esp || !hospital)
    // {
    //   responseHandler.notFound(res);
    // }
    listDBCard.push(doctor.length);
    listDBCard.push(patient.length);
    listDBCard.push(esp.length);
    listDBCard.push(hospital.length);
    listDBCard.push(rule.length);
    listDBCard.push(mediaRecord.length);
    responseHandler.ok(res, listDBCard);
  } catch {
    responseHandler.error(res);
  }
};

const getDashBoardChartWeek = async (req, res) => {
  const { ip_mac } = req.body;
  console.log("🚀 ~ file: dashboard.controller.js:39 ~ getDashBoardChartWeek ~ ip_mac:", ip_mac[0])
  try {
    const dateRange = moment().startOf("day").subtract(6, "days");
    const beat_avgs = await beatAvgModel.aggregate([
      {
        $match: {
          ip_mac: ip_mac[0],
          date_received: { $gte: dateRange.toDate() },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: "%d/%m/%Y", date: "$date_received" },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          avg: {
            $avg: { $toDouble: "$avg" },
          },
        },
      },
      {
        $lookup: {
          from: "medicalrecords",
          let: { date_received: "$date_received" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$date_received", "$$date_received"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                bp: { $arrayElemAt: ["$vital_signs", 3] },
                chol: { $arrayElemAt: ["$vital_signs", 4] },
              },
            },
          ],
          as: "medicalrecords",
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          avg: { $round: ["$avg", 1] }, // Làm tròn giá trị trung bình đến 1 số thập phân
          bp: { $arrayElemAt: ["$medicalrecords.bp", 0] },
          chol: { $arrayElemAt: ["$medicalrecords.chol", 0] },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    res.json({ beat_avgs });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};



export default { getDashBoardCard, getDashBoardChartWeek };
