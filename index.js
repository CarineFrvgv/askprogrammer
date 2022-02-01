const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const connection = require('./database/database');
const Question = require('./database/questions');
const Answer = require('./database/answer');
const app = express();

connection.authenticate().then(() => {
    console.log('connection with the database ok');
}).catch(err => {
    console.log(err);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// route
app.get('/', (req, res) => {
    Question.findAll({
        order: [['id', 'DESC']
    ]}).then(questions =>{
        res.render('index', {
            questions: questions
        })
    });
});

app.get('/ask', (req, res) => {
    res.render('ask');
});

app.post('/asked', (req, res) => {
    title = req.body.title;
    description = req.body.description;

    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/question/:id', (req, res) => {
    let id = req.params.id;

    Question.findOne({where: {id:id}
    }).then(question => {
        if (question != undefined){
            Answer.findAll({
                where: {questionId : question.id},
                order: [['id', 'DESC']]
            }).then(answers => {
                res.render('question', {
                    question: question,
                    answers: answers
                })
            });
        }
        else {
            res.redirect('/');
        }
    });
});

app.post('/answer', (req, res) => {
    let body = req.body.body;
    let questionId = req.body.questionId;

    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect('/question/' + questionId);
    });
});

app.listen(5000, () => {
    console.log('server running on path 5000');
});
