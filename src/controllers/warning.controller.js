import responseHandler from "../handlers/response.handler.js";
import warningModel from "../models/warning.model.js";

const addWarning = async (req, res) => {
  try {
    const { war, date } = req.body;
    const warning = new warningModel();
    warning.warning = war;
    warning.date = date;
    await warning.save();
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { addWarning };