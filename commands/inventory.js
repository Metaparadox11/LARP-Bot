const Discord = require('discord.js');
module.exports = {
	name: 'inventory',
	description: 'Lists your character\'s inventory.',
    args: false,
    usage: '',
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

        try {
            const inventory = await database[3].findOne({ where: { id: taggedUser.id.toString(), guild: message.guild.id.toString() } });
            if (!inventory) {
            	return message.reply('You must have a valid inventory.');
            } else {
                let nameTemp = inventory.get('name');
                let itemsTemp = inventory.get('items');
                if (typeof itemsTemp === 'undefined') itemsTemp = 'none';
                let abilitiesTemp = inventory.get('abilities');
                if (typeof abilitiesTemp === 'undefined') abilitiesTemp = 'none';
								let memsTemp = inventory.get('mems');
                if (typeof memsTemp === 'undefined') memsTemp = 'none';

                const message1 = await message.channel.send(`Character Name: ${nameTemp}\nItems: ${itemsTemp}\nAbilities: ${abilitiesTemp}\nMemory Packets: ${memsTemp}`);

                const message2 = await message.channel.send("Delete message? React ✅ to delete.");
                message2.react('✅');

                const filter = (reaction, user) => {
                	return reaction.emoji.name === '✅' && user.id === message.author.id;
                };

                const collector = message2.createReactionCollector(filter, { time: 100000 });

                collector.on('collect', async (reaction, reactionCollector) => {
                	await message1.delete();
                  await message2.delete();
                  await message.delete();
                });
            }
        }
        catch (e) {
        	return message.reply(`Something went wrong looking up your inventory. Error: ${e}`);
        }
	},
};
