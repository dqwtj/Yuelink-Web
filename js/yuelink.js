var _timeout = { adjustPosition : null };
/* ------- BASIC FUNCTIONS ------- */
var _ = {
		key : {
		    BACKSPACE: 8,
		    TAB: 9,
		    ENTER: 13,
		    ESCAPE: 27,	ESC: 27,
		    SPACE: 32,
		    PAGE_UP: 33,
		    PAGE_DOWN: 34,
		    END: 35,
		    HOME: 36,
		    LEFT: 37,
		    UP: 38,
		    RIGHT: 39,
		    DOWN: 40,
		    NUMPAD_ENTER: 108,
		    COMMA: 188,
		    INPUT: 229
		},
		inArray : function (item, arr) {
			for (var i=0; i<arr.length; i++) {
				if (item == arr[i]) {
					return true;
				}
			}
			return false;
		},
		arrIndexOf : function (arr, item) {
			// get index of an object in array or array-like objects
			for (var i=0; i<arr.length; i++) {
				if (arr[i] == item) {
					return i;
				}
			}
			return -1;
		},
		
		cookie : function (key, value, options) {
			/*!
			 * jQuery Cookie Plugin
			 * https://github.com/carhartl/jquery-cookie
			 *
			 * Copyright 2011, Klaus Hartl
			 * Dual licensed under the MIT or GPL Version 2 licenses.
			 * http://www.opensource.org/licenses/mit-license.php
			 * http://www.opensource.org/licenses/GPL-2.0
			 */
	        // key and at least value given, set cookie...
	        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
	            options = $.extend({}, options);

	            if (value === null || value === undefined) {
	                options.expires = -1;
	            }

	            if (typeof options.expires === 'number') {
	                var days = options.expires, t = options.expires = new Date();
	                t.setDate(t.getDate() + days);
	            }

	            value = String(value);

	            return (document.cookie = [
	                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
	                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
	                options.path    ? '; path=' + options.path : '',
	                options.domain  ? '; domain=' + options.domain : '',
	                options.secure  ? '; secure' : ''
	            ].join(''));
	        }

	        // key and possibly options given, get cookie...
	        options = value || {};
	        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

	        var pairs = document.cookie.split('; ');
	        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
	            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
	        }
	        return null;
	    }
} //end of _

/* ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- */
var $console, $player, $wall, $dialog;
var $posters;
var $songInfo, $startMenu, $searchMenu, $fmMenu, $msgMenu, $userMenu;
var $wallWrapper, $nodeInfo;
var $sDetail, $review, $newSong, $activity, $userInfo;
var $register;

//var url_domain = "http://www.yuelink.com/";
var url_domain = "http://localhost:8080/";
var url_prefix = url_domain + "api/";

var d_user, d_node, d_songList;

var settings = {};
var soundManagerReady = false;

