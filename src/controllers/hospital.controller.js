import e from "express";
import responseHandler from "../handlers/response.handler.js";
import hospitalModel from "../models/hospital.model.js";
import { v4 as uuidv4 } from 'uuid';

const addHospital = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const id = uuidv4();
    const checkHospitalExist = await hospitalModel.findOne({ id });
    if (checkHospitalExist) return responseHandler.badrequest(res, "Hospital already exist");
    const hospital = new hospitalModel();
    hospital.id = id;
    hospital.name = name;
    hospital.address = address;
    hospital.phone = phone;
    await hospital.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default { addHospital };