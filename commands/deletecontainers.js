module.exports = {
	name: 'deletecontainers',
	description: 'Deletes all containers from game and from areas.',
    args: false,
    usage: '',
    guildOnly: true,
    cooldown: 3,
	async execute(client, message, args, Items, Areas, Containers, Inventories, Abilities) {

        try {
            const container = await Containers.destroy({ where: { guild: message.guild.toString() } });
            if (!container) return message.reply('No containers found.');

            try {
                const temp = '';
                const affectedRows = await Areas.update({ containers: temp }, { where: { guild: message.guild.toString() } });
            } catch (e) {
                return message.reply(`Something went wrong with updating an area. Error: ${e}`);
            }

            return message.reply(`Deleted all containers.`);
        }
        catch (e) {
        	return message.reply(`Something went wrong deleting containers. Error: ${e}`);
        }
	},
};
