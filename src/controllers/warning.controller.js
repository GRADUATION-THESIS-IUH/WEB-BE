import responseHandler from "../handlers/response.handler.js";
import warningModel from "../models/warning.model.js";
import espModel from "../models/hearthbeat.model.js";

const addWarning = async (req, res) => {
  try {
    const { war, ip_mac, date } = req.body;
    const espTemp = await espModel.findOne({ ip_mac: ip_mac });
    const warning = new warningModel();
    warning.warning = war;
    warning.ip_mac = ip_mac;
    warning.patient_cccd = espTemp.patient_cccd;
    warning.date = date;
    await warning.save();
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getWarning = async (req, res) => {
  try {
    const warning = await warningModel.find().sort({ date: -1 }).limit(5);
    responseHandler.ok(res, warning);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { addWarning, getWarning };
