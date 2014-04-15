/*  Chronos Timekeeper: Calendar and Timekeeper Script for roll20.net
	
	!chronos                        returns elapsed time so far (needs updating)
	!chronos #y,#m,#d,#h,#n         adds a number of years, months, days, hours, minutes (n) to clock. 
	!chronos #y,#m,#d,#h,#n -xyz    parameters (not implemented yet)
	
*/
/*
healingData objects: 
healingData[0][0]: minimum hours of rest for healing
healingData[0][1]: hp for minimum rest
healingData[0][2]: attributes points for minimum rest
healingData[1][0]: hours required for full rest
healingData[1][1]: hp healed for full rest
healingData[1][2]: attribute points for full tended rest
*/
/* 
on('ready', function() { 
 
	state.chronosid = findObjs({_type: "character", name: "Chronos"})[0].get("_id");

});
*/
/* 
    ====================================
	Roll20 Character Sheet Money Counter
	====================================
	!earn coin1, coin2, ...
	!spend coin1, coin2, ...
	!purse
	
	Set of commands to add and remove coins from characters. 
	
	
*/
/*
	=============================================
	Roll20 Quick HP Assignment for Monster Tokens
	=============================================
	!HP hitDiceExpression
	
	Command to generate a hit point total for selected tokens, based on a hitDiceExpression
	in the form of 1d8+0, 2d12+5, etc., and assign it to the current/max values of 
	each token's bar 1. 

	I've set up all monster tokens to have the hitDiceExpression in an attribute named 
	"Hit Dice" and a macro: "!HP @{selected|Hit Dice}".
	
*/


on("ready", function() {
    if (!state.chronos) {
        state.chronos = {}; 
    } else {
    };
    // remove "if" to redefine state.dcc.sheetAttributeArray, if necessary
    if (!state.chronos.years) {state.chronos.years = 0;};
    if (!state.chronos.months) {state.chronos.months = 1;};
    if (!state.chronos.days) {state.chronos.days = 1;};
    if (!state.chronos.hours) {state.chronos.hours = 0;};
    if (!state.chronos.minutes) {state.chronos.minutes = 0;};
    if (!state.chronos.weekday) {state.chronos.weekday = 0;};
});

var month = [['January',31],['February',28],["March",31],['April',30],['May',31],['June',30],['July',31],['August',31],['September',30],['October',31],['November',30],['December',31]];
var lengthOfYear = lengthOfYear();
var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var weekday = 0;
 
var attributesToHeal = ['HP','Strength','Agility','Stamina','Personality','Intelligence'];


var healingData = [[8,1,1],[1,2,2]];

function lengthOfYear() {
    n = 0;
    for (i = 0; i < month.length; i++) {
        if (month[i][2] == undefined) {
            n = parseInt(n) + parseInt(month[i][1]);
        };
    };
    return n;
};


