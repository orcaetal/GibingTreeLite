const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");


//define function for editing mongodb leaderboard
const editLeaders = async (leaderUser) => {
	//check if user exists
	axios.get(`http://localhost:8080/api/leader/userID/${leaderUser.id}`)
		.then((res)=>{
			if (res.data.result == null){
				//add new record
				axios.post("http://localhost:8080/api/leader",{ "userID":leaderUser.id,"username":leaderUser.username,"wins":1})
					.then((res2)=>{
						console.log('leader record added to database')})
					.catch((err2)=>{
						console.log('leader record not added to database')})
			}
			else{
				//edit existing record
				axios.put(`http://localhost:8080/api/leaders/${res.data.result._id}`,{ "wins":String(parseInt(res.data.result.wins) + 1)})
					.then((res3)=>{
						console.log('leader record edited')})
					.catch((err3)=>{
						console.log('leader record not edited')})
			}
		})
}

//init game variables
let timeout = 15000;
let alive = [];
let aliveTeam1 = [];
let aliveTeam2 = [];
let aliveTeam3 = [];
let dead = [];
let deadTeam1 = [];
let deadTeam2 = [];
let deadTeam3 = [];
let topKills = [];
const deathMessages = [
	"killee encountered a random crit",
	"killer put killee on a stake",
	"killee died by jinx",
	"an eagle swooped down and snatched killee",
	"killee was killed by red hawk's hate",
	"killee died from excessive sadness",
	"killee's hair caught on fire and they suffocated",
	"killee died of dysentery",
	"killee forgot to eat",
	"killer cannibalized killee",
	"killee pressed the red button",
	"killer hired a hitman to kill killee",
	"killee had too much woohoo",
	"killer served killee a poorly prepared pufferfish",
	"killer got killee to 30 stacks",
	"killee owed too much money to killer",
	"killee wrote their own name in the death note",
	"killee took a 5 game LS to killer",
	"killee drowned in chicken soup",
	"killer took killee's life vest",
	"killee got eggycoptered in the face",
	"a single raindrop melted killee",
	"killer yeeted killee",
	"killer pushed killee into some dog poo... and they suffocated",
	"air left the room and suffocated killee",
	"killee died from a fart",
	"axie is so fluffy that killee died",
	"killee kissed a wet washing machine",
	"killee no-clipped off the earth",
	"killee attempted a revive but was assassinated by killer",
	"killee offered themselves to ET",
	"killee kept a rattlesnake as a pet",
	"killee sell kidneys to buy EA",
	"tobi threw a rock at killee",
	"killer threw a rock at killee",
	"killee meowed so hard they bonked their head",
	"killee tagged core",
	"killee stepped on by goth girl killer",
	"killee met bab",
	"killee choked on milktea boba",
	"killer DDoS'ed killee's pacemaker",
	"Hestia melted killee's eyes with RGB",
	"killee dead by guillotine",
	"killee died from heart attack after winning jackpot",
	"killee missed too many gibs",
	"killee dumpster dived in raccoon's trash bin",
	"killee got trapped in the tanning bed",
	"killee threatened a Spartain King",
	"killee didnt turn off their cell phone in the movie theater",
	"killee died by eggbomb",
	"killee was abducted and dissected by aliens",
	"thanos erased killee",
	"killee died from a proper diet",
	"Rand double-sliced killee with a pair of katanas",
	"Rand's spinning blades clipped killee's jugular",
	"killee was tossed overboard by killer",
	"killee was betrayed by killer",
	"killee took a bullet for killer",
	"killer drank killee's blood",
	"killer roundhouse kicked killee",
	"killer exhibited martial arts to killee",
	"killer fed killee to a pride of lions",
	"killer fed killee to a pod of orcas",
	"killer fed killee to a murder of crows",
	"killer gave killee a sky funeral",
	"killer yeeted killee from the top of a canyon",
	"killer yeeted killee through the center of the earth",
	"killer yeeted killee in mid-air",
	"killer yelled really loud at killee",
	"killer insulted killee, causing dehydration from crying",
	"killer hit the ejector seat on killee",
	"killee was squeezed to death by killer",
	"killee was poked by killer",
	"killee got doxxed by killer",
	"killee was trampled by killer",
	"killee was captured in killer's pokeball",
	"killee was body slammed by killer",
	"killee was flamethrowered by killer's charizard",
	"killer glanced at killee",
	"killer gave killee a big ol' smooch on the lips",
	"killer lured killee onto grass",
	"killee starved to death after killer destroyed their stew",
	"killer rick rolled killee",
	"killer disintegrated killee with topaz",
	"killee died from embarrassment after tooting",
	"killee got hit by an asteroid",
	"killer dropped a penny on killee",
	"a scary ghost said boo to killee",
	"killee smelled Buba's gym socks",
	"killer went super saiyan on killee",
	"killee did their own electrical work",
	"killer super glued killee's eyes shut while driving",
	"killee dressed up like a moose during hunting season",
	"killee tried to beat the lunacian express",
	"killer fed killee expired milk",
	"killee taught themself how to fly",
	"killee ate too much Jollibee",
	"killee went ice skating in the summer",
	"killee ate gas station sushi"
]

