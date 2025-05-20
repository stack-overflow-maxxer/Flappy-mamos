const express = require('express')
const app = express()


const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, 'users.json');

const cors = require('cors');
app.use(cors());



function loadUsers() { 
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data)
}

function saveUsers(users) { 
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2) )
}


app.use(express.json())

app.get('/users', (req, res) =>{
    res.json(users)
})

app.post('/users/register', (req, res) =>{ 
    const users = loadUsers();

    console.log('Form submitted');

    if (users.find(u => u.name === req.body.name)) {
        return res.status(400).send('1');
    }

    const user = {name: req.body.name, password: req.body.password,
        lenght: req.body.lenght_p, angle: req.body.angle
    }
    users.push(user)
    saveUsers(users)
    res.status(201).send("User registred")
})




app.post('/users/login', (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.name === req.body.name);
    console.log('log in');
    if (!user) {
        return res.status(400).send("1");
    }

    if (req.body.password === user.password) {
        res.send("Login successful");
    } else {
        return res.status(400).send("1");
    }
});


app.get('/users/json', (req, res) => {
  const users = loadUsers();
  res.json(users); 
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server beží na porte ${PORT}`);
});