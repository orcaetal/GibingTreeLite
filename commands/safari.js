const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const axios = require("axios");
const { id } = require('ethers/lib/utils');

//export slash command /safari-ticket for approved users to get a rnadom encounter
module.exports = {
	data: new SlashCommandBuilder()
		.setName("safari-ticket")
		.setDescription('enter the axie safari')
		,
	
	//perform the /safari-ticket
	async execute(interaction) {
		
		//defer response to allow time for processing
		await interaction.deferReply();

		//admin only
        if(interaction.member._roles.includes('1038522161532502056')){

            //define recursive safari game rules
            //first, build initial message embed, then pass it into this function
            async function processSafariRound(health, fear, header, interactionReference, interactionReplyReference) {
                
                //only player can react
                const collectorFilter = i => i.user.id === interactionReference.user.id;
        
                try {

                    //wait 60 sec for choice
                    const confirmation = await interactionReplyReference.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                    
                    //player chose attack
                    if (confirmation.customId === 'attack') {
                        const attackSeed = Math.random();
                        const escapeThreshhold = fear * .1 / 3; 
                        if (attackSeed < escapeThreshhold) {
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Ran Away`)
                                .setColor(0xe5de00)
                                .setImage('attachment://axie-full-transparent.png')
                            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: []});
                        }
                        else{
                            const attackRand = Math.random();

                            //check for critical hit
                            if (attackRand < .15){
                                health -= 5;
                                header = 'Critical Hit!\nHealth -5';
                            }

                            //check for miss
                            else if (attackRand < .25){
                                health -= 5;
                                header = 'Attack Missed!';
                            }

                            //normal hit 
                            else{
                                const healthRand = Math.floor(Math.random() * (3 - 1) + 1);
                                health -= healthRand
                                header = `The Axie was Hurt\nHealth -${healthRand}`
                            }
                            
                            if (health < 1){health = 1}
                            let healthBar = '';
                            if (health>6){healthEmoji = '🟩'}
                            else if (health >3 && health<=6){healthEmoji = '🟨'}
                            else if (health<=3){healthEmoji = '🟥'}
                                
                            for (let i = 0; i < health; i++) {
                                healthBar += healthEmoji
                            }

                            //adjust fear
                            const fearRand = Math.floor(Math.random() * (2 - 1) + 1);
                            fear += fearRand;
                            header+=`\nFear +${fearRand}`;
                            if (fear > 12){fear = 12}
                            let fearBar = '';
                            for (let i = 0; i < fear; i++) {
                                fearBar += "🟦"
                            }

                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`Welcome to the Axie Safari`)
                                .setDescription(`${header}`)
                                .setColor(0xe5de00)
                                .setFields(
                                    { name: 'Health', value: `${healthBar}`},
                                    { name: 'Fear', value: `${fearBar}`},
                                )
                                .setImage('attachment://axie-full-transparent.png')


                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: [row]});

                            processSafariRound(health, fear, header, interactionReference, interactionReplyReference)
                        }
                        
                        
                    }

                    //player chose treat
                    if (confirmation.customId === 'treat') {
                        const treatSeed = Math.random();
                        const escapeThreshhold = fear * .1 / 5;

                        if (treatSeed < escapeThreshhold){
                            const editEmbed = new EmbedBuilder()
                            .setTitle(`The Axie Ran Away`)
                            .setColor(0xe5de00)
                            .setImage('attachment://axie-full-transparent.png')
                        
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: []});
                        }
                        else{
                            
                            //check for critical hit
                            if (Math.random() < .15){
                                fear -= 5
                                header = 'The Axie Calmed Down a Lot!\nFear -5'
                            }
                            //adjust fear
                            else{
                                const fearRand = Math.floor(Math.random() * (3 - 2) + 2);
                                fear -= fearRand;
                                header = `The Axie is Eating\nFear -${fearRand}`
                            }
                            
                            if (fear < 1){fear = 1}
                            let fearBar = '';
                            for (let i = 0; i < fear; i++) {
                                fearBar += "🟦"
                            }

                            const healthRand = Math.floor(Math.random() * (2 - 1) + 1);
                            health += healthRand;
                            header+= `\n Health +${healthRand}`
                            if (health > 12){health = 12}
                            let healthBar = '';
                            if (health>6){healthEmoji = '🟩'}
                            else if (health >3 && health<=6){healthEmoji = '🟨'}
                            else if (health<=3){healthEmoji = '🟥'}
                                
                            for (let i = 0; i < health; i++) {
                                healthBar += healthEmoji
                            }
                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`Welcome to the Axie Safari`)
                                .setDescription(`${header}`)
                                .setColor(0xe5de00)
                                .setFields(
                                    { name: 'Health', value: `${healthBar}`},
                                    { name: 'Fear', value: `${fearBar}`},
                                )
                                .setImage('attachment://axie-full-transparent.png')
                            
            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: [row]});

                            processSafariRound(health, fear, header, interactionReference, interactionReplyReference)
                        }
                        
                        
                    }

                    //player chose capture
                    else if (confirmation.customId === 'capture') {
                        const captureSeed = Math.random();
                        const escapeThreshhold = fear * .1 / 4;
                        //half the distance from .1health to 1 -- 5 health -> 25% capture, 8 health -> 10%, 1 health -> 45%
                        const captureThreshhold = (1 - (health * .1)) /2;
                        if (captureSeed < captureThreshhold){
                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Joined Your Party!!!!`)
                                .setColor(0xe5de00)
                                .setImage('attachment://axie-full-transparent.png')
                            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: []});
                        }
                        else if (captureSeed < escapeThreshhold){
                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Ran Away`)
                                .setColor(0xe5de00)
                                .setImage('attachment://axie-full-transparent.png')
                            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: []});
                        }
                        else{

                            //adjust fear
                            fear += 1;
                            if (fear > 12){fear = 12}
                            let fearBar = '';
                            for (let i = 0; i < fear; i++) {
                                fearBar += "🟦"
                            }

                            //reconstruct health bar
                            let healthBar = '';
                            if (health>6){healthEmoji = '🟩'}
                            else if (health >3 && health<=6){healthEmoji = '🟨'}
                            else if (health<=3){healthEmoji = '🟥'}
                                
                            for (let i = 0; i < health; i++) {
                                healthBar += healthEmoji
                            }

                            //adjust header
                            header = 'The Axie Avoided Capture!\nFear +1'

                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`Welcome to the Axie Safari`)
                                .setDescription(`${header}`)
                                .setColor(0xe5de00)
                                .setFields(
                                    { name: 'Health', value: `${healthBar}`},
                                    { name: 'Fear', value: `${fearBar}`},
                                )
                                .setImage('attachment://axie-full-transparent.png')
                            
        
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [axieImg],
                                components: [row]});

                            processSafariRound(health, fear, header, interactionReference, interactionReplyReference)
                        }
                    }
                    
                    //player chose run away
                    else if (confirmation.customId === 'run-away') {
                        
                        const editEmbed = new EmbedBuilder()
                            .setTitle(`You Got Away Safely...`)
                            .setColor(0xe5de00)
                            .setImage('attachment://axie-full-transparent.png')
                            
                        await confirmation.update({ embeds: [editEmbed], 
                            files: [axieImg],
                            components: []});
                        
                    }

                } catch (e) {
                    console.log(e)
                    //embed encounter update
                    const editEmbed = new EmbedBuilder()
                    .setTitle(`The Axie Got Bored and Wandered Off`)
                    .setColor(0xe5de00)
                    .setImage('attachment://axie-full-transparent.png')
                
                    await confirmation.update({ embeds: [editEmbed], 
                        files: [axieImg],
                        components: []});
                }
            }
        

            //start up the game

            //init axie stats

            //choose axie
            const randomAxie = Math.floor(Math.random() * (11000000 - 1) + 1);
            console.log(randomAxie)

            //make graphQL query
            const gqlEndpoint = "https://api-gateway.skymavis.com/graphql/marketplace";
            const gqlHeaders = {
                "content-type": "application/json",
                "X-API-Key": "Z0Jaun346EInx2a1aezGOAGrCdRGVNAa"
            };
            const gqlQuery = {
                query:
                `query MyQuery {
                    axie(axieId: ${randomAxie}) {
                        bodyShape
                        class
                        image
                        id
                        parts {
                            class
                            name
                            type
                            abilities {
                                attack
                                defense
                                energy
                                name
                                attackType
                            }
                        }
                        owner
                    }
                }`
            }

            axios({
                url: gqlEndpoint,
                method: 'post',
                headers: gqlHeaders,
                data: gqlQuery
            }).then((result) => {
                console.log(result.data)
            })

            const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${randomAxie}/axie/axie-full-transparent.png`);
            let fear = Math.floor(Math.random() * (5 - 2) + 2);
            let health = Math.floor(Math.random() * (12 - 7) + 7);

            //build initial edit to start game.
            //from here on, the reply will not be edited, but "updated" inside the recursive game function

            //build stat bars
            
            let healthEmoji = '';
            if (health>6){healthEmoji = '🟩'}
            else if (health >3 && health<=6){healthEmoji = '🟨'}
            else if (health<=3){healthEmoji = '🟥'}
            
            let healthBar = '';
            for (let i = 0; i < health; i++) {
                healthBar += healthEmoji
            }

            let fearBar = '';
            for (let i = 0; i < fear; i++) {
                fearBar += "🟦"
            }

            let header = 'A Wild Axie Appeared!';

            //build buttons
            const attack = new ButtonBuilder()
                .setCustomId('attack')
                .setLabel('Attack!')
                .setStyle(ButtonStyle.Primary);
            
            const treat = new ButtonBuilder()
                .setCustomId('treat')
                .setLabel('Give Treat')
                .setStyle(ButtonStyle.Primary);

            const capture = new ButtonBuilder()
                .setCustomId('capture')
                .setLabel('Attempt Capture')
                .setStyle(ButtonStyle.Primary);
            
            const runAway = new ButtonBuilder()
                .setCustomId('run-away')
                .setLabel('Run Away')
                .setStyle(ButtonStyle.Primary);

            //build action row
            const row = new ActionRowBuilder()
                .addComponents(attack, treat, capture, runAway);

            //initial embed message for game visual
            const safariEmbed = new EmbedBuilder()
                .setTitle(`Welcome to the Axie Safari`)
                .setDescription(`${header}`)
                .setColor(0xe5de00)
                .setFields(
                    { name: 'Health', value: `${healthBar}`},
                    { name: 'Fear', value: `${fearBar}`},
                )
                .setImage('attachment://axie-full-transparent.png')

            const interactionReply = await interaction.editReply({ embeds: [safariEmbed], 
                                                                    files: [axieImg],
                                                                    components: [row]});

            //pass initial message to recursive game function and start
            processSafariRound(health, fear, "A Wild Axie Appeared", interaction, interactionReply)

        }
        else{
            interaction.editReply('admin only')
        }
        
		
	}
};
