const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

//sequelize.import('models/Items');


const Items = sequelize.define('items', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
  bulky: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	description: Sequelize.TEXT,
  guild: Sequelize.STRING,
});

const Abilities = sequelize.define('abilities', {
	name: {
		type: Sequelize.STRING,
			unique: true,
		},
		description: Sequelize.TEXT,
		effect: Sequelize.TEXT,
    guild: Sequelize.STRING,
});

const Inventories = sequelize.define('inventories', {
    id: {
		type: Sequelize.STRING,
			primaryKey: true,
		},
		items: Sequelize.STRING,
		abilities: Sequelize.STRING,
    name: Sequelize.TEXT,
    guild: Sequelize.STRING,
});

const Areas = sequelize.define('areas', {
    name: {
		type: Sequelize.STRING,
		unique: true,
	},
    channel: Sequelize.STRING,
	containers: Sequelize.STRING,
    guild: Sequelize.STRING,
});

const Containers = sequelize.define('containers', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	items: Sequelize.STRING,
	time: Sequelize.INTEGER,
	random: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
    area: Sequelize.STRING,
    guild: Sequelize.STRING,
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
    Items.sync();
    Areas.sync();
    Containers.sync();
    Inventories.sync();
    Abilities.sync();
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

				if (command.usage) {
					reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
				}

				return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
    	cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    	if (now < expirationTime) {
    		const timeLeft = (expirationTime - now) / 1000;
    		return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    	}
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
    	command.execute(client, message, args, Items, Areas, Containers, Inventories, Abilities);
    } catch (error) {
    	console.error(error);
    	message.reply('There was an error trying to execute that command!');
    }
});

client.login(token);