function yuelink_initialize () {
	// objects & variables
	$console = $('#console');
	$player = $('#player');
	$posters = $('#posters');
	
	menu.mapping = {
			'songInfo'	: $songInfo = $('#menu #songInfo'),
			'start'		: $startMenu = $('#menu #startMenu'),
			'search'	: $searchMenu = $('#menu #searchMenu'),
			'fm'		: $fmMenu = $('#menu #fmMenu'),
			'msg'		: $msgMenu = $('#menu #msgMenu'),
			'user'		: $userMenu = $('#menu #userMenu')
	};
	
	dialog.mapping = {
			'sDetail'	: $sDetail = $('#dialog #songDetail'),
			'review'	: $review = $('#dialog #review'),
			'newSong'	: $newSong = $('#dialog #newSong'),
			'activity'	: $activity = $('#dialog #activity'),
			'userInfo'	: $userInfo = $('#dialog #userInfo')
	}
	
	$wall = $('#wall');
	$wallWrapper = $('#wall .innerWrapper');
	$nodeInfo = $('#nodeInfo');
	
	
	// settings
	yueConsole.settings = {
			consoleHeight : $console.height(),
	}
	
	soundManager.url = 'js/soundManagerSWF/';
	soundManager.onready(function(){
		soundManagerReady = true;
	});
	
	// events
	$console.click(function () {
//		yueConsole.switchView();
	});
	$('#userBox, #playCtrl').click(function (event) {
		// prevent switch view
		event.stopPropagation();
	});
	
	$('#userBox a').click(function (event) {
		menu.toggle($(this).attr('id'));
	});
	
	$('#playCtrl-button').click(function(){
		player.togglePause();
	});
	$('#playCtrl-bar').click(function(event){
		var pos = (event.pageX - $(this).offset().left) / $(this).width();
		soundManager.setPosition(player.log.current, pos*player.durationEstimate);
	});
	$('#playCtrl-cycle').click(function(){
		player.toggleCycle();
	});
	$('#player #prev').click(function () {
		player.prev();
	});
	$('#player #next').click(function () {
		player.next();
	});
	$('#playCtrl-volume').click(function(event) {
		player.changeVolume(event);
	});
	$('#list').mouseenter(function() {
		$('div', this).toggleClass('list-green list-gray');
	}).mouseleave(function() {
		if (songInfo.isShow) {
			$('div', this).attr('class', 'list-green')
		} else {
			$('div', this).attr('class', 'list-gray')
		}
	});
	$('#star').mouseenter(function() {
		$('div', this).toggleClass('star-blue star-gray');
	}).mouseleave(function() {
		if (songInfo.isShow) {
			$('div', this).attr('class', 'star-blue')
		} else {
			$('div', this).attr('class', 'star-gray')
		}
	});
	$('#list').click(function() {
		songInfo.isManual = true;
		if (!songInfo.isShow || player.isSummary == true){
			songInfo.toggleLyrics();
		}
		if (songInfo.isShow && player.isSummary == false){
			$('div', '#star').attr('class', 'star-gray');
		}
		player.setSummary(songInfo.song.info, true);
	});
	$('#star').click(function() {
		songInfo.isManual = true;
		if (!songInfo.isShow || player.isSummary == false){
			songInfo.toggleLyrics();
		}
		if (songInfo.isShow && player.isSummary == true){
			$('div', '#list').attr('class', 'list-gray');
		}
		player.setSummary(songInfo.song.info, false);
	});
	var playerPosterImgZoom;
	$('#player #posters img').live('contextmenu mousedown', function(event){
		event.preventDefault();
		clearTimeout(playerPosterImgZoom);
		playerPoster.setFitImage($(this));
	});
	$('#player #posters').live('mouseup', function(event){
		clearTimeout(playerPosterImgZoom);
		playerPosterImgZoom = setTimeout(function(){
			playerPoster.setImage($('#player #posters img'));
		}, 3000);
	});
	
	// overall monitor
	$(window).resize(function () {
		// adjust item position
		clearTimeout(_timeout.adjustPosition);
		_timeout.adjustPosition = setTimeout(function () { 
			yueConsole.adjustPosition();
			menu.adjustPosition();
			playerPoster.setImage($('#player #posters img'));
		}, 50);
	});
	
/*
	$('html').bind('keydown.wall', function(e){
		if (!yueConsole.isPlayer && (e.which==_.key.UP || e.which==_.key.DOWN || e.which==_.key.PAGE_UP || e.which==_.key.PAGE_DOWN)) {
			e.preventDefault();
			
			var obj = (_this.dialog.isActive()) ? _this.dialog.getObj() : _this.wall.getObj();
			
			switch (e.which) {
			case 33: //pageUp
				obj.animate({ scrollTop: (obj.scrollTop()-0.8*obj.height()) }, 300);
				break;
			case 34: //pageDown
				obj.animate({ scrollTop: (obj.scrollTop()+0.8*obj.height()) }, 300);
				break;
			case 38: //arrowUp
				obj.animate({ scrollTop: (obj.scrollTop()-50) }, 200);
				break;
			case 40: //arrowDown
				obj.animate({ scrollTop: (obj.scrollTop()+50) }, 200);
				break;
			}
		}
		
		if (_this.dialog.isActive() && e.which==_.key.ESC) {
			_this.dialog.close();
		}
	});
*/	
}

function soundplayeReady(data){;
	$(".channel-title").text(data.name);
	$("#channel-summary").text((data.summary?"频道介绍: " + data.summary:"暂无介绍"));
	if (data.related_songs.length > 0){
		var soundManagerReadyCheck = setInterval(function(){
			if (soundManagerReady) {
				clearInterval(soundManagerReadyCheck);
	
				player.append(data.related_songs);
			}
		}, 50);
	} else {
		alert("No songs exist.");
	}
}
//load songs
function loadsongs(nodeid){
	
	//var apiurl = 'http://www.yuelink.com/api/nodes/' + nodeid +'.json';
	var apiurl = url_prefix + 'nodes/' + nodeid +'.json';

	$.ajax({
		type: 'GET',
		url: apiurl,
		dataType: 'json',
		success:soundplayeReady
		});
}

