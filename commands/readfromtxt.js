module.exports = {
	name: 'readfromtxt',
	description: 'Execute commands from an attached text file.',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
				if (!message.member.roles.cache.some(role => role.name === 'GM') && !message.member.roles.cache.some(role => role.name === 'Head GM')) {
					return message.reply(`You don't have GM permissions.`);
				}

				function scrubNewlines(body) {
					let scrubbedBody = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
					return scrubbedBody;
				}

        try {
          const fs = require('fs');

          if (message.attachments) {
            let file_path = message.attachments.first().attachment;

            var request = require('request');
            request.get(file_path, async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var txt = scrubNewlines(body);
                    message.reply(`Executing commands.`);
                    const commands = txt.split(/\n+/);
                    for (let i = 0; i < commands.length; i++) {
                      commands[i] = commands[i].slice(1, commands[i].length);
                      message.channel.send(commands[i]);

                      const args = commands[i].split(/ +/);
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

                      try {
                      	await command.execute(client, message, args, database);
                      } catch (error) {
                      	console.error(error);
                      	message.reply('There was an error trying to execute a command!');
                      }
                      //message.channel.send(commands[i]);
                    }
                    return;
                } else {
                  return message.reply('File not found.');
                }
            });

          } else {
            return message.reply('You need to attach a text file to your message.');
          }

          //const data = fs.readFileSync(pathArg, {encoding: 'utf8', flag:'r'});
          //fs.readFile(pathArg, 'utf8', function(err, contents) {
          //return message.reply(`Executing commands.` + ' ' + data);
          //});
        }
        catch (e) {
          return message.reply(`Error reading text file.`);
        }
	},
};
