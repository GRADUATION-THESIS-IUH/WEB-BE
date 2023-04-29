import responseHandler from "../handlers/response.handler.js";
import ruleModel from "../models/rule.model.js";
import { v4 as uuidv4 } from "uuid";

const updateRule = async (req, res) => {
  try {
    const {name, from, to} = req.body;
    const update = await ruleModel.findOneAndUpdate({name: name}, {heartRateFrom: from, heartRateTo: to});
    responseHandler.ok(res, update);
  } catch {
    responseHandler.error(res);
  }
};

const getRule = async (req, res) => {
  try {
    const rule = await ruleModel.find();
    responseHandler.ok(res, rule);
  } catch {
    responseHandler.error(res);
  }
};

const addRule = async (req, res) => {
  try {
    const { name, from, to } = req.body;
    const rulezz = new ruleModel();
    rulezz.id = uuidv4();
    rulezz.name = name;
    rulezz.heartRateFrom = from;
    rulezz.heartRateTo = to;
    await rulezz.save();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default { updateRule, getRule, addRule };
