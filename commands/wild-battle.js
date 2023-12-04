const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const axios = require("axios");
const { id } = require('ethers/lib/utils');

//TODO
//to allow multiple simultaneous games, add a game ID flag to each message, only execute if game ID == this game id

//export slash command /wild-battle for approved users to get a rnadom encounter
module.exports = {
	data: new SlashCommandBuilder()
		.setName("wild-battle")
		.setDescription('random encounter with a wild axie')
		,
	
	//perform the /wild-battle
	async execute(interaction) {
		
		//defer response to allow time for processing
		await interaction.deferReply();

		//admin only
        if(interaction.member._roles.includes('1038522161532502056')){

            //define recursive battle game rules
            //first, build initial message embed, then pass it into this function
            let row1, row2, row3;
            let round = 0;
            let gameOver = false;
            let battleLog = ""
            const partDictionary = {
                "Shoal Star": "attack",
                "Oranda": "debuff",
                "Anemone": "attack",
                "Clamshell": "attack",
                "Teal Shell": "shield",
                "Babylonia": "attack",
                "Leaf Bug": "shield",
                "Parasite": "attack",
                "Pliers": "attack",
                "Caterpillar": "attack",
                "Antenna": "shield",
                "Lagging": "attack",
                "Arco": "attack",
                "Dual Blade": "attack",
                "Pocky": "attack",
                "Merry": "shield",
                "Imp": "attack",
                "Little Branch": "attack",
                "Bumpy": "shield",
                "Incisor": "attack",
                "Scaly Spoon": "shield",
                "Cerastes": "debuff",
                "Scaly Spear": "attack",
                "Unko": "attack",
                "Watermelon": "attack",
                "Cactus": "attack",
                "Strawberry Shortcake": "heal",
                "Rose Bud": "heal",
                "Feather Spear": "attack",
                "Wing Horn": "attack",
                "Kestral": "attack",
                "Trump": "attack",
                "Cuckoo": "attack",
                "Eggshell": "attack",
                "Perch": "attack",
                "Anemone": "attack",
                "Sponge": "shield",
                "Goldfish": "attack",
                "Blue Moon": "attack",
                "Spiky Wing": "attack",
                "Scarab": "attack",
                "Sandal": "attack",
                "Buzz Buzz": "attack",
                "Garish Worm": "attack",
                "Snail Shell": "shield",
                "Furball": "attack",
                "Timber": "shield",
                "Risky Beast": "attack",
                "Jaguar": "attack",
                "Hero": "attack",
                "Ronin": "attack",
                "Croc": "shield",
                "Red Ear": "shield",
                "Indian Star": "shield",
                "Green Thorns": "debuff",
                "Tri Spikes": "attack",
                "Bone Sail": "shield",
                "Pumpkin": "shield",
                "Mint": "debuff",
                "Watering Can": "shield",
                "Bidens": "debuff",
                "Tri Feather": "attack",
                "Kingfisher": "shield",
                "Pigeon Post": "attack",
                "Raven": "attack",
                "Cupid": "attack",
                "Balloon": "attack",
                "Piranha": "attack",
                "Risky Fish": "attack",
                "Catfish": "attack",
                "Lam": "attack",
                "Square Teeth": "debuff",
                "Cute Bunny": "attack",
                "Pincer": "shield",
                "Mosquito": "attack",
                "Confident": "debuff",
                "Axie Kiss": "attack",
                "Goda": "attack",
                "Toothless Bite": "attack",
                "Tiny Turtle": "attack",
                "Razor Bite": "attack",
                "Kotaro": "attack",
                "Silence Whisper": "debuff",
                "Herbivore": "attack",
                "Zigzag": "attack",
                "Serious": "attack",
                "Hungry Bird": "attack",
                "Little Owl": "attack",
                "Peace Maker": "attack",
                "Doubletalk": "attack",
                "Shrimp": "attack",
                "Ranchu": "attack",
                "Tadpole": "attack",
                "Navaga": "attack",
                "Koi": "attack",
                "Thorny Caterpillar": "attack",
                "Ant": "shield",
                "Fish Snack": "shield",
                "Pupae": "shield",
                "Twin Tail": "shield",
                "Gravel Ant": "shield",
                "Gerbil": "attack",
                "Nut Cracker": "attack",
                "Hare": "attack",
                "Shiba": "attack",
                "Rice": "debuff",
                "Grass Snake": "debuff",
                "Gila": "attack",
                "Snake Jar": "debuff",
                "Tiny Dino": "attack",
                "Iquana": "attack",
                "Hot Butt": "heal",
                "Potato Leaf": "shield",
                "Yam": "debuff",
                "Hatsune": "shield",
                "Cattail": "heal",
                "Carrot": "attack",
                "Nimo": "debuff",
                "The Last One": "attack",
                "Grandma's Fan": "attack"
            }

            async function processBattleRound(playerHealth, playerAxieParts, enemyHealth, enemyFear, enemyAxieParts, enemyAxieImg, interactionReference, interactionReplyReference) {
                
                //only player can react
                const collectorFilter = i => i.user.id === interactionReference.user.id;
            
                //wait 60 sec for choice
                const confirmation = await interactionReplyReference.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                
                

                try {

                    //players turn
                    let playerShield = 0;

                    //player chose attack
                    if (confirmation.customId.includes('Attack')) {
                        const attackSeed = Math.random();
                        const escapeThreshhold = enemyFear * .1 / 3; 
                        if (attackSeed < escapeThreshhold) {
                            gameOver = true;
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Ran Away`)
                                .setColor(0xe5de00)
                                .setImage('attachment://axie-full-transparent.png')
                            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [enemyAxieImg],
                                components: []});
                        }
                        else{
                            if (partDictionary[confirmation.customId.split('_')[1]] == 'attack'){
                                //check for critical hit
                                const attackRand = Math.random();
                                if (attackRand < .15){
                                    enemyHealth -= 4;
                                    battleLog += "⚔️ Your axie landed a crit for 4 dmg \n"
                                }

                                //check for miss
                                else if (attackRand < .25){
                                    battleLog += "⚔️ Your axie's attack missed' \n"
                                }

                                //normal hit 
                                else{
                                    const healthRand = Math.floor(Math.random() * (3 - 1) + 1);
                                    enemyHealth -= healthRand;
                                    battleLog += `⚔️ Your axie attacked for ${healthRand} dmg \n`
                                }
                            }
                            else if (partDictionary[confirmation.customId.split('_')[1]] == 'heal'){
                                const healthRand = Math.floor(Math.random() * (4 - 2) + 2);
                                playerHealth += healthRand;
                                battleLog += `💗 Your axie healed for ${healthRand} health \n`
                            }
                            else if (partDictionary[confirmation.customId.split('_')[1]] == 'shield'){
                                const healthRand = Math.floor(Math.random() * (5 - 3) + 3);
                                playerShield += healthRand;
                                battleLog += `🛡️ Your axie shielded for ${healthRand} shield \n`
                            }
                            else if (partDictionary[confirmation.customId.split('_')[1]] == 'debuff'){
                                const fearRand = Math.floor(Math.random() * (5 - 3) + 3);
                                enemyFear -= fearRand;
                                battleLog += `☁️ You calmed the enemy for ${fearRand} fear \n`
                            }
                            

                            
                            
                            if (enemyHealth < 1){enemyHealth = 1}
                            let enemyHealthBar = '';
                            if (enemyHealth>6){enemyHealthEmoji = '🟩'}
                            else if (enemyHealth >3 && enemyHealth<=6){enemyHealthEmoji = '🟨'}
                            else if (enemyHealth<=3){enemyHealthEmoji = '🟥'}
                                
                            for (let i = 0; i < enemyHealth; i++) {
                                enemyHealthBar += enemyHealthEmoji
                            }
                            
                            if (playerHealth < 1){playerHealth = 1}
                            let playerHealthBar = '';
                            if (playerHealth>6){playerHealthEmoji = '🟩'}
                            else if (playerHealth >3 && playerHealth<=6){playerHealthEmoji = '🟨'}
                            else if (playerHealth<=3){playerHealthEmoji = '🟥'}
                                
                            for (let i = 0; i < playerHealth; i++) {
                                playerHealthBar += playerHealthEmoji
                            }

                            //add shield
                            for (let i = 0; i < playerShield; i++) {
                                playerHealthBar += "🟦"
                            }

                            //adjust fear
                            const fearRand = Math.floor(Math.random() * (2 - 1) + 1);
                            enemyFear += fearRand;
                            if (enemyFear > 12){enemyFear = 12}
                            let enemyFearBar = '';
                            for (let i = 0; i < enemyFear; i++) {
                                enemyFearBar += "🟦"
                            }

                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                            .setTitle(`The Wild Axie is Thinking...`)
                            .setColor(0xe5de00)
                                .setFields(
                                    { name: 'Battle Log', value: `${battleLog}`},
                                    { name: 'Your Health', value: `${playerHealthBar}`},
                                    { name: '----------------', value: `----------------`},
                                    { name: 'Enemy Health', value: `${enemyHealthBar}`},
                                    { name: 'Enemy Fear', value: `${enemyFearBar}`},
                                )
                                .setImage('attachment://axie-full-transparent.png')
                                .setThumbnail(`https://axiecdn.axieinfinity.com/axies/${randomPlayerAxie}/axie/axie-full-transparent.png`)
                                .setFooter({text:'⚔️ Wild Axie is Thinking ⚔️'})


                            await confirmation.update({ embeds: [editEmbed], 
                                files: [enemyAxieImg],
                                components: []});

                            // processBattleRound(playerHealth, playerAxieParts, enemyHealth, enemyFear, enemyAxieParts, enemyAxieImg, header, interactionReference, interactionReplyReference)
                        }
                        
                        
                    }


                    //player chose capture
                    else if (confirmation.customId === 'capture') {
                        const captureSeed = Math.random();
                        const escapeThreshhold = enemyFear * .1 / 4;
                        //half the distance from .1 health to 1 -- 5 health -> 25% capture, 8 health -> 10%, 1 health -> 45%
                        const captureThreshhold = (1 - (enemyHealth * .1)) /2;
                        if (captureSeed < captureThreshhold){

                            gameOver = true;
                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Joined Your Party!!!!`)
                                .setColor(0xe5de00)
                                .setImage('attachment://axie-full-transparent.png')
                            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [enemyAxieImg],
                                components: []});
                        }
                        else if (captureSeed < escapeThreshhold){

                            gameOver = true;
                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Ran Away`)
                                .setColor(0xe5de00)
                                .setImage('attachment://axie-full-transparent.png')
                            
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [enemyAxieImg],
                                components: []});
                        }
                        else{

                            //adjust fear
                            enemyFear += 1;
                            if (enemyFear > 12){enemyFear = 12}
                            let enemyFearBar = '';
                            for (let i = 0; i < enemyFear; i++) {
                                enemyFearBar += "🟦"
                            }

                            //reconstruct health bar
                            let enemyHealthBar = '';
                            if (enemyHealth>6){enemyHealthEmoji = '🟩'}
                            else if (enemyHealth >3 && enemyHealth<=6){enemyHealthEmoji = '🟨'}
                            else if (enemyHealth<=3){enemyHealthEmoji = '🟥'}
                                
                            for (let i = 0; i < enemyHealth; i++) {
                                enemyHealthBar += enemyHealthEmoji
                            }

                            //reconstruct health bar
                            let playerHealthBar = '';
                            if (playerHealth>6){playerHealthEmoji = '🟩'}
                            else if (playerHealth >3 && playerHealth<=6){playerHealthEmoji = '🟨'}
                            else if (playerHealth<=3){playerHealthEmoji = '🟥'}
                                
                            for (let i = 0; i < playerHealth; i++) {
                                playerHealthBar += playerHealthEmoji
                            }

                            //adjust header

                            //embed encounter update
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`The Axie Avoided Capture\nThe Wild Axie is Thinking...`)
                                .setColor(0xe5de00)
                                .setFields(
                                    { name: 'Your Health', value: `${playerHealthBar}`},
                                    { name: '----------------', value: `----------------`},
                                    { name: 'Enemy Health', value: `${enemyHealthBar}`},
                                    { name: 'Enemy Fear', value: `${enemyFearBar}`},
                                )
                                .setImage('attachment://axie-full-transparent.png')
                                .setThumbnail(`https://axiecdn.axieinfinity.com/axies/${randomPlayerAxie}/axie/axie-full-transparent.png`)
                                .setFooter({text:'⚔️ Choose an Action ⚔️'})
                            
        
                            await confirmation.update({ embeds: [editEmbed], 
                                files: [enemyAxieImg],
                                components: []});

                            //processBattleRound(playerHealth, playerAxieParts, enemyHealth, enemyFear, enemyAxieParts, enemyAxieImg, header, interactionReference, interactionReplyReference)
                        }
                    }
                    
                    //player chose run away
                    else if (confirmation.customId === 'run-away') {
                        gameOver = true;

                        const editEmbed = new EmbedBuilder()
                            .setTitle(`You Got Away Safely...`)
                            .setColor(0xe5de00)
                            .setImage('attachment://axie-full-transparent.png')
                            
                        await confirmation.update({ embeds: [editEmbed], 
                            files: [enemyAxieImg],
                            components: []});
                        
                    }
                    

                    //enemy turn
                    
                    console.log('enemies turn')
                    const attackRand = Math.random();

                    //check for critical hit
                    if (attackRand < .15){
                        playerHealth -= (4-playerShield);
                        battleLog += `⚔️ Wild axie landed a crit for 4 dmg \n`
                    }

                    //check for miss
                    else if (attackRand < .25){
                        battleLog += `⚔️ Wild axie's attack missed \n`
                    }

                    //normal hit 
                    else{
                        const healthRand = Math.floor(Math.random() * (3 - 1) + 1);
                        playerHealth -= (healthRand-playerShield);
                        battleLog += `⚔️ Wild axie attacked for ${healthRand} dmg \n`
                    }
                    
                    if (enemyHealth < 1){enemyHealth = 1}
                    let enemyHealthBar = '';
                    if (enemyHealth>6){enemyHealthEmoji = '🟩'}
                    else if (enemyHealth >3 && enemyHealth<=6){enemyHealthEmoji = '🟨'}
                    else if (enemyHealth<=3){enemyHealthEmoji = '🟥'}
                        
                    for (let i = 0; i < enemyHealth; i++) {
                        enemyHealthBar += enemyHealthEmoji
                    }
                    
                    if (playerHealth < 1){playerHealth = 1}
                    let playerHealthBar = '';
                    if (playerHealth>6){playerHealthEmoji = '🟩'}
                    else if (playerHealth >3 && playerHealth<=6){playerHealthEmoji = '🟨'}
                    else if (playerHealth<=3){playerHealthEmoji = '🟥'}
                        
                    for (let i = 0; i < playerHealth; i++) {
                        playerHealthBar += playerHealthEmoji
                    }

                    //adjust fear
                    let enemyFearBar = '';
                    for (let i = 0; i < enemyFear; i++) {
                        enemyFearBar += "🟦"
                    }
                    

                    if (!gameOver){
                        //embed encounter update
                        const editEmbed = new EmbedBuilder()
                            .setTitle(`Your Turn`)
                            .setColor(0xe5de00)
                            .setDescription('The wild Axie used attack')
                            .setFields(
                                { name: 'Battle Log', value: `${battleLog}`},
                                { name: 'Your Health', value: `${playerHealthBar}`},
                                { name: '----------------', value: `----------------`},
                                { name: 'Enemy Health', value: `${enemyHealthBar}`},
                                { name: 'Enemy Fear', value: `${enemyFearBar}`},
                            )
                            .setImage('attachment://axie-full-transparent.png')
                            .setThumbnail(`https://axiecdn.axieinfinity.com/axies/${randomPlayerAxie}/axie/axie-full-transparent.png`)
                            .setFooter({text:'⚔️ Choose an Action ⚔️'})


                        setTimeout(()=>{
                            interaction.editReply({ embeds: [editEmbed], 
                                files: [enemyAxieImg],
                                components: [row1,row2,row3]});

                                processBattleRound(playerHealth, playerAxieParts, enemyHealth, enemyFear, enemyAxieParts, enemyAxieImg, interactionReference, interactionReplyReference)
                        },2500)
                        
                    }
                        

                } catch (e) {
                    console.log(e)

                    gameOver = true;
                    //embed encounter update
                    const editEmbed = new EmbedBuilder()
                        .setTitle(`The Axie Got Bored and Wandered Off`)
                        .setColor(0xe5de00)
                        .setImage('attachment://axie-full-transparent.png')
                
                    await confirmation.update({ embeds: [editEmbed], 
                        files: [enemyAxieImg],
                        components: []});
                }
            }
        

            //start up the game

            //init axie stats

            //choose axies
            const randomPlayerAxie = Math.floor(Math.random() * (11000000 - 1) + 1);
            const randomEnemyAxie = Math.floor(Math.random() * (11000000 - 1) + 1);

            //make graphQL query
            const gqlEndpoint = "https://api-gateway.skymavis.com/graphql/marketplace";
            const gqlHeaders = {
                "content-type": "application/json",
                "X-API-Key": "Z0Jaun346EInx2a1aezGOAGrCdRGVNAa"
            };

            const gqlPlayerQuery = {
                query:
                `query MyQuery {
                    axie(axieId: ${randomPlayerAxie}) {
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

            const gqlEnemyQuery = {
                query:
                `query MyQuery {
                    axie(axieId: ${randomEnemyAxie}) {
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

            const playerPromise = axios({
                url: gqlEndpoint,
                method: 'post',
                headers: gqlHeaders,
                data: gqlPlayerQuery
            })
            
            const enemyPromise = axios({
                url: gqlEndpoint,
                method: 'post',
                headers: gqlHeaders,
                data: gqlEnemyQuery
            })
            
            Promise.all([playerPromise, enemyPromise]).then(async (result) => {
                
                const playerAxieData = result[0].data.data.axie;
                const enemyAxieData = result[1].data.data.axie;

                //deconstruct axie parts data (player)
                let playerAxieParts = {}
                playerAxieData.parts.forEach((part)=>{
                    //exclude eyes and ears
                    if (part.abilities.length > 0){
                        if (part.abilities.energy = 0){
                            playerAxieParts[part.type] = [part.name, part.abilities[0].attack*2, part.abilities[0].defense*2]
                        }
                        else if (part.abilities.energy == 2){
                            playerAxieParts[part.type] = [part.name, part.abilities[0].attack/2, part.abilities[0].defense/2]
                        }
                        else{
                            console.log(part.abilities)
                            playerAxieParts[part.type] = [part.name, part.abilities[0].attack, part.abilities[0].defense]
                        }
                        
                    }
                })
                //console.log(playerAxieParts)
                //deconstruct axie parts data (enemy)
                let enemyAxieParts = {}
                enemyAxieData.parts.forEach((part)=>{
                    //exclude eyes and ears
                    if (part.abilities.length > 0){
                        if (part.abilities.energy = 0){
                            enemyAxieParts[part.type] = [part.name, part.abilities.attack*2, part.abilities.defense*2]
                        }
                        else if (part.abilities.energy == 2){
                            enemyAxieParts[part.type] = [part.name, part.abilities.attack/2, part.abilities.defense/2]
                        }
                        else{
                            enemyAxieParts[part.type] = [part.name, part.abilities.attack, part.abilities.defense]
                        }
                        
                    }
                })

                const enemyAxieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${randomEnemyAxie}/axie/axie-full-transparent.png`);
                let enemyFear = Math.floor(Math.random() * (5 - 2) + 2);
                let enemyHealth = Math.floor(Math.random() * (12 - 7) + 7);

                //build initial edit to start game.
                //from here on, the reply will not be edited, but "updated" inside the recursive game function

                //build stat bars
                let playerHealth = 10;

                let playerHealthEmoji = '';
                if (playerHealth>6){playerHealthEmoji = '🟩'}
                else if (playerHealth >3 && playerHealth<=6){playerHealthEmoji = '🟨'}
                else if (playerHealth<=3){playerHealthEmoji = '🟥'}
            
                let playerHealthBar = '';
                for (let i = 0; i < playerHealth; i++) {
                    playerHealthBar += playerHealthEmoji
                }
                
                let enemyHealthEmoji = '';
                if (enemyHealth>6){enemyHealthEmoji = '🟩'}
                else if (enemyHealth >3 && enemyHealth<=6){enemyHealthEmoji = '🟨'}
                else if (enemyHealth<=3){enemyHealthEmoji = '🟥'}
            
                let enemyHealthBar = '';
                for (let i = 0; i < enemyHealth; i++) {
                    enemyHealthBar += enemyHealthEmoji
                }

                let enemyFearBar = '';
                for (let i = 0; i < enemyFear; i++) {
                    enemyFearBar += "🟦"
                }

                const attackEmojis = {
                    'attack': '⚔️',
                    'shield': '🛡️',
                    'heal': '💗',
                    'debuff': '☁️'
                }
                
                //build buttons
                const backAttack = new ButtonBuilder()
                    .setCustomId(`backAttack_${playerAxieParts['Back'][0]}`)
                    .setLabel(`${attackEmojis[partDictionary[playerAxieParts['Back'][0]]]} ${playerAxieParts['Back'][0]}`)
                    .setStyle(ButtonStyle.Danger);
            
                const tailAttack = new ButtonBuilder()
                    .setCustomId(`tailAttack_${playerAxieParts['Tail'][0]}`)
                    .setLabel(`${attackEmojis[partDictionary[playerAxieParts['Tail'][0]]]} ${playerAxieParts['Tail'][0]}`)
                    .setStyle(ButtonStyle.Danger);
            
                const hornAttack = new ButtonBuilder()
                    .setCustomId(`hornAttack_${playerAxieParts['Horn'][0]}`)
                    .setLabel(`${attackEmojis[partDictionary[playerAxieParts['Horn'][0]]]} ${playerAxieParts['Horn'][0]}`)
                    .setStyle(ButtonStyle.Danger);
            
                const mouthAttack = new ButtonBuilder()
                    .setCustomId(`mouthAttack_${playerAxieParts['Mouth'][0]}`)
                    .setLabel(`${attackEmojis[partDictionary[playerAxieParts['Mouth'][0]]]} ${playerAxieParts['Mouth'][0]}`)
                    .setStyle(ButtonStyle.Danger);
            
                const treat = new ButtonBuilder()
                    .setCustomId('treat')
                    .setLabel('Give Treat')
                    .setStyle(ButtonStyle.Primary);

                const capture = new ButtonBuilder()
                    .setCustomId('capture')
                    .setLabel('Capture')
                    .setStyle(ButtonStyle.Primary);
            
                const runAway = new ButtonBuilder()
                    .setCustomId('run-away')
                    .setLabel('Run Away')
                    .setStyle(ButtonStyle.Primary);

                //build action row
                row1 = new ActionRowBuilder()
                    .addComponents(mouthAttack, hornAttack);

                //build action row
                row2 = new ActionRowBuilder()
                    .addComponents(tailAttack, backAttack);

                //build action row
                row3 = new ActionRowBuilder()
                    .addComponents(capture, runAway);

                //initial embed message for game visual
                const battleEmbed = new EmbedBuilder()
                    .setTitle(`A Wild Axie Appeared\nYour Turn`)
                    .setColor(0xe5de00)
                    .setFields(
                        { name: 'Your Health', value: `${playerHealthBar}`},
                        { name: '----------------', value: `----------------`},
                        { name: 'Enemy Health', value: `${enemyHealthBar}`},
                        { name: 'Enemy Fear', value: `${enemyFearBar}`},
                    )
                    .setImage('attachment://axie-full-transparent.png')
                    .setThumbnail(`https://axiecdn.axieinfinity.com/axies/${randomPlayerAxie}/axie/axie-full-transparent.png`)
                    .setFooter({text:'⚔️ Choose an Action ⚔️'})

                if (!gameOver) {
                    const interactionReply = await interaction.editReply({ embeds: [battleEmbed], 
                                                                    files: [enemyAxieImg],
                                                                    components: [row1,row2,row3]});
                
                    //console.log(interactionReply)
                    processBattleRound(playerHealth, playerAxieParts, enemyHealth, enemyFear, enemyAxieParts, enemyAxieImg,  interaction, interactionReply)
                
                }
            })
        
        }
        else{
            interaction.editReply('admin only')
        }
        
		
	}
};
