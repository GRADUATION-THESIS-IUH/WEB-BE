
import responseHandler from "../handlers/response.handler.js";
import doctorModel from "../models/doctor.model.js";

const addDoctor = async (req, res) => {
  try {
    const { name, phone, specialist, email, hospitalName } = req.body;
    const doctorTemp = await doctorModel.findOne({ phone: phone });
    if(doctorTemp) return responseHandler.badRequest(res, "Doctor already exist");
    const doctor = new doctorModel();
    doctor.name = name;
    doctor.phone = phone;
    doctor.specialist = specialist;
    doctor.email = email;
    doctor.hospitalName = hospitalName;
    await doctor.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.distinct("specialist");
    if(!doctor)
    {
      responseHandler.notFound(res);
    }
    responseHandler.ok(res, doctor);
  } catch {
    responseHandler.error(res);
  }
}

const getAllDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.find();
    if(!doctor)
    {
      responseHandler.notFound(res);
    }
    const formatDoctor = await doctor.map((item, index) => {
      return {
        key: index + 1,
        stt: index + 1,
        ...item._doc
      }
    })
    responseHandler.ok(res, formatDoctor);
  } catch {
    responseHandler.error(res);
  }
}

const getAllDoctorCBB = async (req, res) => {
  try {
    const doctor = await doctorModel.find();
    if(!doctor)
    {
      responseHandler.notFound(res);
    }
    const formatDoctor = await doctor.map((item) => {
      return {
        value: item._id,
        label: item.name + " - " + item.hospitalName + " - " + item.specialist
      }
    })
    responseHandler.ok(res, formatDoctor);
  } catch {
    responseHandler.error(res);
  }
}
export default {addDoctor,getAllDoctor, getDoctor, getAllDoctorCBB}
