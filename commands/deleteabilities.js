module.exports = {
	name: 'deleteabilities',
	description: 'Deletes all abilities from game and from inventories.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const ability = await Abilities.destroy({ where: { guild: message.guild.toString() } });
            if (!ability) return message.reply('No abilities found.');

            try {
                const temp = '';
                const affectedRows = await Inventories.update({ abilities: temp }, { where: { guild: message.guild.toString() } });
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
