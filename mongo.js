const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide the password as an argument, and optionally the data");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@development.qxdnd.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const listPersons = () => {
  let message = "phonebook: \n";

  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      message = message.concat(person.name, " ", person.number, "\n");
    });
    console.log(message);
    mongoose.connection.close();
  });
};

const savePerson = () => {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  listPersons();
} else {
  savePerson();
}
