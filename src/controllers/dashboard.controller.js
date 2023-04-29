
import responseHandler from "../handlers/response.handler.js";
import doctorModel from "../models/doctor.model.js";
import patientModel from "../models/patient.model.js";
import espModel from "../models/hearthbeat.model.js";
import hospitalModel from "../models/hospital.model.js";
import mediaRecordModel from "../models/medicalRecord.model.js";

const getDashBoardCard = async (req, res) => {
  try {
    const listDBCard = [];
    const doctor = await doctorModel.distinct("email");
    const patient = await patientModel.distinct("CCCD");
    const esp = await espModel.distinct("ip_mac");
    const hospital = await hospitalModel.distinct("phone");
    const mediaRecord = await mediaRecordModel.distinct("_id");
    // if(!doctor || !patient || !esp || !hospital)
    // {
    //   responseHandler.notFound(res);
    // }
    listDBCard.push(doctor.length);
    listDBCard.push(patient.length);
    listDBCard.push(esp.length);
    listDBCard.push(hospital.length);
    listDBCard.push(0);
    listDBCard.push(mediaRecord.length);
    responseHandler.ok(res, listDBCard);
  } catch {
    responseHandler.error(res);
  }
}

export default {getDashBoardCard}
