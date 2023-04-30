import responseHandler from "../handlers/response.handler.js";
import doctorModel from "../models/doctor.model.js";
import hospitalModel from "../models/hospital.model.js";

const addDoctor = async (req, res) => {
  //try {
    const { doctorNew } = req.body;
    console.log("🚀 ~ file: doctor.controller.js:7 ~ addDoctor ~ doctorNew:", doctorNew.doctor)
    const doctorTemp = await doctorModel.findOne({ phone: doctorNew.phone });
    if (doctorTemp)
      return responseHandler.badRequest(res, "Doctor already exist");
    const doctor = new doctorModel();
    doctor.name = doctorNew.doctor.name;
    doctor.phone = doctorNew.doctor.phone;
    doctor.specialist = doctorNew.doctor.specialist;
    doctor.email = doctorNew.doctor.email;
    doctor.hospital_id = doctorNew.doctor.Hospital_Id;
    await doctor.save();
    responseHandler.ok(res);
  // } catch {
  //   responseHandler.error(res);
  // }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.distinct("specialist");
    if (!doctor) {
      responseHandler.notFound(res);
    }
    responseHandler.ok(res, doctor);
  } catch {
    responseHandler.error(res);
  }
};

const getAllDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.find().populate("hospital_id");
    if (!doctor) {
      responseHandler.notFound(res);
    }
    const formatDoctor = await doctor.map((item, index) => {
      return {
        key: item._id,
        stt: index + 1,
        ...item._doc,
      };
    });
    responseHandler.ok(res, formatDoctor);
  } catch {
    responseHandler.error(res);
  }
};

const getAllDoctorCBB = async (req, res) => {
  try {
    const doctor = await doctorModel.find().populate("hospital_id");
    if (!doctor) {
      responseHandler.notFound(res);
    }
    const formatDoctor = await doctor.map((item) => {
      return {
        value: item._id,
        label: item.name + " - " + item.hospital_id.name + " - " + item.specialist,
      };
    });
    responseHandler.ok(res, formatDoctor);
  } catch {
    responseHandler.error(res);
  }
};
export default { addDoctor, getAllDoctor, getDoctor, getAllDoctorCBB };
