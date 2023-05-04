import responseHandler from "../handlers/response.handler.js";
import hearthbeatModel from "../models/hearthbeat.model.js";
import hospitalModel from "../models/hospital.model.js";
import { v4 as uuidv4 } from "uuid";

const addHospital = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const checkHospitalExist = await hospitalModel.findOne({
      name,
      address,
      phone,
    });
    if (checkHospitalExist)
      return responseHandler.badrequest(res, "Hospital already exist");
    const hospital = new hospitalModel();
    hospital.id = uuidv4();
    hospital.name = name;
    hospital.address = address;
    hospital.phone = phone;
    await hospital.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getAllHospitalCBB = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find();
    const hospitalCBB = hospitals.map((hospital) => {
      return {
        value: hospital._id,
        label: hospital.name,
      };
    });
    responseHandler.ok(res, hospitalCBB);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

const getAllHospital = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find();
    const formatHospital = await hospitals.map((item, index) => {
      return {
        key: item._id,
        stt: index + 1,
        ...item._doc,
      };
    });
    responseHandler.ok(res, formatHospital);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

const getAllHospitalTop5Device = async (req, res) => {
  try {
    const result = await hearthbeatModel.aggregate([
      { $group: { _id: "$hospital_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const populatedResult = await hospitalModel.populate(result, {
      path: "_id",
    });
    while (populatedResult.length < 5) {
      populatedResult.push({
        _id: null,
        count: null,
      });
    }
    responseHandler.ok(res, populatedResult);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

const updateHospital = async (req, res) => {
  try {
    const { hospitalUD } = req.body;
    console.log(
      "🚀 ~ file: hospital.controller.js:84 ~ updateHospital ~ hospitalUD:",
      hospitalUD
    );
    const hospital = await hospitalModel.findById(hospitalUD.id);
    if (!hospital) {
      responseHandler.notFound(res);
    }
    hospital.id = hospitalUD.id;
    hospital.name = hospitalUD.name;
    hospital.address = hospitalUD.address;
    hospital.phone = hospitalUD.phone;
    await hospital.save();
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

const deleteHospital = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await hospitalModel.deleteMany({ _id: { $in: id } });
    responseHandler.ok(res, result);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  addHospital,
  getAllHospitalCBB,
  getAllHospital,
  getAllHospitalTop5Device,
  updateHospital,
  deleteHospital,
};
