import mongoose from "mongoose";
import responseHandler from "../handlers/response.handler.js";
import hearthbeatModel from "../models/hearthbeat.model.js";
import hospitalModel from "../models/hospital.model.js";

const addHearthBeat = async (req, res) => {
  try {
    const { hb } = req.body;
    console.log("🚀 ~ file: esp.controller.js:7 ~ addHearthBeat ~ hb:", hb);
    const checkHearthBeat = await hearthbeatModel.findOne({
      ip_mac: hb.ip_mac,
    });
    if (checkHearthBeat)
      return responseHandler.badrequest(res, "IP Mac already IP");
    const hbNew = new hearthbeatModel();
    hbNew.name_device = hb.name_device;
    hbNew.ip_mac = hb.ip_mac;
    hbNew.status = false;
    hbNew.hospital_id = hb.hospital_id;
    hbNew.patient_cccd = hb?.patient_cccd;

    await hbNew.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const updateHearthBeat = async (req, res) => {
  try {
  const { hb } = req.body;
  const checkHearthBeat = await hearthbeatModel.findOne({ _id: hb.id });
  console.log("🚀 ~ file: esp.controller.js:33 ~ updateHearthBeat ~ hb.ip_mac:", hb.ip_mac)
  if (!checkHearthBeat)
    return responseHandler.badrequest(res, "IP Mac not found");
  if (!mongoose.isValidObjectId(hb.hospital_id)) {
    const hospital_id_temp = await hospitalModel
      .findOne({
        name: hb.hospital_id,
      })
      .select("_id");
    checkHearthBeat.name_device = hb.name_device;
    checkHearthBeat.ip_mac = hb.ip_mac;
    checkHearthBeat.status = false;
    checkHearthBeat.hospital_id = hospital_id_temp;
    checkHearthBeat.patient_cccd = hb?.patient_cccd;
  }
  await checkHearthBeat.save();
  responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getHearthBeatAll = async (req, res) => {
  try {
    const hearthbeat = await hearthbeatModel
      .find()
      .populate("hospital_id")
      .populate("patient_cccd");
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
  } catch (error) {}
};

const getHearthBeatAllCBB = async (req, res) => {
  const { selectedHospital } = req.body;
  console.log(
    "🚀 ~ file: esp.controller.js:59 ~ getHearthBeatAllCBB ~ hospitalId:",
    selectedHospital[0]
  );
  try {
    const hearthbeat = await hearthbeatModel
      .find({
        status: false,
      })
      .populate("hospital_id");
    if (!hearthbeat) {
      responseHandler.notfound(res);
    }
    const formatHearthBeat = await hearthbeat.map((item) => {
      if (item._doc.hospital_id._id == selectedHospital[0])
        return {
          value: item._doc._id,
          label:
            item._doc.name_device +
            " - " +
            item._doc.ip_mac +
            " - " +
            item._doc.hospital_id.name,
        };
    });
    responseHandler.ok(res, formatHearthBeat);
  } catch (error) {
    console.log(
      "🚀 ~ file: esp.controller.js:81 ~ getHearthBeatAllCBB ~ error:",
      error
    );
    responseHandler.error(res);
  }
};

const updateHearthBeatStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const hearthbeat = await hearthbeatModel.findByIdAndUpdate(id, {
      status: status,
    });
    if (!hearthbeat) {
      responseHandler.notfound(res);
    }
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateHearthBeatPatientCCCD = async (req, res) => {
  //try {
  const { id, cccd } = req.body;
  console.log(
    "🚀 ~ file: esp.controller.js:107 ~ updateHearthBeatPatientCCCD ~ cccd:",
    cccd
  );
  const hearthbeat = await hearthbeatModel.findByIdAndUpdate(id, {
    patient_cccd: cccd,
  });
  console.log(
    "🚀 ~ file: esp.controller.js:111 ~ updateHearthBeatPatientCCCD ~ hearthbeat:",
    hearthbeat
  );
  if (!hearthbeat) {
    responseHandler.notfound(res);
  }
  responseHandler.ok(res, hearthbeat);
  // }
  // catch (error) {
  //   responseHandler.error(res);
  // }
};

const getHearthBeatFromIpMac = async (req, res) => {
  try {
    const { ip_mac } = req.body;
    const hearthbeat = await hearthbeatModel
      .findOne({ ip_mac })
      .select("patient_cccd")
      .populate("patient_cccd");
    if (!hearthbeat) {
      responseHandler.notfound(res);
    }
    responseHandler.ok(res, hearthbeat);
  } catch (error) {
    responseHandler.error(res);
  }
};

const deleteHearthBeat = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await hearthbeatModel.deleteMany({ _id: { $in: id } });
    responseHandler.ok(res, result);
  } catch (error) {
    responseHandler.error(res);
  }
}

export default {
  addHearthBeat,
  updateHearthBeat,
  getHearthBeatAll,
  getHearthBeatAllCBB,
  updateHearthBeatStatus,
  updateHearthBeatPatientCCCD,
  getHearthBeatFromIpMac,
  deleteHearthBeat
};