function songInfoReady(song, obj){
	obj.info = song;
	songInfo.song = obj;
	var roleinfo = "";
	for (var i = 0; i < song.user_roles.length; i++){
		if (song.user_roles[i].name == "演唱"){
			obj.author = song.user_roles[i].node_name;
			$('#playCtrl h2').text(obj.name + " - "+obj.author);

		}
		if (song.user_roles[i].name != ""){
			roleinfo += song.user_roles[i].name + " : " + song.user_roles[i].node_name + "<br>";
		}
	}
	obj.info.roleinfo = roleinfo;
	if (obj.info.lyrics)
		obj.info.lyrics = obj.info.lyrics.replaceAll("\r\n", "<br>");
	else
		obj.info.lyrics = "暂无歌词";
	if (obj.info.summary)
		obj.info.summary = obj.info.summary.replaceAll("\r\n", "<br>");
	else
		obj.info.lyrics = "暂无介绍";
	$('.song-title').text(obj.info.name);
	player.setSummary(obj.info);
	
	//alert($('#playCtrl-button').style.background);
	$('#playCtrl-button').css("background","url("+obj.info.pic_button_url+") 4px 4px no-repeat");
}

function loadSongInfo(songid, songObj){
	var apiurl = url_prefix + 'songs/' + songid +'.json';

	$.ajax({
		type: 'GET',
		url: apiurl,
		dataType: 'json',
		success:function(data){
			songInfoReady(data, songObj);
		}
		});	
}

// isShow 是当前状态，userTrack 是用户手动操作。
var songInfo = {
	isShow: false,
	isManual: false,
	song : new Object(),
	showLyrics: function() {
		if(!this.isShow) {
			$('#showcase').animate({
				top: '+=220'
			},{
				duration: 500, 
				complete: function(){
					if (player.isSummary)
						$('div', "#list").attr('class', 'list-green');
					else
						$('div', "#star").attr('class', 'star-blue');
				}
			});
			this.isShow = !this.isShow;
		}
	},
	hideLyrics: function() {
		if(this.isShow) {
			$('#showcase').animate({
				top: '-=220'
			},{
				duration: 500, 
				complete: function(){
					$('div', "#list").attr('class', 'list-gray');
				}
			});
			this.isShow = !this.isShow;
		}
	},
	toggleLyrics: function() {
		if (this.isShow) {
			this.hideLyrics();
		} else {
			this.showLyrics();
		}
	}
}

var yueConsole = {
		isPlayer : true,
		showPlayer : function () {
			this.isPlayer = true;
			
			$console.css('bottom', 0);
			$player.css('top', 0);
			
			menu.adjustPosition();
			
			return this;
		},
		showWall : function (para) {
			this.isPlayer = false;
			if (para) {
				wall.loadInfo(para);
			}
			$console.css('bottom', this.getTopPos());
			$player.css('top', '-100%');
			
			menu.adjustPosition();
			
			return this;
		},
		
		switchView : function (option, para) {
			var view;
			if (option && typeof(option)=='string') {
				view = (option == 'wall') ? 'wall' : 'player';
			}
			else {
				view = (this.isPlayer) ? 'wall' : 'player';
			}
			
			switch (view) {
				case 'wall' :	this.showWall(para); break;
				case 'player' :
				default:		this.showPlayer(para);
			}
			
			return this;
		},
		
		adjustPosition : function () {
			if (!this.isPlayer) {
				$console.css('bottom', this.getTopPos());
			}
			
			return this;
		},
		
		getTopPos : function () {
			return $(window).height() - this.settings.consoleHeight;
		},
		
		settings : {}
}

