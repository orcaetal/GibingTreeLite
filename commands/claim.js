const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");
const { ethers } = require("ethers");
require('dotenv').config();

//connect to RPC
const provider = new ethers.providers.JsonRpcProvider("https://api.roninchain.com/rpc");
const privateKey = process.env.PRIV_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

//gib wallet
const addressFrom = "0x903095e8eff84b34f3e13f8ab9c9bc072fc58a76";

const axieABI = [
    {
        "constant":false,
        "inputs":[
                    {
                        "internalType":"address",
                        "name":"_from",
                        "type":"address"
                    },
                    {
                        "internalType":"address",
                        "name":"_to",
                        "type":"address"
                    },
                    {
                        "internalType":"uint256",
                        "name":"_tokenId",
                        "type":"uint256"
                    }
                ],
        "name":"safeTransferFrom",
        "outputs":[],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"function"}
]

//export slash command /claim for winners to claim prizes
module.exports = {
	data: new SlashCommandBuilder()
		.setName('claim')
		.setDescription('claim your prize')
		.addStringOption(option =>
			option.setName('axie-id')
			.setDescription('the ID of the axie you won (without # symbol)')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('ronin-address')
			.setDescription('enter your ronin address')
			.setRequired(true)
			.setMinLength(46)
			.setMaxLength(46))
		,
    //execute the /claim
	async execute(interaction) {

        //defer reply to allow time to think
        await interaction.deferReply();

        //grab data from /claim command
		const roninAddress = interaction.options.getString('ronin-address').replace('ronin:','0x');
        const axieID = interaction.options.getString('axie-id');
        
        //check if prize is claimable by user
        axios.get(`http://localhost:8080/api/winner/axieID/${axieID}`)
            .then((res) => {
                
                if (res.data.winner == null){
                    //not a winner
                    interaction.editReply(`you did not win axie ${axieID}`);
                }
                
                else {
                    //winner!
                    if (res.data.winner.user == interaction.user.id){
                        //init ethers contract
                        let axieContract = new ethers.Contract('0x32950db2a7164ae833121501c797d79e7b79d74c',axieABI,wallet)
                        //send axie
                        let receipt = axieContract.safeTransferFrom(addressFrom, roninAddress, axieID);
                        interaction.editReply('your prize is on its way!');

                        //delete record of win
                        axios.delete(`http://localhost:8080/api/winner/${res.data.winner._id}`)
                            .then((res)=>{
                                console.log('succesfully deleted winner record')})
                            .catch((err)=>{
                                console.log(err);
                                console.log('failed to delete winner record')})
                    }
                    else {
                        interaction.editReply(`you did not win axie ${axieID}`);
                    }
                }
            })
            .catch((err) => {
                console.log('failed to GET from /api/winner/axieID/')
                console.log(err)
            })
		
		
	},
};
