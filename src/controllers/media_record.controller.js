import responseHandler from "../handlers/response.handler.js";
import mediaRecord from "../models/medicalRecord.model.js";
import patientModel from "../models/patient.model.js";
import doctorModel from "../models/doctor.model.js";
import hospitalModel from "../models/hospital.model.js";
import { v4 as uuidv4 } from "uuid";
import hearthbeatModel from "../models/hearthbeat.model.js";
import traiModel from "../utils/train.js";

const addMediaRecord = async (req, res) => {
  try {
  // const {
  //   patientId,
  //   doctorId,
  //   hospitalId,
  //   date_start,
  //   date_end,
  //   vital_signs,
  //   status,
  // } = req.body;
  const { mediaRecordFN } = req.body;
  console.log(
    "🚀 ~ file: media_record.controller.js:20 ~ addMediaRecord ~ mediaRecordFN:",
    mediaRecordFN
  );
  const id = uuidv4();
  // const checkPatiendId = await patientModel.findById(patientId);
  // const checkDoctorId = await doctorModel.findById(doctorId);
  // const checkHospitalId = await hospitalModel.findById(hospitalId);
  // if (!checkPatiendId)
  //   return responseHandler.badrequest(res, "Patient not exist");
  // if (!checkDoctorId)
  //   return responseHandler.badrequest(res, "Doctor not exist");
  // if (!checkHospitalId)
  //   return responseHandler.badrequest(res, "Hospital not exist");
  const vital_signsNew = [];
  vital_signsNew.push(mediaRecordFN.Age);
  vital_signsNew.push(parseInt(mediaRecordFN.gender));
  vital_signsNew.push(mediaRecordFN.CP);
  vital_signsNew.push(mediaRecordFN.Trestbps);
  vital_signsNew.push(mediaRecordFN.Chol);
  vital_signsNew.push(mediaRecordFN.Fbs);
  vital_signsNew.push(mediaRecordFN.Restecg);
  vital_signsNew.push(mediaRecordFN.Thalach);
  vital_signsNew.push(mediaRecordFN.Exang);
  vital_signsNew.push(mediaRecordFN.Oldpeak);
  vital_signsNew.push(mediaRecordFN.Slope);
  vital_signsNew.push(mediaRecordFN.Ca);
  vital_signsNew.push(mediaRecordFN.Thal);
  console.log(
    "🚀 ~ file: media_record.controller.js:45 ~ addMediaRecord ~ vital_signsNew:",
    vital_signsNew
  );
  const mediaRecordNew = new mediaRecord();
  mediaRecordNew.id = id;
  mediaRecordNew.patient = mediaRecordFN.patientId[0];
  mediaRecordNew.doctor = mediaRecordFN.doctorId[0];
  mediaRecordNew.hospital = mediaRecordFN.hospitalId[0];
  mediaRecordNew.iot_id = mediaRecordFN.IOT_Id[0];
  mediaRecordNew.date_start = mediaRecordFN.date_start;
  mediaRecordNew.date_end = mediaRecordFN.date_end;
  mediaRecordNew.vital_signs = vital_signsNew;
  mediaRecordNew.status = 1;
  console.log(
    "🚀 ~ file: media_record.controller.js:56 ~ addMediaRecord ~ mediaRecordNew:",
    mediaRecordNew
  );
  await mediaRecordNew.save();
  await patientModel.findByIdAndUpdate(mediaRecordFN.patientId[0], {
    $push: { status: true },
  });
  await hearthbeatModel.findByIdAndUpdate(mediaRecordFN.IOT_Id[0], {
    $push: { status: true },
  });
  responseHandler.ok(res);
  } catch {
  responseHandler.error(res);
  }
};

const getMediaRecord = async (req, res) => {
  const { date_start, date_end } = req.body;
  try {
    const listMediaRecord = await mediaRecord
      .find({
        date_start: { $gte: date_start, $lte: date_end },
      })
      .populate("patient")
      .populate("doctor")
      .populate("hospital")
      .populate("iot_id");

    const listMediaRecordFinal = await listMediaRecord.map((item, index) => {
      return {
        key: index + 1,
        ...item._doc,
      };
    });
    responseHandler.ok(res, listMediaRecordFinal);
  } catch (error) {
    responseHandler.error(res);
  }
};

const predictorMediaRecord = async (req, res) => {
  const {idMed } = req.body;
  try {
    const media_record = await mediaRecord.findById(idMed);
    console.log("🚀 ~ file: media_record.controller.js:109 ~ predictorMediaRecord ~ media_record:", media_record)
    const testTrain = traiModel(media_record.vital_signs)
  } catch (error) {
    responseHandler.error(res);
  }
};
export default { addMediaRecord, getMediaRecord, predictorMediaRecord };
