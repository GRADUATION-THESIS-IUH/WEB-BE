
import responseHandler from "../handlers/response.handler.js";
import beatAvgModel from "../models/beatAvg.model.js";

const addBeatAvg = async (req, res) => {
  try {
    const { mac, avg, patient_cccd } = req.body;
    const today = new Date();
    const beatavg = new beatAvgModel();
    beatavg.ip_mac = mac;
    beatavg.avg = avg;
    beatavg.date = today;
    beatavg.patient_cccd = patient_cccd;
    await beatavg.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default {addBeatAvg}
