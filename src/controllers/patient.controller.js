import responseHandler from "../handlers/response.handler.js";
import patientModel from "../models/patient.model.js";
const addPatient = async (req, res) => {
  try {
    const { name, age, phone, gender, CCCD, hospital_id, status } = req.body;
    const checkPatientExist = await patientModel.findOne({ CCCD });
    if (checkPatientExist)
      return responseHandler.badrequest(res, "Patient already exist");
    const patient = new patientModel();
    patient.name = name;
    patient.age = age;
    patient.gender = gender;
    patient.phone = phone;
    patient.CCCD = CCCD;
    patient.hospital_id = hospital_id;
    patient.status = status;
    await patient.save();
    responseHandler.ok(res, patient);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getPatient = async (req, res) => {
  try {
    const patient = await patientModel.find().populate("hospital_id");
    if (!patient) {
      responseHandler.notFound(res);
    }
    const formatPatient = await patient.map((item, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        ...item._doc,
      };
    });
    responseHandler.ok(res, formatPatient);
  } catch {
    responseHandler.error(res);
  }
};

const getInactivePatient = async (req, res) => {
  try {
    const patient = await patientModel.find({status: false});
    if (!patient) {
      responseHandler.notFound(res);
    }
    const formatPatient = await patient.map((item, index) => {
      return {
        value: item._id,
        label: item.name + " - " + item.CCCD,
      };
    });
    responseHandler.ok(res, formatPatient);
  } catch {
    responseHandler.error(res);
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.body;
    const patientId = await patientModel.findById(id);
    if (!patientId) {
      responseHandler.notFound(res);
    }
    responseHandler.ok(res, patientId);
  } catch (error) {
    responseHandler.error(res);
  }
};

const updatePatientStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log("🚀 ~ file: patient.controller.js:77 ~ updatePatientStatus ~ status:", status)
    console.log("🚀 ~ file: patient.controller.js:77 ~ updatePatientStatus ~ id:", id)
    const patientId = await patientModel.findByIdAndUpdate(id, {
      status: status,
    });
    console.log("🚀 ~ file: patient.controller.js:82 ~ updatePatientStatus ~ patientId:", patientId)
    if (!patientId) {
      responseHandler.notFound(res);
    }
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { addPatient, getPatient, getInactivePatient, getPatientById, updatePatientStatus };
