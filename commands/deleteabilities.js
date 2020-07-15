module.exports = {
	name: 'deleteabilities',
	description: 'Deletes all abilities from game and from inventories.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {

        try {
            const ability = await database[4].destroy({ where: { guild: message.guild.id.toString() } });
            if (!ability) return message.reply('No abilities found.');

            try {
                const temp = '';
                const affectedRows = await database[3].update({ abilities: temp }, { where: { guild: message.guild.id.toString() } });
            } catch (e) {
                return message.reply(`Something went wrong with updating an inventory. Error: ${e}`);
            }

            return message.reply(`Deleted all items.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting abilities. Error: ${e}`);
        }
	},
};
