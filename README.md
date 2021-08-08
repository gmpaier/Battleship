# Battleship

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Table of Contents

[Description](#description) 

[Installation](#installation) 

[Site Overview](#site-overview) 

[Technical Notes](#technical-notes)

[Contributors](#contributors)
 
[Questions](#questions)

## Description

A web application which allows users to play the classic boardgame *Battleship* online. Create an account and play with other users at your leisure in untimed matches. Take turns firing at the opponents board and attempt to hit their ships. If you make a successful hit, you can take another shot. If all squares of a ship are hit, it is sunk. The first user to sink all the opponent's ships wins! Contrary to traditional rules, ships can be placed directly adjecently to one another. 

## Installation

[Battleship Deployment](https://sleepy-beach-35058.herokuapp.com/)

There is no need to install this application, simply follow the deployed link above to begin!

## Site Overview

When you first visit the site, you'll be prompted to either make an account or log in. Signing in will take you to the main page - here you can start a new game, join an existing game with an open slot, view your active games, or view your overall record. Upon starting or joining a new game, ships will be placed randomly on the board; hitting reset ships will place them in new random locations. Once the user is happy with the location of their ships, they can hit start game to confirm the placement. Once both users have hit start game, the game will begin. When it is your turn, simply click on a square of the opponents board (right-hand side) to take a shot. Hits are represented with *O* and misses with *X*.  

![screenshot of game set up](/battleship_screenshot.png)

## Technical Notes

This application, despite being a two player game, does not utilize a true connection between users. Instead, gameplay is processed by reading and writing to a central SQL server. When it is a user's turn, the application recieves all their player data and information about all shots fired. Users are unable to simply check the page source and see where the opponent's ships are. When a shot is taken, the application makes a POST request to the database. If the shot is a hit, the server responds with the where the hit was and prompts the user to take another shot; if the shot is a miss, the server responds that the shot missed and the user is placed on standby. While it is the opponents turn, the user's application will make a GET request every few seconds to the server, checking to see if it is their turn and updating the board with any shots the opponent made.

This process is quite inefficient! The large number of database queries combined with the limited server capacity results in an unstable deployment. The reasoning behind this methodology is simply limited knowledge at the time of creation; we wanted to make a multi-player application without any prior experience connecting users. Future development of this app will overhaul the process by using [Socket-io](https://www.npmjs.com/package/socket.io) in order to connect opponents, which should result in a much more stable experience.

## Contributors
This project was developed by [Griffin Paier](https://github.com/gmpaier), [Priyanka Kamble](https://github.com/pkamble35), and [Donald Gehring](https://github.com/dgehring7).

## Questions
Any questions regarding this application can be directed to [Griffin Paier](mailto:gmpaier@loyola.edu). Please note that this application is in the process of being remade and likely will not be updated in this repository. Check out the update process at [Battleship-IO](https://github.com/gmpaier/battleship-io).