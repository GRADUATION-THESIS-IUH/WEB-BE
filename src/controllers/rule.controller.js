
import responseHandler from "../handlers/response.handler.js";
import ruleModel from "../models/rule.model.js";
import { v4 as uuidv4 } from 'uuid';

const addRule = async (req, res) => {
  try {
    const { name, description, rules} = req.body;
    const rule = await ruleModel();
    rule.id = uuidv4();
    rule.name = name;
    rule.description = description;
    rule.rules = rules;
    await rule.save();
    responseHandler.ok(res, rule);
  } catch {
    responseHandler.error(res);
  }
}

export default {addRule}