const neutralMessages = [
	"thisUser ate some jelly beans",
	"thisUser found a cute dog and fed him some carrots",
	"thisUser saw a rainbow",
	"thisUser finally had a good cry",
	"thisUser got some bad news from the doctor",
	"thisUser found a new romantic interest",
	"thisUser planned out their next move",
	"thisUser is taking a bath",
	"thisUser picked up a banana",
	"thisUser decided to play v2",
	"thisUser went outside",
	"thisUser fell asleep and missed the round",
	"thisUser farted to the tune of their national anthem",
	"thisUser scratched their nails across the chalkboard",
	"thisUser got hypnotized by tailslap's eyebrows",
	"thisUser had a chicken sandwich",
	"thisUser explored the sewers",
	"thisUser visited their local magician",
	"thisUser made a fort out of blankets",
	"thisUser SCREAMED",
	"thisUser listened to some Tay Swift",
	"thisUser tried to fit in the refrigerator",
	"thisUser took a nap in McDonalds",
	"thisUser dug a tunnel in their basement",
	"thisUser had noisy neighbors",
	"thisUser worked out their frowny muscles",
	"thisUser lost 10 games of UNO against themselves"
]

const lifeMessages = [
	"reviver lent revivee some holy water",
	"revivee seems to have reanimated",
	"its not your time yet, get back in the game revivee",
	"revivee landed a healing crit at the last second",
	"revivee saw eggycopter in heaven",
	"revivee woke up in a cave",
	"revivee used cheat engine",
	"mero's puppy licked revivee",
	"revivee actived totem of undying",
	"olek picked revivee off the ground",
	"revivee was licked by the perfect kitten",
	"gibing tree is revivee's simp",
	"revivee was just sleeping lol",
	"revivee forgot they had work",
	"revivee became a ZOMBIE",
	"revivee woke up from Snowy's neko dance, what a simp",
	"revivee found a glitch in the matrix",
	"revivee touched grass",
	"revivee bought back in",
	"revivee was struck by helpful lightning",
	"revivee was wormholed out of the 8th dimension",
	"revivee woke up in a hotel hallway",
	"revivee woke up in a mansion",
	"revivee busted through their coffin",
	"revivee was rejected from the afterlife",
	"revivee was dropped off by a UFO",
	"revivee was granted Atia's Blessing",
	"Snowi lent revivee a hand",
	"Identity gave revivee mouth-to-mouth",
	"revivee was reborn as a whale",
	"the fire was too hot for revivee",
	"revivee played the reverse card",
	"revivee sold their soul for another chance"

]

