module.exports = {
	name: 'deleteitems',
	description: 'Deletes all items from game and from inventories and containers.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, database) {

        try {
            const item = await database[0].destroy({ where: { guild: message.guild.id.toString() } });
            if (!item) return message.reply('No items found.');

            try {
                const temp = '';
                const affectedRows = await database[3].update({ items: temp }, { where: { guild: message.guild.id.toString() } });
                try {
                    const affectedRows2 = await database[2].update({ items: temp }, { where: { guild: message.guild.id.toString() } });
                } catch (e) {
                    return message.reply(`Something went wrong with updating a container. Error: ${e}`);
                }
            } catch (e) {
                return message.reply(`Something went wrong with updating an inventory. Error: ${e}`);
            }

            return message.reply(`Deleted all items.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting items. Error: ${e}`);
        }
	},
};
