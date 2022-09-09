const express = require("express");
const { getPlanController, updatePlanController, deletePlanController, getAllPlansController, createPlanController } = require("../controller/planController");
const planRouter = express.Router();



planRouter.route("/")
    .get(getAllPlansController)
    .post(createPlanController)



planRouter.route("/:planRoutes")
    .get(getPlanController)
    .patch(updatePlanController)
    .delete(deletePlanController)

module.exports = planRouter