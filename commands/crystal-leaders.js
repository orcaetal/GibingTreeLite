const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gc-leaderboard')
		.setDescription('view gc leaders')
		,
	async execute(interaction) {
		
		
		axios.get("http://localhost:8080/api/crystals")
			.then((res)=>{
                
                const leaders = res.data.crystals;
                leaders.sort((a,b) => parseInt(b.balance) - parseInt(a.balance)); 

                let leaderString = "";
                let count = 0;
                leaders.forEach((leader)=>{
                    count++
                    if (count < 10){
                        let name = interaction.client.users.fetch(leader.user)
                        name.then((res2)=>{
                            leaderString+=`${leader.balance} ${name.username}\n\n`
                        })
                        
                    }
                })
                const leaderEmbed = new EmbedBuilder()
                    .setTitle('GC Leaders!')
                    .setDescription(`${leaderString}`)
                    .setColor(0xe5de00)
                interaction.reply({ embeds: [leaderEmbed]})
                
				})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to show leaderbard')})
		
	},
};