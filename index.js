const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let phonenumbers = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phonenumbers)
})

app.get('/info', (req, res) => {
    const length = phonenumbers.length
    const time = Date().toLocaleString()
    res.send(`<p>Phonebook has info for ${length} people.</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phonenumbers.find(per => per.id === id)

    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    // create new array with everyone repeated except said person
    phonenumbers = phonenumbers.filter(per => per.id !== id)
  
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*200)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: "no input detected"
        })
    }

    const search = phonenumbers.find(per => body.name === per.name)

    if(search) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const newPhone = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    phonenumbers = phonenumbers.concat(newPhone)

    res.json(newPhone)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})