var player = {
/* PLAYER : controls playback */ 
		duration : false,
		durationEstimate : false,
		isPaused : true,
		isCycle : false,
		volume: 100,
		isSummary: true,
		
		log : {
			history : new Array(),
			upcoming : new Array(),
			current: null
		},
		rawData : {},
		
		
		setSummary : function(songinfo, isSummary){
			if (isSummary != null) player.isSummary = isSummary;
			if (player.isSummary){
				$('#lyrsum').css("background", "url(images/icons/detail-title.png) no-repeat");
				$('#lyric-sum').html(songinfo.roleinfo + "<br>歌曲介绍:<br>" + songinfo.summary);
			} else {
				$('#lyrsum').css("background", "url(images/icons/lyrics-title.png) no-repeat");
				$('#lyric-sum').html(songinfo.lyrics);
			}
			$('.lscroll').attr('class', 'lscroll');
			$('.lscroll').scrollbars();			
		},
		
		play : function () {
			if (this.log.history.length == 1){
				$('#prev').hide();
			}
			if (this.log.upcoming.length == 1){
				$('#next').hide();
			}
			var avatar = this;
			var timeOfSInfoShow, timeOfSInfoHide;
			
			soundManager.stopAll();
			this.duration = false;
			$('.play').attr('class', 'pause');
			id = this.log.current;
			if (this.rawData[id])
				songInfo.song =this.rawData[id].info;
			if (!this.rawData[id].info) loadSongInfo(id, this.rawData[id]);
			soundManager.play(this.log.current, {
				volume: this.volume,
				whileplaying : function(){
					if (!avatar.durationEstimate) {
						$('#playCtrl-time .duration').text(player.getFormattedTime(this.durationEstimate));
						avatar.durationEstimate = this.durationEstimate;
					}
					if (!avatar.duration) {
						$('#playCtrl-time .duration').text(player.getFormattedTime(this.durationEstimate));
						avatar.duration = this.duration;
					}
					$('#playCtrl-time .position').text(player.getFormattedTime(this.position));
					//alert("d" + this.duration);
					//alert("p" + this.position);
					$('.prog-cover').css('left', 100*this.position/this.durationEstimate + '%');
					$('.prog-white').css('width', 100*this.position/this.durationEstimate + '%');
				},
				whileloading: function() {
					$('.prog-load').css('width', 100*this.bytesLoaded/this.bytesTotal + '%');
					/*if(this.duration < this.durationEstimate) {
						$('#playCtrl-time .duration').text(player.getFormattedTime(this.durationEstimate));
						avatar.durationEstimate = this.durationEstimate;
					}*/
				},
				onfinish : function() {
					if (avatar.isCycle) {
						avatar.play();
					}
					else {
						avatar.next();
					}
				}
			});
			this.isPaused = false;
			$('.volumn-white').css('width', this.volume + '%');
			if (songInfo.isManual) {
				timeOfSInfoShow = setTimeout(function() {
					songInfo.showLyrics();
				}, 5000);
				timeOfSInfoHide = setTimeout(function() {
					songInfo.hideLyrics();
				}, 12000);
			}
			return this;
		},
		pause : function () {
			$('.pause').attr('class', 'play');
			soundManager.pause(this.log.current);
			this.isPaused = true;
			return this;
		},
		togglePause : function () {
			soundManager.togglePause(this.log.current);
			this.isPaused = !this.isPaused;
			$('div', '#playCtrl-button').toggleClass('play pause');
			return this.isPaused;
		},
		toggleCycle : function () {
			this.isCycle = !this.isCycle;
			$('div', '#playCtrl-cycle').toggleClass('uncycle cycle');
			return this.isCycle;
		},
		
		prev : function () {
			if (this.log.history.length>0) {
				$('#next').show();
				var id = this.log.history.pop();
				
				this.log.upcoming.splice(0,0, this.log.current);
				this.log.current = id;
				if ($('div', '#playCtrl-button').attr("class") === 'play') {
					$('div', '#playCtrl-button').attr('class', 'pause');
				};
				songInfo.hideLyrics();
				this.play();
				
				playerPoster.prev();
				$('#playCtrl-thumb').attr('src', this.rawData[id].thumb);
				$('#playCtrl h2').text('').append($('#playCtrl-title-template').render(this.rawData[id]));
			}
			return this;
		},
		next : function (para) {
			if (this.log.upcoming.length>0) {
				$('#prev').show();
				var id = this.log.upcoming.splice(0,1)[0];
				
				this.log.history.push(this.log.current);
				this.log.current = id;
				
				songInfo.hideLyrics();
				this.play();
				
				if (para && para=='null') {
					playerPoster.next('fadeIn');
				}
				else {
					playerPoster.next();
				}
				$('#playCtrl-thumb').attr('src', this.rawData[id].thumb);
				$('#playCtrl h2').text('').append($('#playCtrl-title-template').render(this.rawData[id]));
			} else {
				
			}
			return this;
		},
		
		append : function (options) {
			for (var i=0; i<options.length; i++) {
				//hotfix
				options[i].id = options[i]._id;
				options[i].url = options[i].mp3_url;
				if (options[i].pic_bkg_url != ""){
					options[i].poster = options[i].pic_bkg_url;
				} else {
					options[i].poster = url_domain + "yuelink/images/sample.jpg";
				}
				options[i].title = options[i].name;
				options[i].author = 'Default Singer';
				//hotfix-end
				this.log.upcoming.push(options[i].id);
				soundManager.createSound({
					id : options[i].id,
					url : options[i].url
				});
				this.rawData[options[i].id] = options[i];
			}
			playerPoster.append(options);
			
			if (this.log.current == null) {
				this.next('null');
			}
			return this;
		},
		insert : function (options) {
			for (var i=options.length-1; i>=0; i--) {
				this.log.upcoming.splice(0, 0, options[i].id);
				soundManager.createSound({
					id : options[i].id,
					url : options[i].url
				});
				this.rawData[options[i].id] = options[i];
			}
			playerPoster.insert(options);
			
			if (this.log.current == null) {
				this.next('null');
			}
			return this;
		},
		
		getFormattedTime : function (time) {
			var sec = parseInt(time/1000) % 60;
			var min = parseInt(time/60000);
			return min + ':' + ((sec<10) ? '0'+sec : sec);
		},
		
		changeVolume: function(event) {
			var pos = (event.pageX - $('#playCtrl-volume').offset().left) / $('#playCtrl-volume').width() * 100;
			this.volume = pos;
			$('.volumn-white').css('width', pos + '%')
			soundManager.setVolume(this.log.current, pos);
		}
};

