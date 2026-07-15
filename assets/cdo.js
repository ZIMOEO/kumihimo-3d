function rememberPatternChanged() {
	if (document.getElementById("rememberPattern").checked) {
		setCookies = true;
		writeCookie(stateName, state, 60);
	}
	else {
		setCookies = false;
		deleteCookie(stateName);
	}
}

function rememberPatternChangedMP() {
	if (document.getElementById("rememberPattern").checked) {
		setCookies = true;
		writeCookie(stateName, state, 60);
		writeCookie('braid', stateName, 60);
	}
	else {
		setCookies = false;
		deleteCookie(stateName);
		deleteCookie('braid');
	}
}

function deleteCookie(key) {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() - 1);
	document.cookie = key + "=;expires=" + expiry.toUTCString();
}

function writeCookie(key, value, days) {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + days);
	document.cookie = key + "=" + value + ";expires=" + expiry.toUTCString();
}

function stateChangeHandler(newState) {
	state=newState;
	if (setCookies) { writeCookie(stateName, state, 60);}
	// want to find sendPattern id, and update all links inside this id
	
	var submitPhoto = document.getElementById("submitPhoto");
	if (submitPhoto != null) {
		var links = submitPhoto.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			links[i].href = "/add-design-to-gallery/?cdo_a=" + stateName + "&cdo_s=" + state;
		}
	}

	var getLink = document.getElementById("getLink");
	if (getLink != null) {
		var links = getLink.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			links[i].href = document.URL.split('?')[0] + "?cdo_a=" + stateName + "&cdo_s=" + state;
		}
	}
	var getLink = document.getElementById("jsmpLink");
	if (getLink != null) {
		var links = getLink.getElementsByTagName("a");
		if (stateName.indexOf("jsmp")==0) {
			altStateName = stateName.slice(2);
			altstate = ("00"+(parseInt(state.slice(5,7),16)+1).toString(16)).slice(-2) + state.slice(7) + 'ffffff';
		} else if (stateName.indexOf("mp")==0) {
			altStateName = "js"+stateName;
			altstate = '00101' + ("00"+(parseInt(state.slice(0,2),16)-1).toString(16)).slice(-2) + state.slice(2,-6);
		}
		for (var i = 0; i < links.length; i++) {
			links[i].href = document.URL.split('?')[0] + "?cdo_a=" + altStateName + "&cdo_s=" + altstate;
		}
	}
	var getLink = document.getElementById("jsmpLink2");
	if (getLink != null) {
		var links = getLink.getElementsByTagName("a");
		var altstate = "";
		var altstateName = "";
		if (stateName.indexOf("jsmp")==0) {
			altStateName = stateName.slice(2);
			altstate = ("00"+(parseInt(state.slice(5,7),16)+1).toString(16)).slice(-2) + state.slice(7) + 'ffffff';
		} else if (stateName.indexOf("mp")==0) {
			altStateName = "js"+stateName;
			altstate = '00101' + ("00"+(parseInt(state.slice(0,2),16)-1).toString(16)).slice(-2) + state.slice(2,-6);
		}
		for (var i = 0; i < links.length; i++) {
			links[i].href = document.URL.split('?')[0] + "?cdo_a=" + altStateName + "&cdo_s=" + altstate;
		}
	}
}

function heightChangeHandler(height) {
	document.getElementById("applet").height = height;
}

function patternChangeHandler(patternID) {
	if (setCookies) { writeCookie("mp_patt", patternID, 60);}
	
	// Hide all pattern instructions, and display current one
	var patterns = document.getElementById("mp_pattDescr").getElementsByTagName("div"); // check - may need to split into more vars
	for (var i = 0; i < patterns.length; i++) {
		patterns[i].style.display="none";
	}
	document.getElementById("mp_"+patternID).style.display="block";
}

function setPatternLinks(locn) {
	if (hiddenCookie) $("#hiddenCookie").append("<p>Were you expecting your own saved design? <a href='/" + locn + "/?a='" + stateName + "'>Find it here.</a></p>");
	$("#submitPhoto").append("<a href='/add-design-to-gallery/?cdo_a=" + stateName + "&cdo_s=" + state + "'><img src='/i/photo.png' width='20' height='20' /></a><a href='/add-design-to-gallery/?cdo_a=" + stateName + "&cdo_s=" + state + "'>Send us your design</a> with or without a photo of your finished braid.");
	$("#getLink").append("<a href='/'" + locn + "/?a=" + stateName + "&amp;s=" + state + "'><img src='/i/link.png' width='20' height='20' /></a><a href='/" + locn + "/?a=" + stateName + "&amp;s=" + state + "'>Link to your design</a> - share your pattern with your friends");
	$("#allowCookies").append("<input type='checkbox' onClick='rememberPatternChanged();' id='rememberPattern'" + cookieString + " />Remember pattern (requires cookies)");
}

function loadLHGallery() {
	var height = $('#content').innerHeight();
	var lhcolumn = $('#lhcolumn');
	var headerSet = false;
	while (height > 0 && photoArray.length > 0) {
		var index = Math.floor(Math.random()*photoArray.length);
		var nxtPhoto = photoArray.splice(index,1);
		if (nxtPhoto[0].thWidth > nxtPhoto[0].thHeight) {
			if (nxtPhoto[0].thWidth > 150) {
				nxtPhoto[0].thHeight = 	nxtPhoto[0].thHeight * (150 / nxtPhoto[0].thWidth);
				nxtPhoto[0].thWidth = 150 
			}
		} else {
			if (nxtPhoto[0].thHeight > 150) {
				nxtPhoto[0].thWidth = 	nxtPhoto[0].thWidth * (150 / nxtPhoto[0].thHeight);
				nxtPhoto[0].thHeight = 150 
			}
		}
		if (nxtPhoto[0].thHeight + lhcolumn.innerHeight() > height) {
			continue;
		}
		if (!headerSet) {
			$('#lhcolumn h3').append('From Our Gallery');
			headerSet = true;
		}
		var imgTag = $('<img src="/gallery.old/thumb/' + nxtPhoto[0].file + '" width="' + nxtPhoto[0].thWidth + '" height="' + nxtPhoto[0].thHeight + '" />');
		var patternText = "";
		
		//imgTag.appendTo(lhcolumn).slimbox('/gallery/large/' + nxtPhoto[0].file);
		$('<a href="/gallery.old/large/' + nxtPhoto[0].file + '" rel="lightbox" title="' + nxtPhoto[0].descr + '"></a>').append(imgTag).add('').appendTo(lhcolumn).slimbox();
	}
}

function mpiconToggle(clicked) {
	if (clicked.firstChild.src.indexOf("plus") == -1) {
		clicked.firstChild.src = clicked.firstChild.src.replace("minus", "plus");
		sibling = clicked.nextSibling;
		while (sibling) {
			$(sibling).toggle();
			sibling = sibling.nextSibling;
		}
	} else {
		clicked.firstChild.src = clicked.firstChild.src.replace("plus", "minus");
		sibling = clicked.nextSibling;
		while (sibling) {
			//sibling.style.display = "inherit";
			$(sibling).toggle();
			sibling = sibling.nextSibling;
		}
	}
}

function mpiconsCollapse() {
	$(".expansion").append('<img src="/i/plus15.png" width="15" height="15" title="Click to toggle" />').click(function(){mpiconToggle(this);}).siblings(".child").toggle();
}