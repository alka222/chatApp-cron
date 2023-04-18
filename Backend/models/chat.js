const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chat = sequelize.define('chat' , {
    id:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING
    }
})

module.exports = Chat ;