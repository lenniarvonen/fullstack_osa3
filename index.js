const { response } = require("express")
const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

morgan.token("data", (req) => {
    return JSON.stringify(req.body)
})

let numbers = [
    {
        id: 1,
        name: "Lenni Arvonen",
        number: "0458926111"
    },

    {
        id: 2,
        name: "Teemu Arvonen",
        number: "0407625432"
    }

]


app.post("/api/numbers", (req, res) => {
    const body = req.body

    //Jos nimeä tai numeroa ei ole --> 400 (content missing)
    if (!body.name || !body.number){
        return res.status(400).json({
            error: "content missing"
        })
    }



    //Jos nimi on sama kuin on jo --> 400 (name must be unique)
    let notUnique = false

    numbers.forEach(number => {

        console.log(number);
        
        if (number.name === body.name){
            notUnique = true

        }
    })

    if (notUnique){
        return res.status(400).json({
            error: "name must be unique"
        })
    }


    //generoi numerolle ID:n
    const numberId = Math.floor(Math.random()*1000)

    const number = {
        id: numberId,
        name: body.name,
        number: body.number
    }

    numbers = numbers.concat(number) 
    console.log(numbers);

    res.json(number)
})

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>")
})

//hae kaikki yhteystiedot
app.get("/api/numbers", (req, res) => {
    console.log(numbers);

    res.json(numbers)
})

//hae tietty yhteystieto
app.get("/api/numbers/:id", (req, res) => {
    const id = Number(req.params.id)
    const number = numbers.find(number => number.id === id)

    if (number) {
        res.json(number)

    } else {
        res.status(404).end()
    }

})

//poista yhteystieto
app.delete("/api/numbers/:id", (req, res) => {
    const id = Number(req.params.id)
    numbers = numbers.filter(number => number.id != id)
    res.status(204).end()
})


//info
app.get("/info", (req, res) => {
    let response = `<p>Phonebook has info for ${numbers.length} people</p>`
    response += new Date()
    res.send(response)

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