function updateChronos(years,months,days,hours,minutes) {
    if (minutes != 0) {
        var chronosMinuteMax = 60; // hard-coding this for now
        if (state.chronos.minutes + parseInt(minutes) >= parseInt(chronosMinuteMax)) {
            hours = parseInt(hours) + Math.floor((state.chronos.minutes + parseInt(minutes)) / chronosMinuteMax);
            state.chronos.minutes = Math.floor((state.chronos.minutes + parseInt(minutes)) % chronosMinuteMax);
        } else {
            state.chronos.minutes = parseInt(state.chronos.minutes) + parseInt(minutes)
        };
    };
    if (hours != 0) {
        var chronosHourMax = 24; // hard-coding this for now, under new state setup
        if (state.chronos.hours + parseInt(hours) >= parseInt(chronosHourMax)) {
            days = parseInt(days) + Math.floor((state.chronos.hours + parseInt(hours)) / chronosHourMax);
            state.chronos.hours = Math.floor((state.chronos.hours + parseInt(hours)) % chronosHourMax);
        } else {
            state.chronos.hours = parseInt(state.chronos.hours) + parseInt(hours)
        };
    };
	if (days != 0) {
        // this currently won't work if you add enough days to move the timer forward more than one month
        var chronosDayMax = month[state.chronos.months -1][1];
        if (state.chronos.days + parseInt(days) > parseInt(chronosDayMax) && month[state.chronos.months-1][1] != 1) {
            log("here");
            months = parseInt(months) + Math.floor((state.chronos.days + parseInt(days)) / chronosDayMax);
            state.chronos.days = Math.floor((state.chronos.days + parseInt(days)) % chronosDayMax);
        } else if (state.chronos.days + parseInt(days) > parseInt(chronosDayMax) && month[state.chronos.months-1][1] == 1) {
            log("there");
            months = parseInt(months) + 1;
            state.chronos.days = Math.floor((state.chronos.days + parseInt(days)) - 1);
        } else {
            state.chronos.days = parseInt(state.chronos.days) + parseInt(days);
        };
    };
    if (months != 0) {
        var chronosMonthMax = month.length -1;
        if (state.chronos.months + parseInt(months) > parseInt(chronosMonthMax)) {
            years = parseInt(years) + Math.floor((state.chronos.months + parseInt(months)) / chronosMonthMax);
            state.chronos.months = Math.floor((state.chronos.months + parseInt(months)) % chronosMonthMax);
        } else {
            state.chronos.months = parseInt(state.chronos.months) + parseInt(months)
        };
    };
    if (years != 0) {
        state.chronos.years = parseInt(state.chronos.years) + parseInt(years);
    }; 
    n = 0;
    for (i = 0; i < state.chronos.months -1; i++) {
        // get all the days in preceding months
        if (month[i][2] == undefined) {
            n = parseInt(n) + parseInt(month[i][1]);
        };
    };
    state.chronos.weekday = (((lengthOfYear * state.chronos.years) + n + state.chronos.days) % week.length);
    var daySuffix = "th";
    if (state.chronos.days < 4) {
        switch(state.chronos.days) {
            case 1:
                daySuffix = "st";
            break;
            case 2:
                daySuffix = "nd";
            break;
            default:
                daySuffix = "rd";
        };
    };

    var amPm = "am";
    var displayHours = state.chronos.hours;
    
    if (displayHours > 11) {
        amPm = "pm";
        displayHours = displayHours - 11;
    } else if (displayHours = 0) {
        displayHours = 12;
    };
    
    var paddingZero = "";
    
    if (state.chronos.minutes < 10) {
        paddingZero = "0";
    };
    
	sendChat("Chronos","/w gm " + state.chronos.hours + ":" + paddingZero + state.chronos.minutes + amPm);
 
};


