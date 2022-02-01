const sequelize = require('sequelize');
const connection = require('./database');

const Answer = connection.define('answer', {
    body: {
        type: sequelize.STRING,
        allowNull: false
    },
    questionId: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

Answer.sync({force: false}).then(() => {
    console.log('aswer database created')
});

module.exports = Answer;