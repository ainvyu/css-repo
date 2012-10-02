var isChatting = false;

function _fill_zero(dec, len) {
  var obj = '000000000000000'+dec;
  return obj.substring(obj.length - len);
}

function _make_line(msg) {
  var date = new Date(msg.time*1000);
  var dateForm =
    _fill_zero(date.getHours(), 2)
      + ":" + _fill_zero(date.getMinutes(), 2)
      + ":" + _fill_zero(date.getSeconds(), 2);

	var data = 	'<li id=line' + msg.no + '>';
		data += '  <div class="log_line">';
		data +=	'    <span class="log_time" title=' + dateForm + '>' + '<a href="?scroll=line' + msg.no + '">' + dateForm + '</a>' + '</span>';
		data +=	'    <span class="log_nickname">'+ msg.nick + '</span>';
		data +=	'    <span class="log_message">' + _filter_data(msg.what) + '</span>';
		data += '  </div>';
		data +=	'</li>';

  return data;
}

function _append_log(force_scroll, msg) {
  var _from = from,
    $doc = $(document),
    $window = $(window),
    appendTarget = $('.page > .scroller');

  console.log("window.scrollTop: " + $(window).scrollTop());
  console.log("document.height(): " + $(document).height());
  console.log("window.height: " + $(window).height());
  console.log("document.height()-window.height(): " + ($(document).height() - $(window).height()));

  if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
    console.log("now scroll has bottom.")
  }

  var willScroll = force_scroll || isScrollBottom || isChatting;

  appendTarget.append(_make_line(msg));

  unloader.reset();
  myScroll.refresh();

  if (willScroll) {
    scroll_to_bottom();
  }
}

function _transform_url(data) {
  var re = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/g;

  return data.replace(re, '<a href="' + '$1' + '" target=_blank>$1</a>');
}

function _filter_data(data) {
  var filtered = data;
  filtered = _transform_url(filtered);
  return filtered;
}

function _get_log(log_req_addr, limit, offset) {
	var log_fetch_addr = log_req_addr + '?limit=' + limit + "&offset=" + offset;

  	var force_scroll = false;
	var _from = from,
		$doc = $(document),
		$window = $(window),
		appendTarget = $('.page > .scroller');
	var init_data = '';

	$.getJSON(log_fetch_addr, function(msgs) {
		$.each(msgs, function(i, msg) {
			init_data += _make_line(msg);
		});
	
		appendTarget.append(init_data);
        myScroll.refresh();
	
		if (scroll_line != '') {
		  scroll_to_element(scroll_line);
		}
	});  
}
    
function _init_log() {
<<<<<<< HEAD
    var wrapper = document.querySelector('#content');
=======
	var wrapper = d.querySelector('#log_view .content'),
>>>>>>> [JS] 언로더 에러 픽스
	unloader = new Unloader(wrapper, 'li');
	
	myScroll = new iScroll(wrapper, {
        onRefresh: function () {
        	unloader.setup(this.x, this.y);
        },
        onScrollEnd: function () {
            // Tracking scroll for detect scroll bottom
<<<<<<< HEAD
            if (myScroll.y >= $('#content').height) {
                //console.log("Scroll bottom");
                isScrollBottom = true;
            }
            else {
                //console.log("Scroll non bottom:" + myScroll.y + ' ' + $('#content').children[0].offsetHeight);
=======
            if (myScroll.y >= $('.content').height) {
                console.log("Scroll bottom");
                isScrollBottom = true;
            }
            else {
                console.log("Scroll non bottom:" + myScroll.y + ' ' + $('.content').children[0].offsetHeight);
>>>>>>> [JS] 언로더 에러 픽스
                isScrollBottom = false;
            }
        },
        onPositionChange: function(x, y) {
            unloader.onmove(x, y);
        },
    });
	_get_log(log_data_addr, 999999999, last_log_no+1);
}

function scroll_to_element(scroll_line_id) {
    var target = $('#'+scroll_line_id);
    myScroll.scrollToElement(target, 100);
}

function scroll_to_bottom() {
    myScroll.scrollToElement('li:last-child', 100)
}

function getScrollPosition() {
  var de = document.documentElement;
  var b = document.body;
  var oScroll = {};

  oScroll.x = document.all ? (!de.scrollLeft ? b.scrollLeft : de.scrollLeft) : (window.pageXOffset ? window.pageXOffset : window.scrollX);
  oScroll.y = document.all ? (!de.scrollTop ? b.scrollTop : de.scrollTop) : (window.pageYOffset ? window.pageYOffset : window.scrollY);

  return oScroll;
}

////////////////////////////////////////////////////////////////////////////////
// Message send.
function start_chat() {
  $('#enable-chat').slideUp();
  $('#say').slideDown();
  $('#msg').focus();

  unloader.reset();
  myScroll.refresh();
}

$('#msg').focus(function(event) {
    console.log('chatting flag on');
    isChatting = true;
    unloader.reset();
    myScroll.refresh();
});

$('#msg').focusout(function(event) {
    console.log('chatting flag off');
    isChatting = false;
    unloader.reset();
    myScroll.refresh();
});

$('#submit_msg').click(function(event) {
  event.preventDefault();
  submit_say_and_init();
});

$('#msg').keypress(function(event) {
  if (event.which == 13) {
    event.preventDefault(); // ignore enter event
    submit_say_and_init();
  }
});

function submit_say_and_init() {
  var msg = $('#msg').val();
  submit_say(msg);

  // init #msg
  unloader.reset();
  myScroll.refresh();
  $('#msg').val('').focus();
}

function submit_say(msg) {
  if (!msg) {
    return;
  }

  var msg_data = { 
      nick: nickname,
      what: msg,
      time: Math.floor(new Date().getTime() / 1000),
      channel: from,
      type: 0 
  };

  socket.emit('chat.privmsg', msg_data);
}

function go_to_bottom() {
    myScroll.scrollToElement('li:last-child', 100)
}
////////////////////////////////////////////////////////////////////////////////