function healCharacters(hd,lengthOfRest,typeOfHealing) {
// healCharacters function, called when parameter includes "r" for rest, "b" for bedrest
// lengthOfRest = number of hours or days to rest
// hoursOrDays = h or d
// typeOfHealing = normal, bedrest
    // put all the tokens on the page that represent characters into charactersToHeal[] array
    var charactersToHeal = filterObjs(function(obj) {
        
        if(obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("_represents") != "") return true;
        
        else return false;
        
    });
    // get attributes to heal, any healingData related attributes
    for (i = 0; i < charactersToHeal.length; i++) {
        
        var character = getObj("character", charactersToHeal[i].get("represents"));
        
        var attributes = filterObjs(function(obj){
            
            if (obj.get("_type") == "attribute" && obj.get("_characterid") == character.get("_id") && attributesToHeal.indexOf(obj.get("name")) != -1) return true;
            
            else return false;
            
        });
        
        for (i = 0; i < attributes.length; i++) {
            // now go through all the attributes for this character
            // and update based on the right parameters
            
            // if DCC, then [[8,1,1],[24,2,2]]
            // if BFRPG, then [[6,1,1],[24,2,1]]
            // if 3.5E, then [[8,1,'LVL'],[24,2,'LVL']]
            
            if (typeOfHealing == "normal") {
                
                if (lengthOfRest > 0 && hd == "d") {
                    
                    var amountToHeal = healingData[0][1] * lengthOfRest;
                    
                } else if (lengthOfRest >= healingData[0][0] && hd == "h") {
                    
                    var amountToHeal = healingData[0][1];    
                    
                } else {
                    
                    sendChat("Chronos","/w gm Not enough time for normal rest, aborting.");
                    
                    return; 
                    
                };
                
            } else if (typeOfHealing == "bedrest") {
                
                if (lengthOfRest > 0 && hd == "d") {
                    
                    var amountToHeal = healingData[1][1] * lengthOfRest;
                    
                } else {
                    
                    sendChat("Chronos","/w gm Not enough time for bedrest, aborting.");
                    
                    return; 
                    
                };
            };
            if (parseInt(attributes[i].get("current")) < parseInt(attributes[i].get("max"))) {
                attributes[i].set("current", parseInt(attributes[i].get("current")) + parseInt(amountToHeal));
                if (attributes[i].get("current") > attributes[i].get("max")) {
                    attributes[i].set("current", attributes[i].get("max"));
                };
            };
        };
    };
};
 
 
function updateLights(lightSource,elapsedTime) {
    var lightSourceName = lightSource.get("name");
    var brightRadius = lightSource.get("bar3_max");
    var dimRadius = lightSource.get("bar3_value");
    var burningTimeTotal = lightSource.get("bar1_max");
    var burningTimeRemaining = lightSource.get("bar1_value");
    var trigger_dim = Math.floor(burningTimeTotal * 0.3);
    var trigger_flicker = Math.floor(burningTimeTotal * 0.15);
    var trigger_almostOut = Math.floor(burningTimeTotal * 0.05);
    var newBurningTimeRemaining = burningTimeRemaining - (1.0 * elapsedTime);
    if (burningTimeRemaining == 0 || lightSource.get("bar2_value") == 0) return; // make sure light source is lit & has fuel remaining
    if (newBurningTimeRemaining >= trigger_dim && lightSource.get("light_radius") !== brightRadius) {
        lightSource.set({ light_radius: brightRadius, light_dimradius: dimRadius});
    } else if (newBurningTimeRemaining <= trigger_dim && newBurningTimeRemaining > trigger_flicker && (burningTimeRemaining > trigger_dim || burningTimeRemaining == newBurningTimeRemaining)) {
        sendChat("","/emas " + lightSourceName + " grows dim. ");
        lightSource.set({ light_dimradius: Math.floor(dimRadius * 0.66)});
    } else if (newBurningTimeRemaining <= trigger_flicker && newBurningTimeRemaining > trigger_almostOut && (burningTimeRemaining > trigger_flicker || burningTimeRemaining == newBurningTimeRemaining)) {
    
		sendChat("","/emas " + lightSourceName + " begins to flicker. ");
		
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.75), light_dimradius: Math.floor(dimRadius * 0.5)});
        
	} else if (newBurningTimeRemaining <= trigger_almostOut && newBurningTimeRemaining > 0&& (burningTimeRemaining > trigger_almostOut || burningTimeRemaining == newBurningTimeRemaining)) {
	
		sendChat("","/emas " + lightSourceName + " is about to go out. ");
		
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.5), light_dimradius: 0 });
        
	} else if (newBurningTimeRemaining <= 0) {
	
        newBurningTimeRemaining = 0;
        
		sendChat("","/emas " + lightSourceName + " goes out!");
		
		lightSource.set({
		
			bar2_value: 0,
			
			light_radius: "",
			
			light_dimradius: ""
			
		});
		
	};
	
	lightSource.set({
	
		bar1_value: newBurningTimeRemaining
		
	});
 
};
 
 
function findLights(numRounds) {
 
    var playerVisibleLights = filterObjs(function(obj) {
    
        if(obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("bar2_value") == "1" && obj.get("bar2_max") == "1" && obj.get("light_otherplayers") == true) return true;
        
        else return false;
        
    });
 
	_.each(playerVisibleLights, function(obj) {
	
    	updateLights(obj,numRounds);
    	
	});
	
};
 
 
on("chat:message", function(msg) {
 
	if (msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!chronos") !== -1) {
        
        var years = 0, months = 0, days = 0, hours = 0, minutes = 0;
        
        var n = msg.content.split(" ");
        
        if (n[1] == undefined) { // i.e., just "!chronos"
            
            updateChronos(years,months,days,hours,minutes);
            
            return;
            
        } else if (n[2] == undefined) { // i.e., "!chronos 1d" or "!chronos 1d,4h"
            
            var time = n[1].split(",");
            
            for (i = 0; i < time.length; i++) {
                
                if (time[i].indexOf("y") != -1) { years = time[i].slice(0, time[i].indexOf("y")); };
                
                if (time[i].indexOf("m") != -1) { months = time[i].slice(0, time[i].indexOf("m")); };
                
                if (time[i].indexOf("d") != -1) { days = time[i].slice(0, time[i].indexOf("d")); };
                
                if (time[i].indexOf("h") != -1) { hours = time[i].slice(0, time[i].indexOf("h")); };
                
                if (time[i].indexOf("n") != -1) { minutes = time[i].slice(0, time[i].indexOf("n")); };
                
            };
            
        } else { // i.e., params (only makes sense with values for time, should add some error catching)
            
            var time = n[1].split(",");
            
            var params = n[2].slice(1);
            
            for (i = 0; i < time.length; i++) {
                
                if (time[i].indexOf("y") != -1) { years = time[i].slice(0, time[i].indexOf("y")); };
                
                if (time[i].indexOf("m") != -1) { months = time[i].slice(0, time[i].indexOf("m")); };
                
                if (time[i].indexOf("d") != -1) { days = time[i].slice(0, time[i].indexOf("d")); };
                
                if (time[i].indexOf("h") != -1) { hours = time[i].slice(0, time[i].indexOf("h")); };
                
                if (time[i].indexOf("n") != -1) { minutes = time[i].slice(0, time[i].indexOf("n")); };
                
            };
            
            // kick off torches burning, healing, etc. here
            for (i = 0; i < params.length; i++) {
                
                switch (params[i]) {
                    
                    case "h": // heal, i.e. bedrest for 24+ hours
                        
                        healCharacters("d",days,"bedrest");
                        
                    break;
                    
                    case "r": // rest, i.e. sleep for 8+ hours
                        if (_.contains(params, "h")) {
                            
                            sendChat("Chronos","/w gm Cannot use 'h' and 'r' in the same command, using 'h'.");
                            
                        } else {
                            
                            if (days > 0) {
                                
                                healCharacters("d",days,"normal");
                                
                            } else {
                                
                                healCharacters("h",hours,"normal");
                                
                            };
                            
                        };
                        
                    break;
                    
                    case "t": // torches, i.e. track light source's fuel
                        
                        findLights(minutes);
                        
                    break;
                    
                };
                
            };
            
        };
        
        updateChronos(years,months,days,hours,minutes);
        
    };
 
});
 
 
on("change:graphic:bar1_value", function(obj) {
 
	if (obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("bar2_max") == "1" && obj.get("light_otherplayers") == true) {
	
		var maxValue = obj.get("bar1_max");
    
	    if (obj.get("bar1_value") > maxValue ) {
            
				obj.set({bar1_value: maxValue});
                
    		};
	
		updateLights(obj,0); 
 
	};
 
});


