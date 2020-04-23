# livinrum

A way to make JSON-based digital image galleries.

[[ EXPLANATION VIDEO ]](https://youtu.be/LxeEeW8aK1I)

## Setup
To clone and run this repository you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:
```
git clone https://github.com/jedpimentel/livinrum.git
cd livinrum
npm install
npm start
```
Alternatively, you can try out a live version here: *[www.livinrum.com](https://www.livinrum.com/)*

### Testing it out

  * Drop a few images onto site and they'll appear in the scene
  * Click "download" to receive a "livin.rum" file with the gallery images
  * Refresh your page, or keep adding images
  * Drop the ".rum" file onto the browser window to restore that scene

### Hosting a default .rum file
  
  * Rename .rum file as "livin.rum" and place in livinrum/default
  * Follow instructions in livinrum/default/README.txt

"LIVINRUM" is a digital arts collective based in the Dominican Republic, consisting of local residents and members of the Dominican diaspora.

Known Bugs:
 * THREE.js/WebGL complains if image pixelage isn't a power of 2 (ex: 512x512, 1024x1024);
 * images are are all rended at a 1:1 image ratio

Upcoming Features:
* Ability to rotate and reposition images
* Custom file names

### License
ISC License (ISC)
Copyright 2020 Jose Pimentel
