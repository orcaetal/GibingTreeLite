const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

//export slash command /unregister for removing approved gibaway hosts
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unregister')
		.setDescription('unregister a ronin address')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('the user to be unregistered')
			.setRequired(true))
		,
	async execute(interaction) {

		//defer response to allow time to think
		await interaction.deferReply();

		//grab data from interaction
		const userObj = interaction.options.getUser('user');
		
		//only authorized for orca for now
		if (interaction.user.id == '303432711446724609'){
			axios.delete(`http://localhost:8080/api/wallet/userID/${userObj.id}`)
			.then((res)=>{
				interaction.editReply(`you have succesfully unregistered ${userObj}`)})
			.catch((err)=>{
				console.log(err);
				interaction.editReply('failed to unregister')})
		}
		else{
			interaction.editReply('only orca can unregister hosts')
		}
	},
};
