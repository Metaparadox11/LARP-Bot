module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
        	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
        	const newCommand = require(`./${command.name}.js`);
        	message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
        	console.log(error);
        	message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }

        message.channel.send(`Command \`${command.name}\` was reloaded!`);
	},
};
