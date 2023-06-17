const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

//export the slash command /register for registering approved users to do gibaways
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('register to host a gibaway')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('the user to be registered')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('ronin-address')
			.setDescription('enter your ronin address')
			.setRequired(true)
			.setMinLength(46)
			.setMaxLength(46))
		,
	//execute the /register
	async execute(interaction) {

		// defer reply to allow time to think
		await interaction.deferReply();

		//grab data from /register command
		const roninAddress = interaction.options.getString('ronin-address');
		const userObj = interaction.options.getUser('user');
		
		//only authorized for orca, will switch to role authorization before going live
		if (interaction.user.id == '303432711446724609'){

			//post new approved wallet to database
			axios.post("http://localhost:8080/api/wallet",{ "user":userObj.id,"address":roninAddress})
			.then((res)=>{
				interaction.editReply(`you have succesfully registered ${userObj}`)})
			.catch((err)=>{
				console.log(err);
				interaction.editReply('failed to register')})
		}
		else{
			interaction.editReply('only orca can register new event hosts')
		}
	},
};
