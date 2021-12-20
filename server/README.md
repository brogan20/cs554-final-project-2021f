# Basic server commands

To start the server run ```npm start```

Before hand you may want to run ```npm run populate``` in order to populate the database with most pokemons popularity (I had to find this on some jank japanese site with no english translation, so you better use it)

You can also run ```npm run cleanup``` to wipe the current database (WIP for some reason not currently working, idk) for debugging purposes

It is also importatnt to note that while the server is running, it will be looking for finished battles every so often. It looks to see what battles are finished 
and if they have paid out yet or not. If they are finished and have already paid out, then they will be deleted from our database. So if you see battles are leaving 
the database, this is why.

Also if you would like to make some database stuff with our online vultur version of the website, try this website https://studio.apollographql.com/sandbox/explorer/
with the api https://pokeapi.myriaco.re/, specifically commands wipeEntireDatabase (take a wild guess what this does) and populatePokemonData (which does similar thing to 
populate)