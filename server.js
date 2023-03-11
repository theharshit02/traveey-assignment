const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const Pool = require('pg').Pool


const port = 3000

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee',
  password: 'harshit',
  port: 5432,
})

app.use(bodyParser.urlencoded({extended: true}))


app.get("/api/health", function(req, res){
    res.send(`Serer active at time: ${new Date()}`)
})


//CREATING TABLES
app.get("/create", function(req, res){
    pool.query('CREATE TABLE empData(id int PRIMARY KEY, name varchar(20), email varchar(50), phone int, hireDate date, position varchar(20))',(error, result)=>{
        if(error){
            console.log(error);
        }
        res.send(result);
    })
})

app.get("/createTasks", function(req, res){
    pool.query('CREATE TABLE empTasks(id int PRIMARY KEY, title UNIQUE varchar(20), description varchar(50), dueDate date, empId int, FOREIGN KEY (empId) REFERENCES empData(id))',(error, result)=>{
        if(error){
            console.log(error);
        }
        res.send(result);
    })
})


//INSERTING DATA INTO TABLES "empData" and "empTasks"
app.post("/insertEmp", function(req, res){
    pool.query("INSERT INTO empData (id, name, email, phone, hireDate, position) VALUES (1, 'ABC', 'abc@gmail.com', 12345, '2023-03-12', 'manager')", function(err, result){
        if (err) {
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})

app.post("/insertTask", function(req, res){
    pool.query("INSERT INTO empTasks(id, title, description, dueDate, empId) values (1, 'Frontend', 'make website', '2023-03-17', (SELECT id FROM empData WHERE name = 'ABC'))", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})


//DISPLAYING ALL DATA FROM TABLES
app.get("/getEmp", function(req, res){
    pool.query("SELECT * FROM empData", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})

app.get("/getTask", function(req, res){
    pool.query("SELECT * FROM empTasks", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})


//UPDATE DATA IN TABLES
app.post("/updateEmp", function(req, res){
    pool.query("UPDATE empData SET phone = 67890 where id = 1", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})

app.post("/updateTask", function(req, res){
    pool.query("UPDATE empTasks SET title = 'backend' where empId = 1", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})


//DELETE DATA FROM TABLES
app.delete("/deleteEmp", function(req, res){
    pool.query("DELETE FROM empData where id = 1", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})

app.delete("/deleteTask", function(req, res){
    pool.query("DELETE FROM empTasks where id = 1", function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })
})



app.listen(port, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log(`Listening on ${port}`);
    }
})