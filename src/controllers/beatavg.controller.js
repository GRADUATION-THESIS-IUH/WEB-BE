
import responseHandler from "../handlers/response.handler.js";
import beatAvgModel from "../models/beatAvg.model.js";

const addBeatAvg = async (req, res) => {
  try {
    // const { patient_cccd, metric, ip_mac, measurements } = req.body;
    // const today = new Date();
    // const checkDocToDayAvgBeat = await beatAvgModel.findOne({date_received: today, patient_cccd: patient_cccd});
    // if(checkDocToDayAvgBeat)
    // {
    //   //checkDocToDayAvgBeat.measurements.push({})
    // }
    // else
    // {
    //   const beatavg = new beatAvgModel();
    //   beatavg.date_received = today;
    //   beatavg.patient_cccd = patient_cccd;
    //   beatavg.metric = metric;
    //   await beatavg.save();
    // }

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default {addBeatAvg}
