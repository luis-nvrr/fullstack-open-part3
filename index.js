const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
morgan.token("body", function getBody(request) {
  return JSON.stringify(request.body);
});

const app = express();

app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (request, response) => {
  response.send("<h1> Hello World </h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number.parseInt(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number.parseInt(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const foudPerson = persons.find((person) => person.name === body.name);

  if (foudPerson) {
    return response.status(400).json({
      error: "name already exists on the phonebook",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  console.log(person);

  response.json(person);
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.trunc(Math.random() * 100000000) : 0;
  return maxId + 1;
};

app.get("/info", (request, response) => {
  const count = persons.length;
  const date = new Date().toString();
  console.log(response);
  response.send(`<p> Phonebook has info for ${count} people </p>
  <p> ${date} </p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
