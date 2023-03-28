import responseHandler from "../handlers/response.handler";
import hearthbeatModel from "../models/hearthbeat.model";

const addHearthBeat = async (req, res) => {
  try {
    const { name, mac, hospital, status } = req.body;
    const checkHearthBeat = await hearthbeat.findOne({ mac });
    if (checkHearthBeat)
      return responseHandler.badrequest(res, "IP Mac already IP");

    const hb = new hearthbeatModel();
    hb.name_device = name;
    hb.ip_mac = mac;
    hb.status = status;
    hb.hospital = hospital;

    await hb.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};
