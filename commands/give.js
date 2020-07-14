module.exports = {
	name: 'give',
	description: 'Give an item to a user.',
    args: true,
    usage: '<user> <number> <item>',
    guildOnly: false,
    cooldown: 3,
	execute(message, args) {
        if (!message.mentions.users.size) {
	       return message.reply('You need to tag a user in order to give them something!');
        }
        const taggedUser = message.mentions.users.first();

        const amount = parseInt(args[1]);

        if (typeof args[2] === 'undefined') {
            return message.reply('You need to include an item to give.');
        }

        let item = '';
        if (amount <= 1) {
            item = args[2];
        } else {
            item = args[2] + 's';
        }

    	if (isNaN(amount)) {
    		return message.reply('That doesn\'t seem to be a valid number.');
    	}
        message.reply(`You want to give ${taggedUser} ${amount} ${item}`);
	},
};
