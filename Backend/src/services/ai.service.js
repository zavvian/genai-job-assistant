const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().min(1).max(100).describe("A score between 1 and 100 indicating how well the candidate's performance matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in an interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in an interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of the skill gap, can be low, medium or high")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The focus of the day, what to study, what to practice etc."),
        tasks: z.array(z.string().describe("List of tasks to be done on this day to follow the preparation plan, e.g. practice coding questions, read articles, watch videos etc."))
    }).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"))
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for the candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
                    `;

    const rawSchema = z.toJSONSchema(interviewReportSchema);
    delete rawSchema.$schema;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: rawSchema,
        }
    });

    return JSON.parse(response.text);
}

module.exports = generateInterviewReport;

