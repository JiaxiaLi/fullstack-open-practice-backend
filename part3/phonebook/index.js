/*
 * @Author: lijiaxia
 * @Date: 2023-07-05 12:29:28
 * @Email: lijiaxia@3ncto.com
 * @FilePath: /fullstack-open-practice-backend/part3/phonebook/index.js
 * @LastEditors: lijiaxia
 * @LastEditTime: 2023-11-14 21:41:34
 */
const express = require("express");
const morgan = require("morgan");
const app = express();
morgan.token("params", function (req, res) {
    return JSON.stringify(req.body);
});


morgan.format('log',
    ":method :url :status :res[content-length] - :response-time ms :params "
)

app.use(
    morgan(
        'log'
    )
);
app.use(express.json());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const generateId = () => {
    const maxId =
        persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
    return maxId + 1;
};

app.get("/info", (request, response) => {
    let result = `<div>Phonebook has info for ${
        persons.length
    } people</div></br><div>${new Date()}</div>`;
    response.send(result);
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing",
        });
    }

    let index = persons.findIndex((person) => {
        return person.name === body.name;
    });

    if (index > -1) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }

    const person = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(person);
    console.log("persons",persons)
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(400).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
