import espController from "../controllers/esp.controller.js";
import hearthbeatModel from "../models/hearthbeat.model.js"


const checkStatusIOT = async (mac) => {
    const res = await hearthbeatModel.findOne({ip_mac: mac})
    return res;
}

export default {checkStatusIOT}