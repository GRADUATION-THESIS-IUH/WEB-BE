import responseHandler from "../handlers/response.handler.js";
import hospitalModel from "../models/hospital.model.js";

const addHospital = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const checkHospitalExist = await hospitalModel.findOne({ id });
    if (checkHospitalExist) return responseHandler.badrequest(res, "Hospital already exist");
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

export default { addHospital, getAllHospitalCBB };