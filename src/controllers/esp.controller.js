
import responseHandler from "../handlers/response.handler.js";
import hearthbeatModel from "../models/hearthbeat.model.js";

const addHearthBeat = async (req, res) => {
  try {
    const { mac, hospital_id, patient_cccd} = req.body;
    const checkHearthBeat = await hearthbeatModel.findOne({ mac });
    if (checkHearthBeat)
      return responseHandler.badrequest(res, "IP Mac already IP");
      let macAddress = mac;
      macAddress = macAddress.replace(/:/g, "");
    const hb = new hearthbeatModel();
    hb.name_device = "HBEAT" + macAddress;
    hb.ip_mac = mac;
    hb.status = false;
    hb.hospital_id = hospital_id;
    hb.patient_cccd = patient_cccd;
    
    await hb.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const updateHearthBeat = async (req, res) => {
  try {
    const {ip_mac, patient_cccd} = req.body;
    const hb = await hearthbeatModel.findOne({ip_mac});
    if(!hb) return responseHandler.badrequest(res, "IP Mac not found");
    hb.patient_cccd = patient_cccd;
    console.log("🚀 ~ file: esp.controller.js:33 ~ updateHearthBeat ~ hb:", hb)
    await hb.updateOne(hb);
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};


const getHearthBeatAll = async (req, res) => {
  try {
    const hearthbeat = await hearthbeatModel.find().populate("hospital_id");
    if (!hearthbeat) {
      responseHandler.notfound(res);
    }
    const formatHearthBeat = await hearthbeat.map((item, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        ...item._doc,
      };
    });
    responseHandler.ok(res, formatHearthBeat);   
  } catch (error) {
    
  }
}

const getHearthBeatAllCBB = async (req, res) => {
  try {
    const hearthbeat = await hearthbeatModel.find({status: false}).populate("hospital_id");
    if (!hearthbeat) {
      responseHandler.notfound(res);
    }
    const formatHearthBeat = await hearthbeat.map((item, index) => {
      return {
        value: item._doc._id,
        label: item._doc.name_device + " - " + item._doc.ip_mac + " - " + item._doc.hospital_id.name,
      };
    });
    responseHandler.ok(res, formatHearthBeat);   
  } catch (error) {
    
  }
}
export default {addHearthBeat, updateHearthBeat, getHearthBeatAll, getHearthBeatAllCBB}
