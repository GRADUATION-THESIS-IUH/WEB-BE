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
    const { mediaRecordFN } = req.body;
    const id = uuidv4();
    const vital_signsNew = [];
    vital_signsNew.push(mediaRecordFN.Age);
    vital_signsNew.push(mediaRecordFN.gender === "Male" ? 1 : 0);
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
    const mediaRecordNew = new mediaRecord();
    mediaRecordNew.id = id;
    mediaRecordNew.patient = mediaRecordFN.patientId[0];
    mediaRecordNew.doctor = mediaRecordFN.doctorId[0];
    mediaRecordNew.hospital = mediaRecordFN.hospitalId[0];
    mediaRecordNew.iot_id = mediaRecordFN.IOT_Id[0];
    mediaRecordNew.date_start = mediaRecordFN.date_start;
    mediaRecordNew.date_end = mediaRecordFN.date_end;
    mediaRecordNew.vital_signs = vital_signsNew;
    mediaRecordNew.target = 0;
    mediaRecordNew.status = 1;
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
  const { idMed } = req.body;
  try {
    const media_record = await mediaRecord.findById(idMed);
    const testTrain = await traiModel(media_record.vital_signs);
    await mediaRecord.findByIdAndUpdate(idMed, {
      $set: { target: testTrain },
    });
    responseHandler.ok(res, testTrain);
  } catch (error) {
    responseHandler.error(res);
  }
};

const endMediaRecord = async (req, res) => {
  const { idMed } = req.body;
  try {
    const data = await mediaRecord.findByIdAndUpdate(idMed, {
      $set: { status: 0, date_end: new Date() },
    });
    responseHandler.ok(res, data);
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateMediaRecord = async (req, res) => {
  try {
    const { id, data } = req.body;
    console.log(
      "🚀 ~ file: media_record.controller.js:105 ~ updateMediaRecord ~ id:",
      data
    );
    const {
      cp,
      trestbps,
      chol,
      fbs,
      restecg,
      thalach,
      exang,
      oldpeak,
      slope,
      ca,
      thal,
    } = data;
    const oldRecord = await mediaRecord.findById(id);
    const newVitalSigns = [
      oldRecord.vital_signs[0],
      oldRecord.vital_signs[1],
      cp,
      trestbps,
      chol,
      fbs,
      restecg,
      thalach,
      exang,
      oldpeak,
      slope,
      ca,
      thal,
    ];
    const updateMediaRecord = await mediaRecord.findByIdAndUpdate(id, {
      $set: { vital_signs: newVitalSigns },
    }, {new: true}).populate("patient").populate("doctor").populate("hospital").populate("iot_id");
    responseHandler.ok(res, updateMediaRecord);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  addMediaRecord,
  getMediaRecord,
  predictorMediaRecord,
  endMediaRecord,
  updateMediaRecord,
};
