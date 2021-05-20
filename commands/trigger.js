module.exports = {
	name: 'trigger',
	description: 'Triggers a memory packet\'s content in DMs.',
  args: true,
  usage: '<mem name>',
  guildOnly: true,
  cooldown: 3,
	async execute(client, message, args, database) {
        let roleId = '';
        try {
            const roles = await database[5].findAll({ where: { guild: message.guild.id.toString() } });
            if (!roles) {
              return message.reply('No roles found.');
            } else {
              let tempId = '';
              for (let i = 0; i < roles.length; i++) {
                tempId = roles[i].get('id');
                let author = message.member;
                if (author.roles.cache.has(tempId)) {
                  roleId = tempId;
                  i = roles.length;
                }
              }
              if (roleId === '') return message.reply(`You don't have a character role.`);
            }
        }
        catch (e) {
          return message.reply(`Something went wrong looking up roles. Error: ${e}`);
        }

        const taggedUser = await message.guild.roles.fetch(roleId);

        let memTemp = '';
        for (var i = 0; i < args.length; i++) {
            if (i !== 0) {
                memTemp += ' ';
            }
            memTemp += args[i];
        }

				const Sequelize = require('sequelize');
				const Op = Sequelize.Op;
        try {
            const mem = await database[6].findOne({ where: { name: {[Op.like]: memTemp}, guild: message.guild.id.toString() } });
            if (!mem) {
            	return message.reply('You must include a valid memory packet.');
            } else {
              //Check you have that memory packet
							memTemp = mem.get('name');
              try {
        				  const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
        					if (!inventory) {
        						return message.reply('You must have an inventory.');
        					} else {
        							let tempMems = inventory.get('mems');

        							if (typeof tempMems === 'undefined') tempMems = '';

        							let memsToSearch = tempMems.split(/,/);

        							let temp = '';
        							let pos = -1;
        							for (let i = 0; i < memsToSearch.length; i++) {
        									if (memsToSearch[i] === memTemp) {
        										pos = i;
        										i = memsToSearch.length;
        									}
        							}
        							if (pos === -1) {
        								return message.reply(`You don't have memory packet ${memTemp}.`);
        							}

                      let contentsTemp = mem.get('contents');
                      if (typeof contentsTemp === 'undefined') contentsTemp = 'none';
                      return message.author.send(`You triggered memory packet: ${memTemp}\nContents: ${contentsTemp}`);

        					}

        				return message.reply(`Something went wrong with checking an inventory.`);
        			}
        			catch (e) {
        				return message.reply(`You don't have that mem packet.`);
        			}

            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up that memory packet. Error: ${e}`);
        }
	},
};