on("change:graphic:bar2_value", function(obj) {
    
    if (obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("bar2_max") == "1" && obj.get("light_otherplayers") == true) {
        
        if (obj.get("bar2_value") > 0 ) {
            
            if (obj.get("bar1_value") > 0) {
				
				obj.set({bar2_value: 1});
				
			} else {
			
                obj.set({bar2_value: 0})
                
    		};
            
            updateLights(obj,0);
            
        } else if (obj.get("bar2_value") <= 0 ) {
            
            obj.set({bar2_value: 0});
            
    	    obj.set({light_radius: "",light_dimradius: ""});
    	    
        };
        
    };
    
});



function availableCoinCounter(attributeObjArray) {
    var availableCoinArray = [0,0,0,0,0];
	availableCoinArray[0] += parseInt(attributeObjArray[0].get("current"));
    availableCoinArray[1] += parseInt(attributeObjArray[1].get("current"));
    availableCoinArray[2] += parseInt(attributeObjArray[2].get("current"));
    availableCoinArray[3] += parseInt(attributeObjArray[3].get("current"));
    availableCoinArray[4] += parseInt(attributeObjArray[4].get("current"));	
	return availableCoinArray;
};

function moneyCounter(msg,selected,action) {
    if(!selected) {
		sendChat("API", "/w " + msg.who + " Select token and try again.");
		return; 
	}; 
    var coinString = msg.content.split(action)[1];
    coinString = coinString.toLowerCase();
    coinString = coinString.replace(/pp/g,"xp"); 						// temp change 'pp' to 'xp' to facilitate splitting
    var coinStringArray = [];
    var coinArray = [0,0,0,0,0];
    tmp = coinString.split("p");
    coins = tmp.filter(function(n){return n}); 							// clean up empty elements
    for (i = 0; i < coins.length; i++) {
        tmp = coins[i].split(" "); 										// remove spaces
        coins[i] = tmp.join("");
        tmp = coins[i].split(","); 										// remove commas
        coins[i] = tmp.join("");
        if (coins[i].match(/^[0-9]+x/)) { coinArray[0] += parseInt(coins[i].split("x")[0]) } 
        else if (coins[i].match(/^[0-9]+e/)) { coinArray[1] += parseInt(coins[i].split("e")[0]) } 
        else if (coins[i].match(/^[0-9]+g/)) { coinArray[2] += parseInt(coins[i].split("g")[0]) } 
        else if (coins[i].match(/^[0-9]+s/)) { coinArray[3] += parseInt(coins[i].split("s")[0]) } 
        else if (coins[i].match(/^[0-9]+c/)) { coinArray[4] += parseInt(coins[i].split("c")[0]) } 
        else {
            coins[i].replace("x","p"); 									// switch back to 'pp' for error output
            sendChat("Treasurer", "/w " + msg.who + " Could not identify type of coin: " + coins[i] + "p; ignored.");
        };
    };
    return coinArray;
};

