const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");
const { id } = require('ethers/lib/utils');

const gibWallet = "0x903095e8eff84b34f3e13f8ab9c9bc072fc58a76";
let donorWallet = "";

//export slash command /host for approved users to host gibaways
// with subcommand options "deathmatch" and "spin-the-wheel"
module.exports = {
	data: new SlashCommandBuilder()
		.setName('host')
		.setDescription('host a gibaway')
		.addSubcommand((subcommand) => 
			subcommand
				.setName('deathmatch')
				.setDescription('survive or rebayb')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('team-deathmatch')
				.setDescription('team battle for tokens')
				//this needs to be reworked for tokens. need .addStringOption -> option.setName('token') axs or slp?
				// and addNumberOption (not sure of correct syntax here) -> option.setName('amount')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('spin-the-wheel')
				.setDescription('spin a wheel to eliminate losers')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
				
		),
	
	//perform the /host
	async execute(interaction) {
		let replied = false;
		if(true){
			let replied = false;

			//defer response to allow time for processing
			await interaction.deferReply();

			//admin only
			console.log(interaction.member)
			if(interaction.member._roles.includes('1038522161532502056')){
				console.log('1')
				//init variables associated with gib
				let gibType = "";
				let description = "";
				let footer = {text: ""};
				if (interaction.options.getSubcommand() == 'deathmatch'){
					gibType = "Deathmatch"
					description = 'React with 🍑 to join'
					footer.text = 'React with 🍑 to join'
				}
				if (interaction.options.getSubcommand() == 'team-deathmatch'){
					gibType = "Team Deathmatch"
					description = 'Join a team by reacting below'
					footer.text = 'Pick a team by reacting!'
				}
				else if (interaction.options.getSubcommand() == 'spin-the-wheel'){
					gibType = "Spin the Wheel"
					description = 'Dont get picked!'
					footer.text = 'React with 🍑 to join'
				}
				
				//build embed message for hosting
				const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${interaction.options.getString("axie-id")}/axie/axie-full-transparent.png`);
				//need a new hostEmbed to support token gibs. replace field "name: 'Axie ID'" with "name: 'token'"
				const hostEmbed = new EmbedBuilder()
					.setTitle(`🚨 GIBAWAY ALERT 🚨`)
					.setDescription(`${description}`)
					.setColor(0xe5de00)
					.setFields(
						{ name: 'Gib Type', value: `${gibType}`, inline: true},
						{ name: 'Axie ID', value: `${interaction.options.getString("axie-id")}`, inline: true},
						{ name: 'Countdown', value: `${interaction.options.getString('countdown')}`, inline: true},
					)
					.setImage('attachment://axie-full-transparent.png')
					.setFooter(footer)

				//send message to alert community about the gibaway
				if (!replied) {
					interaction.editReply({ embeds: [hostEmbed], files: [axieImg]});
				}
				
			}
			else{
				console.log('2')
				await interaction.reply("You must be an administrator to perform this action.");
			}		
		}
	}
};
