const { PDFParse } = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewReport.model.js");

async function generateInterviewReportController(req, res) {
    const resumeContent = await (new PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAI = await generateInterviewReport({ 
        resume: resumeContent.text, 
        selfDescription, 
        jobDescription 
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        
        ...interviewReportByAI
    });

    res.status(201).json({
        message: "Interview  report generated successfully",
        interviewReport
    });
}


module.exports = {
    generateInterviewReportController
}