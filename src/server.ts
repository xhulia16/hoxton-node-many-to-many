import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const db = Database("./db/data.db", { verbose: console.log })
const app = express()
app.use(cors())
app.use(express.json())

const port = 5000

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

app.get('/', (req, res) => {
    res.send("hello")
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


app.listen(port)