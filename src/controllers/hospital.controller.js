import responseHandler from "../handlers/response.handler.js";
import hearthbeatModel from "../models/hearthbeat.model.js";
import hospitalModel from "../models/hospital.model.js";

const addHospital = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const checkHospitalExist = await hospitalModel.findOne({ id });
    if (checkHospitalExist)
      return responseHandler.badrequest(res, "Hospital already exist");
    const hospital = new hospitalModel();
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
    responseHandler.ok(res, hospitals);
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
    const populatedResult = await hospitalModel.populate(result, { path: "_id" });
    while (populatedResult.length < 5) {
      populatedResult.push({
        _id: null,
        count: null,
      });
    }
    responseHandler.ok(res, populatedResult);
  }
  catch (error) {
    responseHandler.error(res, error);
  }
}

export default { addHospital, getAllHospitalCBB, getAllHospital, getAllHospitalTop5Device };
