const { Router } = require("express");
const interviewController = require("../controllers/interview.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/file.middleware.js");

const interviewRouter = Router();

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self  description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

module.exports = interviewRouter;