function formatTreasurerChatString(character,coinArray,earn) {
    var comma = "off";
    var abbrev = ["pp","ep","gp","sp","cp"];
    var chatString = " <br/>" + character + " has ";
    if (earn === 1) {
        chatString += "earned ";
    } else chatString += "spent ";
    chatString += "<strong>";
    for (i = 0; i < 5; i++) {
        if (coinArray[i] !== 0) {
            if (comma == "on") {
                chatString += ", ";
            };
            chatString += coinArray[i] + abbrev[i];
            comma = "on";
        };
    };
    chatString +=  "</strong>"; 
    return chatString; 
};

function addCoins(characterObj,availableCoinArray,coinArray,attributeObjArray) {
    var character = characterObj.get("name"); 							// grab this for chat /w target 
    character = character.replace(/\s.+/,""); 
	if (coinArray[0] > 0) {attributeObjArray[0].set("current", parseInt(availableCoinArray[0] + coinArray[0]))};
	if (coinArray[1] > 0) {attributeObjArray[1].set("current", parseInt(availableCoinArray[1] + coinArray[1]))};
	if (coinArray[2] > 0) {attributeObjArray[2].set("current", parseInt(availableCoinArray[2] + coinArray[2]))};
	if (coinArray[3] > 0) {attributeObjArray[3].set("current", parseInt(availableCoinArray[3] + coinArray[3]))};
	if (coinArray[4] > 0) {attributeObjArray[4].set("current", parseInt(availableCoinArray[4] + coinArray[4]))};
	for (i = 0; i < coinArray.length; i++) {
        availableCoinArray[i] += coinArray[i]
    };
    chatString = formatTreasurerChatString(character,coinArray,1);
    sendChat("Treasurer","/w " + character + chatString);
	sendChat("Treasurer","/w gm " + chatString);
};

