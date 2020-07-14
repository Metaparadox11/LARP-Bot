/*const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('items', {
    	name: {
    		type: Sequelize.STRING,
    		unique: true,
    	},
        bulky: {
    		type: Sequelize.BOOLEAN,
    		defaultValue: false,
    		allowNull: false,
    	},
    	description: Sequelize.TEXT,
    });
};*/
