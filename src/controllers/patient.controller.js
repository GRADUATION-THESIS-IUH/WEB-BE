import responseHandler from "../handlers/response.handler.js";
import patientModel from "../models/patient.model.js";

const addPatient = async (req, res) => {
  try {
    const { name, age, phone, CCCD, hospital_id, status } = req.body;
    const checkPatientExist = await patientModel.findOne({ CCCD });
    if (checkPatientExist)
      return responseHandler.badrequest(res, "Patient already exist");
    const patient = new patientModel();
    patient.name = name;
    patient.age = age;
    patient.phone = phone;
    patient.CCCD = CCCD;
    patient.hospital_id = hospital_id;
    patient.status = status;
    await patient.save();
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { addPatient };
