import responseHandler from "../handlers/response.handler.js";
import beatAvgModel from "../models/beatAvg.model.js";

const getStatisticYear = async (req, res) => {
    const { ip_mac, year } = req.body;
    console.log("🚀 ~ file: statistic.controller.js:5 ~ getStatisticYear ~ year:", year)
    try {
      const beat_avgs = await beatAvgModel.aggregate([
        {
          $match: {
            ip_mac: ip_mac[0],
            date_received: { 
                $gte: new Date(parseInt(year), 0, 1), // Từ ngày 1 tháng 1 năm year
                $lt: new Date(parseInt(year) + 1, 0, 1) // Đến ngày 1 tháng 1 năm (year + 1)
              }
          },
        },
        {
          $addFields: {
            month: {
                $dateToString: { format: '%m/%Y', date: '$date_received' },
            },
          },
        },
        {
          $group: {
            _id: '$month',
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
            month: '$_id',
            avg: { $round: ["$avg", 1] }, // Làm tròn giá trị trung bình đến 1 số thập phân
            bp: { $arrayElemAt: ["$medicalrecords.bp", 0] },
            chol: { $arrayElemAt: ["$medicalrecords.chol", 0] },
          },
        },
        {
            $sort: { month: 1 },
        },
      ]);
      res.json({ beat_avgs });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  };
  

export default { getStatisticYear };
