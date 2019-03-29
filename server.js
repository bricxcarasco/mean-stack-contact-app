const express = require('express');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');

const app = express();
const db = mongojs('contactlist', ['contactlist']);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/contact_list/get', (req, res) => {

    db.contactlist.find( (error, information) => {
        res.json(information);
    });

});

app.post('/contact_list/insertupdate', (req, res) => {

    let process = req.body.process;

    if( process == "Insert" ) {

        let contactInsert = {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number
        };

        let output = {
            message: "Data has been inserted.",
            status: "Success"
        };

        db.contactlist.insert( contactInsert, (err, doc) => {
            res.json(output);
        });

    } else {
        
        let contactUpdate = {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number
        }

        let output = {
            message: "Data has been updated.",
            status: "Success"
        };

        db.contactlist.findAndModify(
            { 
                query: { 
                    _id: mongojs.ObjectID(req.body.id) 
                },
                update: { 
                    $set: { 
                        name: req.body.name, 
                        email: req.body.email, 
                        number: req.body.number 
                    }
                },
                new: true 
            },(err, doc) => {
                res.json(output);
        });
        
    }
    
});

app.delete('/contact_list/:id', (req, res) => {
    let id = req.params.id;
    let output = {
        message: "Data has been deleted",
        status: "Success"
    };
    db.contactlist.remove(
        {
            _id: mongojs.ObjectID(id) 
        }, (err, doc) => {
            res.json(output);
        }
    );
});

app.listen(3000);

console.log("Server is running on port 3000");