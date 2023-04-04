
import responseHandler from "../handlers/response.handler.js";
import ConditionRule from "../models/conditionRule.model.js";

const addCondiRule = async (req, res) => {
  try {
    const { condi_name, ruleId} = req.body;
    const condiRule = await ConditionRule();
    const ruleIdFinnal = await Rule.findOne({ id: "7debb287-caea-4dcd-ae97-92287f8e265b" }).select("_id");
    condiRule.name = condi_name;
    condiRule.ruleId = ruleIdFinnal;
    await condiRule.save();
    responseHandler.ok(res, condiRule);
  } catch {
    responseHandler.error(res);
  }
}

export default {addCondiRule}
