import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const db = Database("./db/data.db", { verbose: console.log })
const app = express()
app.use(cors())
app.use(express.json())

const port = 5000

const getApplicants = db.prepare(`
SELECT * FROM applicants;
`)

const getInterviewers = db.prepare(`
SELECT * FROM interviewers;
`)

const getInterviews = db.prepare(`
SELECT * FROM interviews;
`)

const getSingleApplicant = db.prepare(`
SELECT * FROM applicants WHERE id=@id;
`)

const getInterviewsForApplicant = db.prepare(`
SELECT * FROM interviews WHERE applicantId=@applicantId;
`)


const getInterviewsForInterviewer = db.prepare(`
SELECT * FROM interviews WHERE interviewerId=@interviewerId;
`)

const getSingleInterviewer = db.prepare(`
SELECT * FROM interviewers WHERE id=@id;
`)

const getSingleInterview= db.prepare(`
SELECT * FROM interviews WHERE id=@id
`)

const postNewApplicant = db.prepare(`
INSERT INTO applicants(name, age, email) VALUES(@name, @age, @email)
`)

const postNewInterviewer = db.prepare(`
INSERT INTO interviewers(name, age, email) VALUES(@name, @age, @email)
`)

const postNewInterview= db.prepare(`
INSERT INTO interviews(applicantId, interviewerId, date, score) VALUES(@applicantId, @interviewerId, @date, @score)
`)


app.get('/', (req, res) => {
    res.send("hello")
})

app.get('/applicants', (req, res) => {
    const applicants = getApplicants.all()
    res.send(applicants)
})

app.get('/interviewers', (req, res) => {
    const interviewers = getInterviewers.all()
    res.send(interviewers)
})

app.get('/interviews', (req, res) => {
    const interviews = getInterviews.all()
    res.send(interviews)
})

app.get('/applicants/:id', (req, res) => {
    const applicant = getSingleApplicant.get(req.params)
    if (applicant) {
        applicant.interviews = getInterviewsForApplicant.all({ applicantId: applicant.id })
        for (let interview of applicant.interviews) {
            interview.interviewer = getSingleInterviewer.get({ id: interview.interviewerId })
        }

        res.send(applicant)
    }
    else {
        res.status(404).send({ error: "Applicant not found!" })
    }
})

app.get('/interviewers/:id', (req, res) => {
    const interviewer = getSingleInterviewer.get(req.params)
    if (interviewer) {
        interviewer.interviews = getInterviewsForInterviewer.all({ interviewerId: interviewer.id })
        for (let interview of interviewer.interviews) {
            interview.applicant = getSingleApplicant.get({ id: interview.applicantId })
        }
        res.send(interviewer)
    }
    else {
        res.status(404).send({ error: "Interviewer not found!" })
    }
})

app.post('/applicants', (req, res) => {
    const errors: string[] = []

    if (typeof req.body.name !== "string") {
        errors.push("Please enter a valid name")
    }
    if (typeof req.body.age !== "number") {
        errors.push("Please enter a valid age")
    }
    if (typeof req.body.email !== "string") {
        errors.push("Please enter a valid email")
    }

    if (errors.length === 0) {
        const applicantInfo = postNewApplicant.run(req.body)
        const applicant = getSingleApplicant.get({ id: applicantInfo.lastInsertRowid })
        res.send(applicant)
    }
    else {
        res.status(400).send({ errors: errors })
    }
})

app.post('/interviewers', (req, res) => {
    const errors: string[] = []

    if (typeof req.body.name !== "string") {
        errors.push("Please enter a valid name")
    }
    if (typeof req.body.age !== "number") {
        errors.push("Please enter a valid age")
    }
    if (typeof req.body.email !== "string") {
        errors.push("Please enter a valid email")
    }

    if (errors.length === 0) {
        const InterviewerInfo = postNewInterviewer.run(req.body)
        const interviewer = getSingleInterviewer.get({ id: InterviewerInfo.lastInsertRowid })
        res.send(interviewer)
    }
    else {
        res.status(400).send({ errors: errors })
    }
})

app.post('/interviews', (req, res) => {
    const errors: string[] = []


    if (typeof req.body.applicantId !== "number") {
        errors.push("Please enter a valid applicant ID")
    }
    if (typeof req.body.interviewerId !== "number") {
        errors.push("Please enter a valid interviewer ID")
    }
    if (typeof req.body.date !== "string") {
        errors.push("Please enter a valid date")
    }
    if (typeof req.body.score !== "number") {
        errors.push("Please enter a valid score")
    }

    if (errors.length === 0) {
        const InterviewInfo = postNewInterview.run(req.body)
        const interview = getSingleInterview.get({ id: InterviewInfo.lastInsertRowid })
        res.send(interview)
    }
    else {
        res.status(400).send({ errors: errors })
    }
})

app.listen(port)