
import Database from "better-sqlite3";

const db=Database("./db/data.db", {verbose:console.log})

const applicants=[
    {
        name:"Julia",
        age: 22,
        email: "julia@gmail.com"
    },
    {
        name:"Anya",
        age: 26,
        email: "anya@gmail.com"
    },
    {
        name:"Bob",
        age: 34,
        email: "bob@gmail.com"
    },
    {
        name:"Norman",
        age: 32,
        email: "norman@gmail.com"
    },
    {
        name:"Ross",
        age: 27,
        email: "ross@gmail.com"
    }
]

const interviewers=[
    {
        name: "James",
        age: 44,
        email:"james@gmail.com",

    },
    {
        name: "John",
        age: 29,
        email:"john@gmail.com",
    
    },
    {
        name: "Sam",
        age: 26,
        email:"sam@gmail.com",

    },
    {
        name: "Emma",
        age: 34,
        email:"emma@gmail.com",
    },
]

const interviews=[
    {
        applicantId:1,
        interviewerId:2,
        date: "05/9/22",
        score:58
    },
    {
        applicantId:1,
        interviewerId:4,
        date: "06/9/22",
        score:80
    },
    {
        applicantId:2,
        interviewerId:3,
        date: "06/9/22",
        score:25
    },
    {
        applicantId:2,
        interviewerId:1,
        date: "06/9/22",
        score:70
    },
    {
        applicantId:3,
        interviewerId:4,
        date: "06/9/22",
        score:100
    },
    {
        applicantId:3,
        interviewerId:3,
        date: "06/9/22",
        score:98
    },
    {
        applicantId:4,
        interviewerId:4,
        date: "06/9/22",
        score:28
    },
    {
        applicantId:4,
        interviewerId:1,
        date: "06/9/22",
        score:66
    },
    {
        applicantId:5,
        interviewerId:2,
        date: "06/9/22",
        score:84
    },
    {
        applicantId:5,
        interviewerId:3,
        date: "06/9/22",
        score:50
    },
]

const dropApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`)
dropApplicantsTable.run()

const createApplicantsTable= db.prepare(`
CREATE TABLE IF NOT EXISTS applicants(
    id INTEGER,
    name TEXT NOT NULL,
    age INTEGER NOT NULL, 
    email TEXT NOT NUll,
    PRIMARY KEY (id)
);
`)
createApplicantsTable.run()

const createApplicants=db.prepare(`
INSERT INTO applicants(name, age, email) VALUES(@name, @age, @email)
`)

for(let applicant of applicants){
    createApplicants.run(applicant)
}

const dropInterviewersTable=db.prepare(`
DROP TABLE IF EXISTS interviewers;
`)

dropInterviewersTable.run()

const createInterviewersTable= db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers(
    id INTEGER,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY(id)
)
`)
createInterviewersTable.run()


const createInterviewers=db.prepare(`
INSERT INTO interviewers(name, age, email) VALUES(@name, @age, @email)
`)

for(let interviewer of interviewers){
    createInterviewers.run(interviewer)
}

const dropInterviewsTable=db.prepare(`
DROP TABLE IF EXISTS interviews;
`)

dropInterviewsTable.run()

const createInterviewsTable= db.prepare(`
CREATE TABLE IF NOT EXISTS interviews(
    id INTEGER, 
    applicantId INTEGER,
    interviewerId INTEGER, 
    date TEXT NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (applicantId) REFERENCES  applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewerId) REFERENCES  interviewers(id) ON DELETE CASCADE
);
`)

createInterviewsTable.run()

const createInterviews=db.prepare(`
INSERT INTO interviews(applicantId, interviewerId, date, score) VALUES(@applicantId, @interviewerId, @date, @score)
`)

for(let interview of interviews){
    createInterviews.run(interview)
}