var playCtrlVisual = {
		
}

var playerPoster = {
		log : {
			history : new Array(),
			upcoming : new Array(),
			current : null
		},
		posterMotionLock : false,
		settings : {
			duration : 700,
			fps : 25
		},
		
		prev : function (option) {
			if (this.log.history.length>0) {
				this.log.upcoming.splice(0,0,this.log.current);
				this.log.current = this.log.history.pop();
				
				this.present(this.log.current, (option) ? option : 'slideRight');
			}
			return this;
		},
		next : function (option) {
			if (this.log.upcoming.length>0) {
				if (this.log.current!=null) {
					this.log.history.push(this.log.current);
				}
				this.log.current = this.log.upcoming.splice(0, 1)[0];
				this.present(this.log.current, (option) ? option : 'slideLeft');
			}
			return this;
		},
		
		append : function (options) {
			var avatar = this;
			for (var i=0; i<options.length; i++) {
				this.log.upcoming.push(options[i].id);
				$('#poster-template').render(options[i]).appendTo($posters)
					.css({ 'left' : '100%' })
					.imagesLoaded(function(){
						avatar.setImage($(this).find('img'));
					});
			}
			return this;
		},
		insert : function (options) {
			var avatar = this;
			for (var i=options.length-1; i>=0; i--) {
				this.log.upcoming.splice(0, 0, options[i].id);
				$('#poster-template').render(options[i]).appendTo($posters)
					.css({ 'left' : '100%' })
					.imagesLoaded(function(){
						avatar.setImage($(this).find('img'));
					});
			}
			return this;
		},
		
		present : function (id, option) {
			var avatar = this;
			var posterMotionLockChecker = setInterval(function(){
				if (!avatar.posterMotionLock) {
					clearInterval(posterMotionLockChecker);
					
					var $former = $('#posters li.current');
					var $replacer = $('#posters li[song_id="' + id + '"]');
					var formerDestiny;
					
					var frameCount = avatar.settings.fps * avatar.settings.duration/1000;
					var step = $(window).width() / frameCount;
					
					var slide;
					
					switch (option) {
					case 'slideRight':
						slide = true;
						$replacer.css({ 'left' : -$(window).width() });
						formerDestiny = '100%';
						break;
					case 'slideLeft':
						slide = true;
						$replacer.css({ 'left' : $(window).width() });
						step = -step;
						formerDestiny = '-100%'; 
						break;
					case 'fadeIn':
						slide = false;
						$replacer.hide().css({ 'left' : 0 });
					}
					
					avatar.posterMotionLock = true;
					if (slide) {
						var _slideInterval = setInterval(function(){
							$former.css({ 'left' : (parseInt($former.css('left')) + step) });
							$replacer.css({ 'left' : (parseInt($replacer.css('left')) + step) });
							
							frameCount--;
							if (frameCount<=1) {
								clearInterval(_slideInterval);
								avatar.posterMotionLock = false;
								$former.css('left', formerDestiny).removeClass('current');
								$replacer.css('left', 0).addClass('current');
							}
						}, 1000/avatar.settings.fps);
					}
					else {
						$former.fadeOut().removeClass('current');
						$replacer.fadeIn('fast', function(){avatar.posterMotionLock = false; }).addClass('current');
					}
				}
			}, 50);
			
			return this;
		},
		
		setImage : function (para) {
			para.each(function(){
				var imgRatio = $(this).width() / $(this).height();
				var stdRatio = $(window).width() / $(window).height();
				
				if (imgRatio > stdRatio) {	//wide
					$(this).css({
						width : '',
						height : '100%',
						left : ($(window).width() - $(window).height()*imgRatio)/2,
						top : 0
					})
				}
				else {	// tall
					var offset = ($(window).height() - yueConsole.settings.consoleHeight/2 - $(window).width()/imgRatio) / 2;
					$(this).css({
						width : '100%',
						height : '',
						left : 0,
						top : (-offset > yueConsole.settings.consoleHeight) ? offset : ($(window).height() - $(window).width()/imgRatio)
					})
				}
				setTimeout(function() { $(this).removeClass('noMotion') }, 700);
			});
			return this;
		},
		setFitImage : function (para) {
			para.each(function(){
				var imgRatio = $(this).width() / $(this).height();
				var stdRatio = $(window).width() / $(window).height();
				
				$(this).addClass('noMotion');
				
				if (imgRatio > stdRatio) { //wide
					$(this).css({
							width : $(window).width(),
							height : $(window).width() / imgRatio,
							left : 0,
							top : ($(window).height() - yueConsole.settings.consoleHeight - $(window).width()/imgRatio) / 2
						});
				}
				else { //tall
					$(this).css({
							width : $(window).height() * imgRatio,
							height : $(window).height(),
							left : ($(window).width() - $(window).height()*imgRatio) / 2,
							top: 0
						});
				}
			});
			return this;
		} 
};

