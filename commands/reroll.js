const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder  } = require('discord.js');
const axios = require("axios");

//export slash command /reroll for allowing winners to forfeit their prize out of kindness
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reroll')
		.setDescription('take the high road')
		.addStringOption(option =>
			option.setName('axie-id')
			.setDescription('the axie to forfeit')
			.setRequired(true))
		,

    //execute the /reroll
	async execute(interaction) {

        //defer reply to allow time to think
        await interaction.deferReply();

        //grab data from /reroll command
		const axieID = interaction.options.getString('axie-id');
		let auth = false;
        let recordID;

        //define function for deleting record
        const deleteWinner = async (recordID) => {
            axios.delete(`http://localhost:8080/api/winner/${recordID}`)
			.then((res)=>{
				interaction.editReply(`reroll granted!`)
            })
			.catch((err)=>{
				console.log(err);
				interaction.editReply('failed to reroll')})
        }

		//fetch winners
        axios.get(`http://localhost:8080/api/winners`)
        .then((res)=>{

            //search for a matching winner
            res.data.winners.forEach((winner)=>{
                if (winner.user == interaction.user.id && winner.axieID == axieID){
                    auth = true;
                    recordID = winner._id;

                    //delete record of winning, thus allowing a new /host
                    deleteWinner(recordID)
                }
            })
            if (!auth) {
                interaction.editReply('not your axie to reroll')
            }
            
        })
        .catch((err)=>{
            interaction.editReply('failed to find winners')
            console.log("failed GET at /api/winners")
        })
	},
}
