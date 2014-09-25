/* 

A rewrite of  chronos

Key Features and Functions



*/


// **********  CONFIGURATION   *******************************************************

// define user configurable variables

// **********  DATABASE   *******************************************************

// populate database


// **********  MAIN FUNCTIONS  *******************************************************

//initialize chronos
//generate character journal CHRONOS-config
//generate macros/abilities as token actions for character
//generate page CHRONOS-page
// ? format page with fun stuff, such as current date and time or other data?
//create token CHRONOS-control on page
//associate token with journal entry
// ? prompt for current time to set?

//add event

//increment time

//diplay time

//display events (with modal to determine type)

//set condition

//remove condition (with modal to determine type)

//display conditions




// **********  EVENT LISTENERS  *******************************************************

// end of round
// x time passed


// **********  UTILITY FUNCTIONS   *******************************************************

//modal/prompt
//accept parameters: array of options in string format
//generates a popup to enter parameters for a chosen function. displays options, requests entry.
//   ROLL20 API cannot send macros to chat, explicity stated in wiki https://wiki.roll20.net/API:Chat Chat Functions
//   will require use of Character Abilities.
//   creates new character ability in CHRONOS with array of strings, numbered, one entry per line from array with ? to prompt for user input (pick number)
//   runs new ability
//   deletes ability
//returns string user entered or 0 for nothing entered.

//validate CHRONOS: journal, abilities, token, page exist
//set marker
//remove marker
//set light
//remove light
//set aura
//remove aura
//set tint
//remove tint
//write text on page background
//print to CHRONOS journal entry