var wall = {
		loadInfo : function (options) {
/*			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function (data) {
					d_node = data;
					for (var i=0; i<data.length; i++) {
						var brick = $('brick-template').render(data[i].songInfo).appendTo($wallWrapper);
						for (var j=0; j<data[i].comment; i++) {
							$('brick-comment-template').render(data[i].comment[j]).appendTo(brick.children('.brick-comment'));
						}
						$wallWrapper.imagesLoaded(function(){
							$wallWrapper.masonry({
								itemSelector: '.brick',
								columnWidth:245,
								cornerStampSelector: '#nodeInfo'
							})
						});
					}
				}
			});
*/		
			var data = {	nodeInfo : {
			            		demograph : {
				            		nodename : '胡桃夹子',
				            		nickname : '阿夹',
				            		photo : 'sample/photo-nut.jpg',
				            		heart : 24356,
				            		brief : '经营好一个咖啡店是立身之本，唱歌配音与后期只是业余爱好'
			            		},
			            		nodeIntro : '节点简介：吉他又译为结它或六弦琴。属于弹拨乐器'
			            	},
			            	songList : [
				            	{
				            		song : {
					            		id: '001',
					            		thumb: 'sample/epCover-eason.jpg',
					            		title: '好久不见',
					            		author: 'eason',
					            		level: 4,
					            		heart: 230984
				            		},
				            		comment : [
			            	           {
			            	        	   photo: 'sample/photo-strawberry.jpg',
			            	        	   username: 'sdfl',
			            	        	   content: 'sodhfoslfd sldjfls df'
			            	           }
			            	        ]
				            	},
				            	{
				            		song : {
					            		id: '013',
					            		thumb: 'sample/epCover-pg.jpg',
					            		title: '无可救药',
					            		author: '品冠',
					            		level: 1,
					            		heart: 15007
				            		},
				            		comment : [
				            		    {
				            		    	photo: 'sample/photo-butterfly.jpg',
				            		    	username: '月光蝶',
				            		    	content: 'nice?'
				            		    },
				            		    {
				            		    	photo: 'sample/photo-redhat.jpg',
				            		    	username: 'REDHAT',
				            		    	content: 'wowowowowow!!!!'
				            		    }
				            		]
				            	}
			            	],
			            };
			
			this.clean();
			
			$('#nodeInfo-demograph-template').render(data.nodeInfo.demograph).appendTo('#nodeInfo .demograph');
			
			for (var i=0; i < data.songList.length; i++) {
				var brick = $('#brick-template').render(data.songList[i].song).appendTo($wallWrapper);
				for (var j=0; j < data.songList[i].comment.length; j++) {
					$('#brick-comment-template').render(data.songList[i].comment[j]).appendTo(brick.find('.brick-comment'));
				}
				$wallWrapper.imagesLoaded(function(){
					$wallWrapper.masonry({
						itemSelector: '.brick',
						columnWidth:245,
						cornerStampSelector: '#nodeInfo'
					})
				});
			}
		},
		
		clean : function () {
			$('#nodeInfo .demograph').html('');
			$wallWrapper.find('.brick').remove();
		}
}

