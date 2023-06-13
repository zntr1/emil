// global definition
var maxWidth = 960;
var maxHeight = 558;
var stepSizeMove = -8;
var stepSizeResize = 8;
var aspectRatio = 0;
var moveRatio = 0;

// html element naming
var burnsContainerName = "burnsContainer";
var burnsImageName = "burnsImage";
// min & max magnification
var minMagnification = 200;
var maxMagnification = 400;
// animation-time in seconds
var time = 2;
// frames per second
var fps = 25;
// the buffer holds the kenburnsstuff
var buffer = 0;
// just a globalvariable
var stop = false;
// holds the images (array)
var imageList;
// the current image index (-->array)
var currentImageIndex = 0;

// backward compatibility
function fadein(id, startlevel, endlevel, millisec) {
    fade(id, millisec, startlevel, endlevel);
}

function fadeinRandom(id, images, startlevel, endlevel, millisec) {
	setOpacity(id, "0");
	var image = images[getRandom(0, images.length - 1)];
	image = image.substring(0, image.indexOf(";"));
	
	var sizes = images[0];
	var x = sizes.substring(sizes.indexOf(";") + 1, sizes.lastIndexOf(";"));
	var y = sizes.substring(sizes.lastIndexOf(";") + 1);
	
	var img = document.getElementById(id);

	img.src = image;
	img.width = x;
	img.height = y;
	
	fade(id, millisec, startlevel, endlevel);
}

function redirect(url) {
	window.location.href = url;
}

// returns a random number
function getRandom(min, max) {
	if (min > max) {
		return 1;
	}
	if ( min == max ) {
		return min;
	}
	var res = (min + parseInt(Math.random() * (max-min + 1)));
	return res;
}

// fades a given element-id
function fade(id, time, start, end) {
    var speed = Math.round(time / 100);
    var frame = 0;

    if (start > end) { 
        for (i = start; i >= end; i--) {
            setTimeout("setOpacity('" + id + "', " + i + ")", (frame * speed)); 
            frame++; 
        } 
    } else if (start < end) { 
        for (i = start; i <= end; i++) {
            setTimeout("setOpacity('" + id + "', " + i + ")", (frame * speed)); 
            frame++; 
        } 
    } 
}

// set the opacity for a given element-id
function setOpacity(id, opacity) {
	var obj = document.getElementById(id)
	if (obj) {
		obj.style.filter = "alpha(opacity=" + opacity + ")"; 
		obj.style.opacity = (opacity / 100); 
		obj.style.MozOpacity = (opacity / 100); 
		obj.style.KhtmlOpacity = (opacity / 100); 
	}
}

// returns the size of the browser window [x, y]
function getSizeXY() {
	var width = 0, height = 0;
	if (typeof(window.innerWidth) == 'number') {
		width = window.innerWidth;
		height = window.innerHeight;
	} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		width = document.documentElement.clientWidth;
		height = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		width = document.body.clientWidth;
		height = document.body.clientHeight;
	}
	return [width, height];
}

// returns the scolloffset of the browser window [x, y]
function getScrollXY() {
	var scrollX = 0, scrollY = 0;
	if (typeof(window.pageYOffset) == 'number') {
		scrollX = window.pageXOffset;
		scrollY = window.pageYOffset;
	} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
		scrollX = document.body.scrollLeft;
		scrollY = document.body.scrollTop;
	} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
		scrollX = document.documentElement.scrollLeft;
		scrollY = document.documentElement.scrollTop;
	}
	return [scrollX, scrollY];
}

// retuns the position of a given element
function getPosition(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}

// resizes the fade-layer to 100%
function updateSize() {
	var obj = document.getElementById("fade");
	if (obj) {
		obj.style.width = (getSizeXY()[0] + getScrollXY()[0]) + "px";
		obj.style.height = (getSizeXY()[1] + getScrollXY()[1]) + "px";
	}
}

// moves an element given by id
function moveAndResize(id) {
	var obj = document.getElementById(id);
	if (obj) {
		var tmp = getPosition(obj);
		var currentX = tmp[0];
		var currentY = tmp[1];
		var currentW = obj.width;
		var currentH = obj.height;
		
		if (moveRatio == 0) {
			moveRatio = currentX / currentY;
		}
		
		if (aspectRatio == 0) {
			aspectRatio = currentW / currentH;
		}
		
		
		var needToMove = true;
		var needToResize = true;
		
		var newX = currentX + stepSizeMove;
		var newY = newX / moveRatio;

		if (newX < 20) {
			newX = 20;
			//needToMove = false;
		}
		if (newY < 20) {
			newY = 20;
			//needToMove = false;
		}
		
		if (newX == 20 && newY == 20) {
			needToMove = false;
		}

		var newW = currentW + stepSizeResize;
		var newH = newW / aspectRatio;
		
		if (newW > maxWidth) {
			newW = maxWidth;
			newH = maxWidth / aspectRatio;
			needToResize = false;
		}
		if (newH > maxHeight) {
			newH = maxHeight;
			newW = maxHeight * aspectRatio;
			
			needToResize = false;
		}

		obj.style.left = newX + "px";
		obj.style.top = newY + "px";
		
		obj.style.width = newW + "px";
		obj.style.height = newH + "px";
		
		if (needToMove || needToResize) {
			setTimeout("moveAndResize('zoomImage')", 50);
		} else {
			aspectRatio = 0;
			moveRatio = 0;
		}
	}
}