function spendCoins(characterObj,availableCoinArray,coinArray,attributeObjArray) {
    var character = characterObj.get("name"); 							// grab this for chat /w target 
    character = character.replace(/\s.+/,""); 
    var totalAvailable = (availableCoinArray[0]*100) + (availableCoinArray[1]*10) + availableCoinArray[2] + (availableCoinArray[3]*.1) + (availableCoinArray[4]*.01);
    var totalToSpend= (coinArray[0]*100) + (coinArray[1]*10) + coinArray[2] + (coinArray[3]*.1) + (coinArray[4]*.01);
    if (totalToSpend > totalAvailable) {
        sendChat("Treasurer","/w " + character + " You don't have enough: tried to spend " + totalToSpend + "gp but you only have " + totalAvailable + "gp in coins.");
        return; 														// exit if they don't have the cash
    };
    for (i = 0; i < coinArray.length; i++) {
        if (coinArray[i] <= availableCoinArray[i]) { 					// if there are enough coins of current denomination [i], subtract them & move on
            availableCoinArray[i] -= coinArray[i];
        } else { 														// if there aren't enough coins of current denomination [i], start making change
            j = 4; 														// j === current position of change-making loop in availableCoinArray; start at top (lowest denom) and work down
            while (coinArray[i] > availableCoinArray[i]) { 
                var k = j - 1; 											// k === next higher denomination in availableCoinArray (i.e., next lower in array)
                if (j > i) { 											// go through lower denominations and change them up
                    newCoins = parseInt(availableCoinArray[j]/10);
                    remainder = parseInt(availableCoinArray[j]%10);
                    availableCoinArray[j] = remainder;  
                    availableCoinArray[k] += newCoins;
                } else if (j < i) { 									// break higher denominations if needed
                    var higherDenomCoinsNeeded = Math.ceil((coinArray[i] - availableCoinArray[i])/10); // i.e., short 8 = 1 needed, short 18 = 2 needed
                    while (higherDenomCoinsNeeded > 0) {
	                    if (higherDenomCoinsNeeded <= availableCoinArray[j]) { 
	                        availableCoinArray[j] -= higherDenomCoinsNeeded;
	                        availableCoinArray[i] += higherDenomCoinsNeeded*10;
	                        higherDenomCoinsNeeded = 0;
	                    } else { 
	                    	if (parseInt(availableCoinArray[j]) > 0) {
		                        availableCoinArray[i] += parseInt(availableCoinArray[j]*10);
		                        higherDenomCoinsNeeded -= parseInt(availableCoinArray[j]);
		                        availableCoinArray[j] = 0;
	                    	};
							var n = k; 									// array position of higher denoms; decrement with each while loop
							var conversionFactor = 10; 
							while (higherDenomCoinsNeeded > 0) {		// loop until all necessary coins are converted to next higher denom of current coin type
								if (Math.ceil(higherDenomCoinsNeeded/conversionFactor) <= availableCoinArray[n]) {
									evenHigher = Math.ceil(higherDenomCoinsNeeded/conversionFactor);
									availableCoinArray[n] -= evenHigher; 
			                        availableCoinArray[j] += (evenHigher*conversionFactor) - higherDenomCoinsNeeded;
			                        availableCoinArray[i] += higherDenomCoinsNeeded*conversionFactor;
			                        higherDenomCoinsNeeded = 0;
								} else {
			                        availableCoinArray[j] += parseInt(availableCoinArray[n]*conversionFactor);
			                        higherDenomCoinsNeeded -= parseInt(availableCoinArray[n]*conversionFactor);
			                        availableCoinArray[n] = 0;
								};
								conversionFactor *= 10;
								n--; 
							};
	                    	if (coinArray[i] > availableCoinArray[i] && higherDenomCoinsNeeded <= 0) {
		                        availableCoinArray[i] = coinArray[i];
		                    };
	                    };
                    };
                };
                j--;
            };
            availableCoinArray[i] -= coinArray[i];
        };
    };
	if (availableCoinArray[0] > 0) {attributeObjArray[0].set("current", availableCoinArray[0])} else attributeObjArray[0].set("current","0");
	if (availableCoinArray[1] > 0) {attributeObjArray[1].set("current", availableCoinArray[1])} else attributeObjArray[1].set("current","0");
	if (availableCoinArray[2] > 0) {attributeObjArray[2].set("current", availableCoinArray[2])} else attributeObjArray[2].set("current","0");
	if (availableCoinArray[3] > 0) {attributeObjArray[3].set("current", availableCoinArray[3])} else attributeObjArray[3].set("current","0");
	if (availableCoinArray[4] > 0) {attributeObjArray[4].set("current", availableCoinArray[4])} else attributeObjArray[4].set("current","0");

    chatString = formatTreasurerChatString(character,coinArray);
    sendChat("Treasurer","/w " + character + chatString);
    sendChat("Treasurer","/w gm " + chatString);
};