var menu = {
/* player related menus */
		mapping : {
			'songInfo'	: $songInfo,
			'start'		: $startMenu,
			'search'	: $searchMenu,
			'fm'		: $fmMenu,
			'msg'		: $msgMenu,
			'user'		: $userMenu
		},
		log : {
			independent : new Array ( 'songInfo' ),
			dependent: new Array ( 'start', 'search', 'fm', 'msg', 'user' )
		},
		show : function (para) {
			if (para && typeof(para)=='string') {
				if (_.inArray(para, this.log.independent)){
					showSingleMenu(para);
				}
				else if (_.inArray(para, this.log.dependent)) {
					for (var i=0; i<this.log.dependent.length; i++) {
						if (this.log.dependent[i]==para) {
							this.showSingleMenu(para);
						}
						else {
							this.hideSingleMenu(this.log.dependent[i]);
						}
					}
				}
			}
			
			return this;
		},
		hide : function (para) {
			if (para && typeof(para)=='string') {
				if (para=='all') {
					for (var i in this.mapping) {
						this.hideSingleMenu(i);
					}
				}
				else if (para in this.mapping) {
					this.hideSingleMenu(para);
				}
			}
			
			return this;
		},
		toggle : function (para) {
			if (para in this.mapping && this.mapping[para].is(':visible')) {
				this.hide(para);
			}
			else {
				this.show(para);
			}
			return this;
		},
		
		showSingleMenu : function (para) {
			this.mapping[para].css({ top: this.getTopPos(para) }).fadeIn();
			return this;
		},
		hideSingleMenu : function (para) {
			this.mapping[para].css({ top: this.getTopPos(para) }).fadeOut();
			return this;
		},
		
		adjustPosition : function () {
			for (var i in this.mapping) {
				this.mapping[i].css({ top: this.getTopPos(i) });
			}
			return this;
		},
		getTopPos : function (para) {
			var obj;
			if (typeof(para) == 'string') {
				obj = this.mapping[para];
			}
			else if (typeof(para.css)!='undefined') {
				obj = para;
			}
			else {
				return false;
			}
			
			if (yueConsole.isPlayer) {
				return $(window).height() - obj.height() - yueConsole.settings.consoleHeight;
			}
			else {
				return yueConsole.settings.consoleHeight - 2;
			}
		}
}// end of menu

var dialog = {
/* manages all dialogs (pop-up dialogs) */
		mapping : {
			'sDetail'	: $sDetail,
			'review'	: $review,
			'newSong'	: $newSong,
			'activity'	: $activity,
			'userInfo'	: $userInfo
		},
		isDialog : false,
		log : {},
		show : function (para, options) {
			if (para && typeof(para)=='string') {
				$dialogWrapper.fadeIn().scrollTop(0);
				if (para in this.mapping) {
					for (var i in this.mapping) {
						if (i==para) {
							this.showSingleDialog(para, options);
						}
						else {
							this.hideSingleDialog(i, options);
						}
					}
				}
			}
			return this;
		},
		hide : function () {
			$dialogWrapper.fadeOut();
			for (var i in this.mapping) {
				this.hideSingleDialog(i);
			}
			return this;
		},
		toggle : function (para, options) {
			if (para in this.mapping && this.mapping[para].is(':visible')) {
				this.hide();
			}
			else {
				this.show(para, options);
			}
			return this;
		},
		
		showSingleDialog : function (para, options) {
			this.mapping[para].fadeIn();
			return this;
		},
		hideSingleDialog : function (para) {
			this.mapping[para].fadeOut();
			return this;
		}
		
} // end of dialog

/* ------- DIALOGUES ------- */

var sDetail = {
		
}