// moves an element given by id
function moveAndResizeRight(id) {
	var obj = document.getElementById(id);
	if (obj) {
		var tmp = getPosition(obj);
		var currentX = tmp[0];
		var currentY = tmp[1];
		var currentW = obj.width;
		var currentH = obj.height;
		
		if (moveRatio == 0) {
			moveRatio = currentX / currentY;
		}

		if (aspectRatio == 0) {
			aspectRatio = currentW / currentH;
		}
		
		var needToMove = true;
		var needToResize = true;
		
		var newW = currentW + stepSizeResize;
		var newH = newW / aspectRatio;
		
		if (newW > maxWidth) {
			newW = maxWidth;
			needToResize = false;
		}
		if (newH > maxHeight) {
			newH = maxHeight;
			needToResize = false;
		}
		
		var newX = currentX + stepSizeMove;
		var newY = newX / moveRatio;

		if (newX > maxWidth) {
			newX = maxWidth;
			needToMove = false;
		}
		if (newY < 20) {
			newY = 20;
			needToMove = false;
		}
		
		var rX = newX + newW;
		var rY = newY + newH;
		
		if (rX > maxWidth) {
			rX += stepSizeMove;
		}
		
		if (rX < newW) {
			rX = newW;
		}
		
		if (needToResize) {
			obj.style.width = newW + "px";
			obj.style.height = newH + "px";
			obj.style.left = (rX - newW) + "px";
			obj.style.top = newY + "px";
		} else {
			newY = currentY + stepSizeMove;
			if (newY < 20) {
				newY = 20;
				needToMove = false;
			}
			obj.style.top = newY + "px";
		}

		if (needToMove || needToResize) {
			setTimeout("moveAndResizeRight('zoomImage')", 50);
		} else {
			aspectRatio = 0;
			moveRatio = 0;
		}
	}
}

// fades the fade-layer in smoothly, copies the given picture by id, and calls the zoom and resize function
function zoomPicture(id) {
	// update the fade-div manually
	updateSize();
	
	// get the div
	var obj = document.getElementById("fade");
	if (obj) {
		obj.style.display = "block";
	}
	setOpacity("fade", 0);
	
	// date it
	fade("fade", 1000, 0, 100);
	
	// get the image
	var image = document.getElementById(id);
	if (image) {
		// calculate position
		var offsetLeft = getPosition(image)[0];
		var offsetTop = getPosition(image)[1];
		
		// copy image
		copyImage(id);
		var newImage = document.getElementById("zoomImage");
		
		// set position
		newImage.style.position = "absolute";
		newImage.style.left = offsetLeft + "px";
		newImage.style.top = offsetTop + "px";
		
		var width = newImage.width;
		var height = newImage.height;
		
		var rX = width + offsetLeft;
		var rY = height + offsetTop;
		
		var moveToRight = (maxWidth - rX < 100);
		
		// start the animation
		//if (!moveToRight) {
			setTimeout("moveAndResize('zoomImage')", 1000);
		//} else {
		//	setTimeout("moveAndResizeRight('zoomImage')", 1000);
		//}
	}
}

// copies an image given by id
function copyImage(id) {
	var image = document.getElementById(id);
	var root = document.getElementById("fade");
	var newImage = document.createElement("img");
	if (image && root && newImage) {
		newImage.setAttribute("id", "zoomImage");
		newImage.setAttribute("onclick", "hideAll()");
		//newImage.setAttribute("onClick", "hideAll()");
		newImage.onclick = hideAll;
		newImage.src = image.src;
		newImage.style.width = image.style.width;
		newImage.style.height = image.style.height;
		newImage.width = image.width;
		newImage.height = image.height;
		root.appendChild(newImage);
	}
}

// hides the fade/zoom elements
function hideAll() {
	fade("fade", 1000, 100, 0, cleanUp);
	setTimeout("cleanUp()", 1000);
}

// cleanup everytrhing
function cleanUp() {
	var fade = document.getElementById("fade");
	if (fade) {
		fade.style.display = "none";
		fade.removeChild(document.getElementById("zoomImage"));
	}
}

// check the keys, if esc was pressed, call hideAll
function checkKeys(e) {
	if (!e) {
		e = window.event;
	}
	if (e.keyCode) {
		e = e.keyCode;
	}
	if (e == 27) {
		hideAll();
	}
}