on("chat:message", function(msg) {

    if (msg.type === "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!earn ") !== -1 ) { // only the GM can give out money
        var selected = msg.selected;
        var coinArray = moneyCounter(msg,selected,"!earn ");
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;	
		    var character = characterObj.get("name");
		    character = character.replace(/\s.+/,""); 
			var attributeObjArray = getAttributeObjects(characterObj, ['PP','EP','GP','SP','CP'],character);
            if (attributeObjArray === false) return;
            var availableCoinArray = availableCoinCounter(attributeObjArray);
			addCoins(characterObj,availableCoinArray,coinArray,attributeObjArray)
		});
    };

    if (msg.type === "api" && msg.content.indexOf("!spend ") !== -1 ) { // anyone can spend money, if they have it
        var selected = msg.selected;
        var coinArray = moneyCounter(msg,selected,"!spend ");
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;	
		    var character = characterObj.get("name");
		    character = character.replace(/\s.+/,""); 
			var attributeObjArray = getAttributeObjects(characterObj, ['PP','EP','GP','SP','CP'],character);
			if (attributeObjArray === false) return;
            var availableCoinArray = availableCoinCounter(attributeObjArray);
            spendCoins(characterObj,availableCoinArray,coinArray,attributeObjArray)
		});
    };

    if (msg.type === "api" && msg.content.indexOf("!purse") !== -1 ) { // anyone can check how much money they have
        var selected = msg.selected;
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;	
		    var character = characterObj.get("name");
		    character = character.replace(/\s.+/,""); 
			var attributeObjArray = getAttributeObjects(characterObj, ['PP','EP','GP','SP','CP'],character);
			if (attributeObjArray === false) return;
            var availableCoinArray = availableCoinCounter(attributeObjArray);
            tmp = "/w " + character + " You have " + availableCoinArray[0] + "pp, " + availableCoinArray[1] + "ep, " + availableCoinArray[2] + "gp, " + availableCoinArray[3] + "sp, " + availableCoinArray[4] + "cp.";
			sendChat("Treasurer",tmp);
		});
    };
});

on("chat:message", function(msg) {
    if (msg.type === "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!tracker") !== -1) {
        var n = msg.content.split(" ", 2);
        var tracker = findObjs({
    	    _pageid: Campaign().get("playerpageid"),
		    _type: "graphic",
		    name: "Tracker"
        });
        _.each (tracker, function(obj) {
            if (n[1] === "off") { 
    		    obj.set({bar2_value: 0});
                sendChat("Util","/w gm Tracker token turned " + n[1]);
            } else {
                obj.set({bar2_value: 1});
                sendChat("Util","/w gm Tracker token turned " + n[1]);
            };
        });
    };
});


on("change:graphic", function(obj, prev) { 
    if (obj.get("name") === "Tracker" && obj.get("bar2_value") === 1) {
        var xDif = 0;
        var yDif = 0;
        var unitsMoved = 0;
        if (obj.get("left") != prev["left"] || obj.get("top") != prev["top"]) {
            xDif = Math.abs(obj.get("left")/14 - prev["left"]/14);
            yDif = Math.abs(obj.get("top")/14 - prev["top"]/14);
            xDif = Math.floor(xDif);
            yDif = Math.floor(yDif);
        };
        if (xDif > yDif) {
            unitsMoved = xDif;
        } else {
            unitsMoved = yDif
        };
        var roundsTranspired = Math.floor(unitsMoved/20);
        if (unitsMoved%20 >=10) { roundsTranspired++ };
        if (roundsTranspired > 0) {
    		state.timeElapsed = state.timeElapsed + roundsTranspired;
            getLights(roundsTranspired);
            timeElapsed();
        }
    };
});




function hitPoints(tokenObj,number,faces,bonus) {

    var characterName = tokenObj.get("name");
    
    var hitPoints = parseInt(bonus);
    
    for (var i = 0; i < number; i++) {
        var result = randomInteger(faces);
        hitPoints += result;
	};
	
    tokenObj.set({bar1_value: hitPoints, bar1_max: hitPoints})
		
	//output
	sendChat(characterName, "/w gm " + " has " + hitPoints + " HP.");

};

on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!HP ") !== -1) {
		//parse the input
        var selected = msg.selected;
		var Parameters = msg.content.split("!HP ")[1];
        var d = Parameters.indexOf("d");
        var plus = Parameters.indexOf("+");
        var number = Parameters.slice(0,d)[0];
        var faces = Parameters.slice(d+1,plus);
        var bonus = Parameters.slice(plus+1);
		
		if(!selected) {
			sendChat("", "/w gm Select token and try again.");
			return; //quit if nothing selected
		}; 

        //loop through selected tokens
        
		_.each(selected, function(obj) {
            var tokenObj = getObj("graphic", obj._id);
            hitPoints(tokenObj,number,faces,bonus);
		});
        
    };
});


