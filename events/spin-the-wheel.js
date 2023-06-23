const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const timeout = 15000

//fisher-yates shuffle
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//define function for editing mongodb leaderboard
const editLeaders = async (leaderUser) => {
	//check if user exists
	axios.get(`http://localhost:8080/api/leader/userID/${leaderUser.id}`)
		.then((res)=>{
			console.log(res.data.result)
			if (res.data.result == null){
				//add new record
				axios.post("http://localhost:8080/api/leader",{ "userID":leaderUser.id,"username":leaderUser.username,"wins":1})
					.then((res2)=>{
						console.log('leader record added to database')})
					.catch((err2)=>{
						//console.log(err2);
						console.log('leader record not added to database')})
			}
			else{
				//edit record
				axios.put(`http://localhost:8080/api/leaders/${res.data.result._id}`,{ "wins":String(parseInt(res.data.result.wins) + 1)})
					.then((res3)=>{
						console.log('leader record edited')})
					.catch((err3)=>{
						//console.log(err3);
						console.log('leader record not edited')})
			}
		})
}


module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, message, client) {
		
		//detect gibaway alert in message stream
		if (message.author.id == 1119451259481624726 && message.embeds.length != 0 && 'title' in message.embeds[0].data && message.embeds[0].data.title.includes('GIBAWAY ALERT')){

			//capture data from gib message
			let gibType;
			let countDown;
			let axieID;
			message.embeds[0].data.fields.forEach((field) => {
				if (field.name == 'Gib Type') {gibType = field.value}
				else if (field.name == 'Countdown') {countDown = field.value}
				else if (field.name == 'Axie ID') {axieID = field.value}
			})
			let countDownMS = 0;
			if (countDown == '1 minute') { countDownMS = 60000}
			else if (countDown == '2 minutes') { countDownMS = 120000}
			else if (countDown == '3 minutes') { countDownMS = 180000}
			else if (countDown == '5 minutes') { countDownMS = 300000}
			else if (countDown == '10 minutes') { countDownMS = 600000}
			else if (countDown == '10 seconds') { countDownMS = 5000}


			//define actions and rules for spin the wheel
			if (gibType == 'Spin the Wheel'){

				//bot react to own message
				message.react('🍑');

				//define filter for adding players to game
				let remainingUsers = [];
				const filter = (reaction, user) => {
					//all peaches except for bot
					return reaction.emoji.name === '🍑' && !user.bot;
				};
				
				//start reaction collector for gib message
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				//add users to game from message collector
				collector.on('collect', (reaction, user) => {
					//player cap 200 users
					if (!remainingUsers.includes(user) && remainingUsers.length<200){
						remainingUsers.push(user)
						console.log(`Collected ${reaction.emoji} from ${user.tag}`);
					}
					
				});

				//when collector ends, start game
				collector.on('end', (collected, reason) => {
					
					//init game variables
					let round = 0;
					let finished = false;
					let mainEmbed;
					let spinCount = 0;
					let stopped = true;

					//choose emojis

					//can use these in main axie discord vvv
					//let pointer = message.guild.emojis.cache.find((emoji)=>emoji.name=='axiesweat')
					//let notPointer = message.guild.emojis.cache.find((emoji)=>emoji.name=='AxieInfinityShard')
					
					//use these in gibing circle server
					let pointer = message.guild.emojis.cache.find((emoji)=>emoji.name=='qiqicoffin')
					let notPointer = message.guild.emojis.cache.find((emoji)=>emoji.name=='Red_Flame')

					//define function for sending loser message
					const sendLoser = async (losers) => {
						loserMessage = '';
						losers.forEach((loser) => {
							loserMessage += `${loser.username} is out!!\n\n`
						})
						const loseEmbed = new EmbedBuilder()
							.setDescription(`${loserMessage}`)
							.setColor(0xe5de00)
						message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [loseEmbed] })
					}

					//define function for sending winner message
					const sendWinner = async (winner) => {

						//edit mongodb leaderboard
						editLeaders(winner);

						//add winner record to db
						axios.post("http://localhost:8080/api/winner",{ "user":winner.id,"axieID":axieID})
							.then((res)=>{
								console.log('winner record added to database')})
							.catch((err)=>{
								console.log(err);
								console.log('winner record not added to database')})
						
						//make winner embed message
						const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
						const winEmbed = new EmbedBuilder()
							.setDescription(`${winner.username} won Axie ${axieID}\n\nuse the /claim command for prize delivery!`)
							.setThumbnail('attachment://axie-full-transparent.png')
							.setColor(0xe5de00)
						
						//send message
						message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${winner}`, embeds: [winEmbed], files: [axieImg] });
					}

					//define fucntion for playing the game (recursive)
					const nextRound = async () => {

						//randomize order of players
						shuffle(remainingUsers)

						//define function for editing embed to simulate wheel spinning (recursive)
						//can be thought of as spinning the wheel by one tick
						const editEmbed = async () => {
							
							spinCount++;

							//move first user to last position
							remainingUsers.push(remainingUsers.shift());

							//init variable for wheel spin
							let wheelString = "";
							let tempCount = 0;
							let maxIndex = 0;

							//define bounds of wheel to show 15 names
							if (remainingUsers.length > 15){
								maxIndex = 15
							}
							else{
								maxIndex = remainingUsers.length
							}

							//string used for top of embed
							wheelString += `${notPointer}\n`

							//build emoji strings for embed message
							remainingUsers.forEach((user) => {
								tempCount++;
								//only show top 15
								if (tempCount <= 15){

									//if more than 50 people, need 7 pointers
									if (remainingUsers.length > 50){
										
										//even number of users
										if (maxIndex%2 == 0){
											if (tempCount == maxIndex/2 - 6 || tempCount == maxIndex/2 - 4 || tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2 || tempCount == maxIndex/2 + 4 || tempCount == maxIndex/2 + 6){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
										
										//odd number of users
										else{
											if (tempCount == maxIndex/2 - 5.5 || tempCount == maxIndex/2 - 3.5 || tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5 || tempCount == maxIndex/2 + 4.5 || tempCount == maxIndex/2 + 6.5){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
									}

									//if more than 25 people, need 5 pointers
									else if (remainingUsers.length > 25){
										
										//even number of users
										if (maxIndex%2 == 0){
											if (tempCount == maxIndex/2 - 4 || tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2 || tempCount == maxIndex/2 + 4){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
										
										//odd number of users
										else{
											if (tempCount == maxIndex/2 - 3.5 || tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5 || tempCount == maxIndex/2 + 4.5){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
									}

									//if more than 12 people, need 3 pointers
									else if (remainingUsers.length > 12){
										
										//even number of users
										if (maxIndex%2 == 0){
											if (tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
										
										//odd number of users
										else{
											if (tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
									}
									
									//if less than 12 people, need one pointer
									else{
										
										//even number of users
										if (maxIndex%2 == 0){
											if (tempCount == maxIndex/2){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}

										//odd number of users
										else{
											if (tempCount == maxIndex/2 + 0.5){
												wheelString+=`${pointer}${user.username}\n`
											}
											else{
												wheelString+=`${notPointer}${user.username}\n`
											}
										}
									}
								}
								
								
							})

							//string used for bottom of embed
							wheelString += `${notPointer}\n`

							//build embed for editing main embed
							const spinEmbed = new EmbedBuilder()
								.setTitle(`Round ${round}`)
								.setColor(0xe5de00)
								.setFields(
									{ name: 'Dont get picked!', value: `${wheelString}`}
								)
							
							//edit main embed to show spin
							mainEmbed.edit({ embeds: [spinEmbed] });
							
							//random seed to slow down spinning for next round
							rndOffset = Math.floor(Math.random() * (2 - 0 + 1) + 0);
							
							//time delay for next spin
							let editCountdown;

							//first 3 spins spin once per second
							if (spinCount < 3 + rndOffset) {
								editCountdown = 1000
							}
							//4th spin 1.1 seconds
							else if (spinCount < 4 + rndOffset) {
								editCountdown = 1100
							}
							//5th spin 1.2 seconds
							else if (spinCount < 5 + rndOffset) {
								editCountdown = 1200
							}
							//6th spin 1.5 seconds
							else if (spinCount < 6 + rndOffset) {
								editCountdown = 1500
							}
							//7th & 8th spins 2 seconds
							else if (spinCount < 8 + rndOffset) {
								editCountdown = 2000
							}

							// >8th spin gives 50% chance for wheel to keep going
							
							//keep going
							else if (Math.random() < .5) {
								editCountdown = 3000
							}

							//wheel stops -- eliminate players
							else {

								//reset variables
								stopped = true
								spinCount = 0

								//calculate center of wheel
								let index;
								maxIndex%2 == 0 ?
									//even
									index = maxIndex/2 - 1
									:
									//odd
									index = maxIndex/2 + 0.5 - 1

								//if more than 50 users, elim 7
								if (remainingUsers.length > 50){
									let loserList = []
									loserList.push(remainingUsers[index-6]);
									loserList.push(remainingUsers[index-4]);
									loserList.push(remainingUsers[index-2]);
									loserList.push(remainingUsers[index]);
									loserList.push(remainingUsers[index+2]);
									loserList.push(remainingUsers[index+4]);
									loserList.push(remainingUsers[index+6]);
									setTimeout(()=>{sendLoser(loserList)},1500);
									remainingUsers.splice(index+6, 1);
									remainingUsers.splice(index+4, 1);
									remainingUsers.splice(index+2, 1);
									remainingUsers.splice(index, 1);
									remainingUsers.splice(index-2, 1);
									remainingUsers.splice(index-4, 1);
									remainingUsers.splice(index-6, 1);
								}
								//if more than 25 users, elim 5
								else if (remainingUsers.length > 25){
									let loserList = []
									loserList.push(remainingUsers[index-4]);
									loserList.push(remainingUsers[index-2]);
									loserList.push(remainingUsers[index]);
									loserList.push(remainingUsers[index+2]);
									loserList.push(remainingUsers[index+4]);
									setTimeout(()=>{sendLoser(loserList)},1500);
									remainingUsers.splice(index+4, 1);
									remainingUsers.splice(index+2, 1);
									remainingUsers.splice(index, 1);
									remainingUsers.splice(index-2, 1);
									remainingUsers.splice(index-4, 1);
								}
								//if more than 12 users, elim 3
								else if (remainingUsers.length > 12){
									let loserList = []
									loserList.push(remainingUsers[index-2]);
									loserList.push(remainingUsers[index]);
									loserList.push(remainingUsers[index+2]);
									setTimeout(()=>{sendLoser(loserList)},1500);
									remainingUsers.splice(index+2, 1);
									remainingUsers.splice(index, 1);
									remainingUsers.splice(index-2, 1);
								}
								//less than 12 users, elim 1
								else{
									let loserList = []
									loserList.push(remainingUsers[index]);
									setTimeout(()=>{sendLoser(loserList)},1500);
									remainingUsers.splice(index, 1);
								}
							}

							//if winner found
							if (remainingUsers.length == 1){
								setTimeout(()=>{sendWinner(remainingUsers[0])},6000)
							}

							//if wheel stopped, go to next round
							else if (stopped){
								setTimeout(nextRound, 5000);
							}

							//if wheel not stopped, keep spinning
							else{
								setTimeout(editEmbed, editCountdown);
							}
						}
						
						//start a new round

						//init variables
						round+=1
						let wheelString = "";
						let tempCount = 0;

						//string for top of embed
						wheelString += `${notPointer}\n`

						//define bounds of wheel to show 15 users or fewer
						let maxIndex = 0;
						if (remainingUsers.length > 15){
							maxIndex = 15
						}
						else{
							maxIndex = remainingUsers.length
						}

						//draw emojis to represent starting wheel
						remainingUsers.forEach((user) => {
							tempCount++;

							//display only first 15 of randomized list
							if (tempCount <= 15){
								
								//if more than 50 people, need 7 pointers
								if (remainingUsers.length > 50){
										
									//even number of users
									if (maxIndex%2 == 0){
										if (tempCount == maxIndex/2 - 6 || tempCount == maxIndex/2 - 4 || tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2 || tempCount == maxIndex/2 + 4 || tempCount == maxIndex/2 + 6){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
									
									//odd number of users
									else{
										if (tempCount == maxIndex/2 - 5.5 || tempCount == maxIndex/2 - 3.5 || tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5 || tempCount == maxIndex/2 + 4.5 || tempCount == maxIndex/2 + 6.5){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
								}

								//if more than 25 people, need 5 pointers
								else if (remainingUsers.length > 25){
									
									//even number of users
									if (maxIndex%2 == 0){
										if (tempCount == maxIndex/2 - 4 || tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2 || tempCount == maxIndex/2 + 4){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
									
									//odd number of users
									else{
										if (tempCount == maxIndex/2 - 3.5 || tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5 || tempCount == maxIndex/2 + 4.5){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
								}

								//if more than 12 people, need 3 pointers
								else if (remainingUsers.length > 12){
									
									//even number of users
									if (maxIndex%2 == 0){
										if (tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
									
									//odd number of users
									else{
										if (tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
								}
								
								//if less than 12 people, need one pointer
								else{
									
									//even number of users
									if (maxIndex%2 == 0){
										if (tempCount == maxIndex/2){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}

									//odd number of users
									else{
										if (tempCount == maxIndex/2 + 0.5){
											wheelString+=`${pointer}${user.username}\n`
										}
										else{
											wheelString+=`${notPointer}${user.username}\n`
										}
									}
								}
							}
						})

						//string for bottom of embed
						wheelString += `${notPointer}\n`


						//build initial wheel embed
						const wheelEmbed = new EmbedBuilder()
							.setTitle(`Round ${round}`)
							.setColor(0xe5de00)
							.setFields(
								{ name: 'Dont get picked!', value: `${wheelString}`}
							)
						
						//send message and make reference to message for editing later
						message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [wheelEmbed] }).then((msg)=>{
							mainEmbed = msg
							stopped = false;

							//call recursive edit function for spinning wheel
							setTimeout(editEmbed, 1000);
						})
					}
					
					//call recursive game function for starting game
					setTimeout(nextRound, 1000);
					
				});
			}
		}
	},
};