// initializes the ken burns effect and returns the object
function makeBurns(contW, contH, imgW, imgH, image) {
	var burns = {
		img: 0,
		aspectratio: 0,
		startX: 0,
		startY: 0,
		startW: 0,
		startH: 0,
		moveX: 0,
		moveY: 0,
		resizeW: 0,
		resizeH: 0,
		currentX: 0,
		currentY: 0,
		currentW: 0,
		currentH: 0,
		containerW: 0,
		containerH: 0,
		maxFrames: 0,
		originalW: 0,
		originalH: 0,
		animate: function(frame) {
			if (frame > burns.maxFrames) {
				return;
			}

			// animate
			var oldW = this.currentW;
			var oldH = this.currentH;
			this.currentX = this.currentX + this.moveX;
			this.currentY = this.currentY + this.moveY;
			this.currentW = this.currentW - this.resizeW;
			this.currentH = this.currentH - this.resizeH;

			if (this.currentW < this.containerW || this.currentH < this.containerH) {
				this.currentW = oldW;
				this.currentH = oldH;
			}

			// last frame? safly change the animated values to the final state
			var lastFrame = this.maxFrames - 1;
			if (frame == lastFrame) {
				this.currentX = 0;
				this.currentY = 0;
				//this.currentW = this.containerW;
				//this.currentH = this.containerH;
			}

			// set image stuff
			this.img.style.marginLeft = this.currentX + "px";
			this.img.style.marginTop = this.currentY + "px";
			this.img.width = this.currentW;
			this.img.height = this.currentH;
		}
	};
	
	// store the image
	burns.img = image;
	// calculate the aspectratio
	burns.containerW = contW;
	burns.containerH = contH;
	burns.originalW = imgW;
	burns.originalH = imgH;
	burns.aspectratio = burns.originalW / burns.originalH

	// calculate start-point and -size
	burns.startW = burns.currentW = (contW * getRandom(minMagnification, maxMagnification)) / 100;
	burns.startH = burns.currentH = burns.startW / burns.aspectratio;
	burns.startX = burns.currentX = getRandom(-(getRandom(0, contW / 2) + burns.startW * 0.8 - contW + 1), 0) - 1;
	burns.startY = burns.currentY = getRandom(-(getRandom(0, contH / 2) + burns.startH * 0.8 - contH + 1), 0) - 1;

	// calculate resize and movement per frame
	burns.maxFrames = time * fps;
	burns.moveX = (0 - burns.startX) / burns.maxFrames;
	burns.moveY = (0 - burns.startY) / burns.maxFrames;
	burns.resizeW = (burns.startW - contW - 1) / burns.maxFrames;
	burns.resizeH = burns.resizeW / burns.aspectratio;

	return burns;
}

// creates and starts the a new ken burns effect on the given image
function burnsStart() {
	var cont = document.getElementById(burnsContainerName);
	var img = document.getElementById(burnsImageName);
	var imgstring = imageList[getRandom(0, imageList.length - 1)];
	
	var src = imgstring.substring(0, imgstring.indexOf(";"));
	var imagesize = imgstring.substring(imgstring.indexOf(";") + 1, imgstring.length);
	var x = imagesize.substring(0, imagesize.indexOf(";"));
	var y = imagesize.substring(imagesize.indexOf(";") + 1, imagesize.length);

	img.src = src;
	img.setAttribute("src", src);
	
	buffer = makeBurns(x, y, x, y, img);	
	
	var msPerFrame = 1000 / fps;
	for (i = 0; i < (time * fps); i++) {
		setTimeout("burnsAnimate(" + i + ")", i * msPerFrame);
	}
}

// animates the ken burns effect
function burnsAnimate(i) {
	if (buffer) {
		buffer.animate(i);
	}
}


// sets the image list and starts the effect
function burnsInit(images) {
	imageList = images;
	burnsStart();
}

// gallery variables
var imageList;
var containerID = "galContainer";
var imageID = "galImage";
var headlineID = "galHeadline";
var sublineID = "galSubline";
var linkIDPre = "link";
var galWidth = 0;
var galHeight = 0;

// changes the image
function galChangeImage(index) {
	var image = document.getElementById(imageID);
	var data = imageList[index].split(";");

	image.src = data[0];
	image.width = galWidth + "px";
	image.height = galHeight + "px";
	image.title = data[2];
	image.style.width = galWidth + "px";
	image.style.height = galHeight + "px";
	
	if (data[1] != null && data[1] != "") {
		document.getElementById(headlineID).innerHTML = data[1];
	}
	//document.getElementById(sublineID).innerHTML = data[2];

	for(i=0;i<=20;i++) {
		if(document.getElementById(linkIDPre + i)) {
			if (i == index) document.getElementById(linkIDPre + i).style.color = "#000000";
			else document.getElementById(linkIDPre + i).style.color = "";
		} else break;
	}
}

// init the gallery
function galInit(images, w, h) {
	imageList = images;
	galWidth = w;
	galHeight = h;
	
	var container = document.getElementById(containerID);
	container.style.width = w;
	container.style.height = h;

	galChangeImage(0);
}

// assign the listeners
window.onresize = updateSize;
document.onkeyup = checkKeys;