const eventMessages = [
	"There was a stampede of Big Yaks!",
	"Rand went berserker mode with his katanas!",
	"Eggy took her ultimate form: Ultra Copter!",
	"It rained bowling balls!",
	"ET Cult attacked!",
	"The Lunacian Express derailed!",
	"BYAK ATTACK!!!!",
	"Bread man unleashed a storm of guillotines"
]


//fisher-yates shuffle
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, message, client) {

		//detect gibaway in message stream
		if (message.author.id == 1119451259481624726 && message.embeds.length != 0 && 'title' in message.embeds[0].data && message.embeds[0].data.title.includes('GIBAWAY ALERT')){
			
			//grab data from gibaway message
			let gibType;
			let countDown;
			let axieID;
            //additional variables for team battle
            //let token;
            //let amount:
			message.embeds[0].data.fields.forEach((field) => {
				if (field.name == 'Gib Type') {gibType = field.value}
				else if (field.name == 'Countdown') {countDown = field.value}
				else if (field.name == 'Axie ID') {axieID = field.value}
                //token gib will look something like this
                //else if (field.name == 'Token') {token = field.value}
                //else if (field.name == 'Amount') {amount = field.value}
			})
			
			//define actions and rules for deathmatch
			if (gibType == 'Team Deathmatch'){

                //replace emoijis with axie stuff
                const team1Emoji = '🍑';
                const team2Emoji = '🍓';
                const team3Emoji = '🍋';
                
                //bot react to own message
				message.react(team1Emoji);
				message.react(team2Emoji);
				message.react(team3Emoji);

				//init variables for game and countdown
				let reviveDict = {};
				let killDict = {};
				let countDownMS = 0;
				if (countDown == '1 minute') { countDownMS = 60000}
				else if (countDown == '2 minutes') { countDownMS = 120000}
				else if (countDown == '3 minutes') { countDownMS = 180000}
				else if (countDown == '5 minutes') { countDownMS = 300000}
				else if (countDown == '10 minutes') { countDownMS = 600000}
				else if (countDown == '10 seconds') { countDownMS = 5000}

				//define filter as every peach reaction except for bot
				const filter = (reaction, user) => {
					return (reaction.emoji.name === team1Emoji || reaction.emoji.name === team2Emoji || reaction.emoji.name === team3Emoji) && !user.bot;
				};
				
				//assign reaction collector to the gibaway message
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				//fill initial list of players
				collector.on('collect', (reaction, user) => {
					if (!alive.includes(user) && alive.length < 200){
                        if (reaction.emoji.name == team1Emoji ){
                            aliveTeam1.push(user)
                            console.log(`Collected ${reaction.emoji} from ${user.username}`);
                        }
                        else if (reaction.emoji.name == team2Emoji ){
                            aliveTeam2.push(user)
                            console.log(`Collected ${reaction.emoji} from ${user.username}`);
                        }
                        else if (reaction.emoji.name == team3Emoji ){
                            aliveTeam3.push(user)
                            console.log(`Collected ${reaction.emoji} from ${user.username}`);
                        }
                        alive.push(user);
					}
				});
				
				//when collector ends, start game
				collector.on('end', (collected, reason) => {

					//init dicts for counting number of deaths and rebaybs
					alive.forEach((user) =>{
						reviveDict[user.tag] = 0;
						killDict[user.username] = 0;
					})

					//allow extra time to process
					if (alive.length > 150){
						timeout = 50000;
					}
					else if (alive.length > 100){
						timeout = 35000;
					}
					else if (alive.length > 40){
						timeout = 25000;
					}

					//create embed message to alert game started
					const initEmbed = new EmbedBuilder()
						.setTitle('Let the Deathmatch Commence')
						.setColor(0xe5de00)
						.setDescription(`${alive.length} players are ready for battle!!`)
					
					//send game init message
					message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [initEmbed] })
					
					//the game (recursive)
					let round = 0;
					async function processRounds() {
						round+=1
						let revRate;
						let deathRate;
						let messageList = [];

                        //combine all alive players
                        alive = aliveTeam1.concat(aliveTeam2).concat(aliveTeam3);
                        //combine all dead players
                        dead = deadTeam1.concat(deadTeam2).concat(deadTeam3);

						//while at least two teams still alive
						if ((aliveTeam1.length > 0 && aliveTeam2.length > 0) || (aliveTeam2.length > 0 && aliveTeam3.length > 0) || (aliveTeam1.length > 0 && aliveTeam3.length > 0)){

							//check for group kill events
							const eventSeed = Math.random();
							if (eventSeed < .05){
								alive.forEach((user) => {
									
									//leave at least 1 person alive, max 30 deaths per event
									if (alive.length > 1 && messageList.length < 30){
										subSeed = Math.random();
										//half of people die
										if (subSeed < .5) {

                                            //adjust master lists
                                            alive.splice(alive.indexOf(user),1)
                                            dead.push(user);

                                            //adjust individual lists
                                            if (aliveTeam1.includes(user)){
                                                messageList.push(`💀 ${team1Emoji} **~~${user.username}~~** ${team1Emoji} `)
                                                aliveTeam1.splice(aliveTeam1.indexOf(user),1)
                                                deadTeam1.push(user);
                                            }
                                            else if (aliveTeam2.includes(user)){
                                                messageList.push(`💀 ${team2Emoji} **~~${user.username}~~** ${team2Emoji} `)
                                                aliveTeam2.splice(aliveTeam2.indexOf(user),1)
                                                deadTeam2.push(user);
                                            }
                                            else if (aliveTeam3.includes(user)){
                                                messageList.push(`💀 ${team3Emoji} **~~${user.username}~~** ${team3Emoji} `)
                                                aliveTeam3.splice(aliveTeam3.indexOf(user),1)
                                                deadTeam3.push(user);
                                            }
											
										}
									}
								})
								let messageString = "";
								messageList.forEach((message) => {
									messageString+=`${message}\n`
								})
								if (messageList.length == 0){
									messageString="Nobody was injured"
								}

								//build embed message for group kills
								const eventEmbed = new EmbedBuilder()
									.setTitle(`${eventMessages[Math.floor(Math.random()*eventMessages.length)]}`)
									.setColor(0xe5de00)
									.setFooter({text: `Remaining Players \n${team1Emoji} ${aliveTeam1.length} ${team2Emoji} ${aliveTeam2.length} ${team3Emoji} ${aliveTeam3.length}`})
									.setFields(
										{ name: 'Casualties', value: `${messageString}` }
									)
							
								//send group kill message and call processRounds again
								message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [eventEmbed] });
								setTimeout(processRounds, timeout);
							}

							//check for group rebayb event
							else if (eventSeed > .975){
								dead.forEach((user) => {
									//max 20 rebaybs per event
									if (messageList.length < 30){

                                        //adjust master lists
                                        dead.splice(dead.indexOf(user),1)
										alive.push(user);

                                        //adjust team lists
                                        if (deadTeam1.includes(user)){
                                            messageList.push(`💗 ${team1Emoji} **${user.username}** ${team1Emoji}`)
                                            deadTeam1.splice(deadTeam1.indexOf(user),1)
                                            aliveTeam1.push(user);
                                        }
                                        if (deadTeam2.includes(user)){
                                            messageList.push(`💗 ${team2Emoji} **${user.username}** ${team2Emoji}`)
                                            deadTeam2.splice(deadTeam2.indexOf(user),1)
                                            aliveTeam2.push(user);
                                        }
                                        if (deadTeam3.includes(user)){
                                            messageList.push(`💗 ${team3Emoji} **${user.username}** ${team3Emoji}`)
                                            deadTeam3.splice(deadTeam3.indexOf(user),1)
                                            aliveTeam3.push(user);
                                        }
										
									}
								})
								let messageString = "";
								messageList.forEach((message) => {
									messageString+=`${message}\n`
								})
								if (messageList.length == 0){
									messageString="Nobody was dead in the first place"
								}

								//build embed message for group rebayb event
								const eventEmbed = new EmbedBuilder()
									.setTitle(`Jihoz Spoketh Unto You!`)
									.setColor(0xe5de00)
									.setFooter({text: `Remaining Players \n${team1Emoji} ${aliveTeam1.length} ${team2Emoji} ${aliveTeam2.length} ${team3Emoji} ${aliveTeam3.length}`})
									.setFields(
										{ name: 'Wake up!', value: `${messageString}` }
									)
							
								//send message and call processRounds again
								message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [eventEmbed] });
								setTimeout(processRounds, timeout);
							}

							//no event
							//check for individual deaths and rebaybs
							else{
								
								//concat list so we can process kills and rebaybs simultaneously
								let masterList = alive.concat(dead);

								//randomize player order
								shuffle(masterList)

								//balancing
								//set death rates
								if (alive.length > 150) {deathRate = .1;}
								else if (alive.length > 100) {deathRate = .15;}
								else if (alive.length > 50) {deathRate = .2;}
								else if (alive.length > 20) {deathRate = .25;}
								else if (alive.length > 10) {deathRate = .3;}
								else if (alive.length > 5) {deathRate = .4;}
								else {deathRate = .5;}

								//set rev rates
								if (dead.length < 10) {revRate = .11;}
								else if (dead.length < 20) {revRate = .055;}
								else if (dead.length < 50) {revRate = .025;}
								else if (dead.length < 100) {revRate = .015;}
								else if (dead.length < 150) {revRate = .0075;}
								else {revRate = .005;}

								//check for individual deaths and rebaybs
								masterList.forEach((user) => {
									//deaths
									if (alive.includes(user)){
										//leave one alive, max 30 messages per round
										if (alive.length > 1 && messageList.length < 30){
											const seed = Math.random();
											//someone dies
											if (seed<deathRate){
												let isKiller;
                                                let killedEmoji;
                                                let killerEmoji;

												//define function for finding random killer
												let findKiller = () => {
													isKiller = alive[Math.floor(Math.random()*alive.length)]
                                                    console.log('killer', isKiller)

													//no suicides
													if (isKiller == user){
														findKiller()
													}
                                                    //cant kill teammate
                                                    else if ((aliveTeam1.includes(user) && aliveTeam1.includes(isKiller)) || (aliveTeam2.includes(user) && aliveTeam2.includes(isKiller)) || (aliveTeam3.includes(user) && aliveTeam3.includes(isKiller))) {
                                                        findKiller()
                                                    }
													else {
														killDict[isKiller.username] += 1;
                                                        if (aliveTeam1.includes(isKiller)) {
                                                            killerEmoji = team1Emoji;
                                                        }
                                                        else if (aliveTeam2.includes(isKiller)) {
                                                            killerEmoji = team2Emoji;
                                                        }
                                                        else if (aliveTeam3.includes(isKiller)) {
                                                            killerEmoji = team3Emoji;
                                                        }
													}
												}

												//choose random death message
												const deathMsg = deathMessages[Math.floor(Math.random()*deathMessages.length)];
												
												//if death message is a murder, find a killer
												if (deathMsg.includes('killer')){
													findKiller()
												}

												//update master lists
												alive.splice(alive.indexOf(user),1)
												dead.push(user);

                                                //update team lists and find correct emojis
                                                if (aliveTeam1.includes(user)){
                                                    killedEmoji = team1Emoji;
                                                    aliveTeam1.splice(aliveTeam1.indexOf(user),1)
                                                    deadTeam1.push(user);
                                                }
                                                else if (aliveTeam2.includes(user)){
                                                    killedEmoji = team2Emoji;
                                                    aliveTeam2.splice(aliveTeam2.indexOf(user),1)
                                                    deadTeam2.push(user);
                                                }
                                                else if (aliveTeam3.includes(user)){
                                                    killedEmoji = team3Emoji;
                                                    aliveTeam3.splice(aliveTeam3.indexOf(user),1)
                                                    deadTeam3.push(user);
                                                }

                                                //add text for embed message later
                                                if (deathMsg.includes('killer')){
												    messageList.push('💀 '+deathMsg.replace('killee',`${killedEmoji} **~~${user.username}~~** ${killedEmoji}`).replace('killer',`${killerEmoji} **${isKiller.username}** ${killerEmoji}`))
                                                }
                                                else{
												    messageList.push('💀 '+deathMsg.replace('killee',`${killedEmoji} **~~${user.username}~~** ${killedEmoji}`))
                                                }
												
												console.log(`${user} died`)
											}

											//bloodmoon deaths
											else if (round >= 20 && messageList.length < 30) {
												if (seed > .6) {

                                                    //update team lists and find correct emojis
                                                    if (aliveTeam1.includes(user)){
                                                        killedEmoji = team1Emoji;
                                                        aliveTeam1.splice(aliveTeam1.indexOf(user),1)
                                                        deadTeam1.push(user);
                                                    }
                                                    if (aliveTeam2.includes(user)){
                                                        killedEmoji = team2Emoji;
                                                        aliveTeam2.splice(aliveTeam2.indexOf(user),1)
                                                        deadTeam2.push(user);
                                                    }
                                                    if (aliveTeam3.includes(user)){
                                                        killedEmoji = team3Emoji;
                                                        aliveTeam3.splice(aliveTeam3.indexOf(user),1)
                                                        deadTeam3.push(user);
                                                    }

													console.log(`${user} killed bloodmoon`);
													messageList.push(`🩸 ${killedEmoji} **~~${user.username}~~** ${killedEmoji} died to bloodmoon`);

                                                    //update master lists
													alive.splice(alive.indexOf(user),1);
													dead.push(user);
												}
											}
											else if (round >= 15 && messageList.length < 30) {
												if (seed > .8) {

													//update team lists and find correct emojis
                                                    if (aliveTeam1.includes(user)){
                                                        killedEmoji = team1Emoji;
                                                        aliveTeam1.splice(aliveTeam1.indexOf(user),1)
                                                        deadTeam1.push(user);
                                                    }
                                                    else if (aliveTeam2.includes(user)){
                                                        killedEmoji = team2Emoji;
                                                        aliveTeam2.splice(aliveTeam2.indexOf(user),1)
                                                        deadTeam2.push(user);
                                                    }
                                                    else if (aliveTeam3.includes(user)){
                                                        killedEmoji = team3Emoji;
                                                        aliveTeam3.splice(aliveTeam3.indexOf(user),1)
                                                        deadTeam3.push(user);
                                                    }
                                                    
													console.log(`${user} killed bloodmoon`);
													messageList.push(`🩸 ${killedEmoji} **~~${user.username}~~** ${killedEmoji} died to bloodmoon`);

                                                    //update master lists
													alive.splice(alive.indexOf(user),1);
													dead.push(user);
												}
											}

											//check for neutrals events
											else if (seed >= deathRate && messageList.length< 30){
												if (seed > .99){
													messageList.push('🚶 '+neutralMessages[Math.floor(Math.random()*neutralMessages.length)].replace('thisUser',`**${user.username}**`))
												}
												console.log(`${user} survived`)
											}
										}  
									}

									//rebaybs
									else if (dead.includes(user)){
                                        let rebaybEmoji;
										const seed = Math.random();

										//max 2 rebaybs per game, 20 messages per round
										if (messageList.length < 30 && reviveDict[user.tag] <= 2 && seed<revRate) {
											
                                            //choose team emojis and update team lists
                                            if (deadTeam1.includes(user)){
                                                rebaybEmoji = team1Emoji;
                                                deadTeam1.splice(deadTeam1.indexOf(user),1)
                                                aliveTeam1.push(user);
                                            }
                                            else if (deadTeam2.includes(user)){
                                                rebaybEmoji = team2Emoji;
                                                deadTeam2.splice(deadTeam2.indexOf(user),1)
                                                aliveTeam2.push(user);
                                            }
                                            else if (deadTeam3.includes(user)){
                                                rebaybEmoji = team3Emoji;
                                                deadTeam3.splice(deadTeam3.indexOf(user),1)
                                                aliveTeam3.push(user);
                                            }

											//choose random rebayb message, add to embed message for later
											messageList.push('💗 '+ lifeMessages[Math.floor(Math.random()*lifeMessages.length)].replace('revivee',`${rebaybEmoji} **${user.username}** ${rebaybEmoji} `).replace('reviver',`**${alive[Math.floor(Math.random()*alive.length)].username}**`))
											
											//incrememnt rebayb count for user
											reviveDict[user.tag] += 1;

											//update dead and alive lists
											dead.splice(dead.indexOf(user),1)
											alive.push(user);

											console.log(`${user} revived`);
										}
									}
								})
								
								//build death and rebayb info for embed message
								let messageString = "";
								messageList.forEach((message) => {
									messageString+=`${message}\n`
								})

								//when nobody did anything in a round
								if (messageList.length == 0){messageString="Everyone refused to fight!"}
							
								//build top kills leaderboard for embed message
								let topKillsString = "";
								const topKills = Object.entries(killDict)
									.sort((curr, next) => next[1] - curr[1])
								topKills.slice(0,2).forEach((topKiller)=>{
                                    console.log('topkiller',topKiller)
									if (topKiller[1] > 0) {
                                        let topKillEmoji = '';
                                        
                                        //choose team emojis
                                        if (deadTeam1.includes(topKiller[0]) || aliveTeam1.includes(topKiller[0])){
                                            topKillEmoji = team1Emoji;
                                        }
                                        else if (deadTeam2.includes(topKiller[0]) || aliveTeam2.includes(topKiller[0])){
                                            topKillEmoji = team2Emoji;
                                        }
                                        else if (deadTeam3.includes(topKiller[0]) || aliveTeam3.includes(topKiller[0])){
                                            topKillEmoji = team3Emoji;
                                        }
										topKillsString+=`${topKillEmoji} ${topKiller[1]} ${topKiller[0]} ${topKillEmoji} \n`
									}
								})
								if (topKillsString.length ==0){topKillsString="None"}

								//build the message
								const roundEmbed = new EmbedBuilder()
									.setTitle(`Round ${round}`)
									.setColor(0xe5de00)
									.setFooter({text: `Remaining Players \n${team1Emoji} ${aliveTeam1.length} ${team2Emoji} ${aliveTeam2.length} ${team3Emoji} ${aliveTeam3.length}`})
									.setDescription(`${messageString}`)
									.setFields(
										{ name: 'Top Kills', value: `${topKillsString}`}
									)
							
								//send round update message and call processRounds again
								message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [roundEmbed] });
								setTimeout(processRounds, timeout);
							}
						}

						//finally someone won the game
						else{
                            //this needs extensive changes to split rewards between winning team

							//add winner record to mongodb so winner can claim later
							axios.post("http://localhost:8080/api/winner",{ "user":alive[0].id,"axieID":axieID})
								.then((res)=>{
									console.log('winner record added to database')})
								.catch((err)=>{
									console.log(err);
									console.log('winner record not added to database')})
							
							//grab axie img
							const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
							
							//build winner message
							const winEmbed = new EmbedBuilder()
								.setDescription(`${alive[0].username} won Axie #${axieID}\n\nuse the /claim command for prize delivery!`)
								.setThumbnail('attachment://axie-full-transparent.png')
								.setColor(0xe5de00)
							
							//send winner message
							message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${alive[0]}`, embeds: [winEmbed], files: [axieImg] });
							
							//reset alive and dead lists
							alive.length = 0;
							dead.length = 0;   
							aliveTeam1.length = 0;
							deadTeam1.length = 0;   
							aliveTeam2.length = 0;
							deadTeam2.length = 0;   
							aliveTeam3.length = 0;
							deadTeam3.length = 0;
						}
					}

					//start game
					setTimeout(processRounds, timeout);

				});
			}
		}
	},
};


