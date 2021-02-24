/*  
 *  This jquery plugin is based on this blogpost - http://www.switchonthecode.com/tutorials/creating-a-roulette-wheel-using-html5-canvas
 *  If you want to know more how it works, please refer to the above tutorial. 
 *  
 *  @author Roy Yu | iroy2000 [at] gmail.com ( modify, repackage and add new features )
 *  @description: This jquery plugin will create a spin wheel and let you to add players at run time. 
 *  
 */


(function($) {

    // OLD
    var url = window.location.href;
    var page = url.split("/").pop();
    page = page.split("?");
    page = page[0];

    // NEW
    var querystrings = getQuerystring();

    if (querystrings.indexOf("tea") >= 0) {
        page = "tea";
        cookie = getCookie("teaNameList");
    } else if (querystrings.indexOf("beer") >= 0) {
        page = "beer";
        cookie = getCookie("beerNameList");
    } else if (querystrings.indexOf("xmas") >= 0) {
        page = "xmas";
        cookie = getCookie("xmasNameList");
    } else if (querystrings.indexOf("gen") >= 0) {
        page = "gen";
        cookie = getCookie("genNameList");
    }

    console.log('page: ' + page);

    $.fn.spinwheel = function(options, callback) {

        var params = $.extend({}, $.fn.spinwheel.default_options, options),
            $that = $(this),
            ctx = null,
            colorCache = [],
            startAngle = 0,
            arc = Math.PI / 6,
            spinTimeout = null,
            spinArcStart = 10,
            spinTime = 0,
            spinTimeTotal = 0,
            spinAngleStart = 0,
            pplArray = params.pplArray,
            pplLength = pplArray.length;

        if ($.isFunction(options)) {
            callback = options;
            options = {};
        }

        var methods = {
            init: function() {
                methods.getContext();
                methods.setup();
                drawWheel();
            },
            setup: function() {
                $(params.spinTrigger).bind('click', function(e) {
                    /* when spinner button is pressed */
                    e.preventDefault();

                    /* if sound is NOT muted, play */
                    if (!$('.sound-icon').hasClass('mute')) {
                        var audioElement = document.createElement('audio');
                        audioElement.setAttribute('src', '..brain/images/BBTaudio.mp3');
                        audioElement.play();
                    }

                    methods.spin();
                });

                $(params.addPplTrigger).bind('click', function(e) {
                    e.preventDefault();

                    var name = $(params.joiner).val();

                    $('.error').empty();
                    /* check the user has input a name*/
                    if (name.length == 0) {
                        $('.error').text('Please input a character/category.');
                        return false;
                    }

                    name = name.toUpperCase();

                    var item = $('<li />').append(name);
                    $(params.paricipants).append(item);

                    /* clear input field */
                    document.getElementById('joiner').value = '';

                    methods.updatePanel();
                });


            },
            getContext: function() {
                if (ctx !== null)
                    return ctx;

                var canvas = $that[0];
                if (typeof canvas != 'undefined') {
                    ctx = canvas.getContext("2d");
                }
            },
            spin: function() {
                spinAngleStart = Math.random() * 10 + 10;
                spinTime = 0;
                spinTimeTotal = 10000; // 10 seconds
                //spinTimeTotal = Math.random() * 3 + 4*1000; 
                rotateWheel();
            },
            updatePanel: function() {

                /* Runs everytime a name is added on the list */

                var $ppl = $(params.paricipants).children(); // all of the li's
                pplArray = [];
                $ppl.each(function(key, value) {
                    pplArray.push(value.innerHTML); // adds value of li to array
                });

                /* delete users */
                $(document).on('click', '.participants li', function(e) {
                    /* remove li and run updatePanel() again */

                    var $this = $(this);
                    var w = $(window).width();
                    var name = $this.text();

                    swal({
                            title: "Are you sure you want to delete " + name + " from the randomiser?",
                            text: "",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#f6303e",
                            confirmButtonText: "Yes, delete please!",
                            cancelButtonText: "No, keep it!",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                $this.remove();
                                methods.updatePanel();
                            }
                        });

                });

                arc = 2 * Math.PI / $ppl.length;
                pplLength = $ppl.length;

                drawWheel();
            }
        }

        function genHex() {

            colorCache.push('transparent');
            return 'transparent';

        }


        var rotateWheel = function rotateWheel() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }

            var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal); // easeOut
            startAngle += (spinAngle * Math.PI / 180);
            drawWheel();
            spinTimeout = setTimeout(rotateWheel, 30);
        }

        function stopRotateWheel() {
            clearTimeout(spinTimeout);
            var degrees = startAngle * 180 / Math.PI + 90;
            var arcd = arc * 180 / Math.PI;
            var index = Math.floor((360 - degrees % 360) / arcd);
            ctx.save();
            ctx.font = params.resultTextFont;
            var text = pplArray[index];
            $(params.winnerDiv).html(text).show();
            $('#winnerwrapper').addClass('open');

            /* winner share buttons */
            if (page == 'tea') {
                /* tea */
                $('#winnercontent a.winner-tw').attr("href", "https://twitter.com/home?status=Thanks%20to%20%40miltonbayer's%20%23TeaGenerator,%20I%20know%20it's%20" + text + "'s%20turn%20to%20make%20me%20a%20cuppa!%20-%20https%3A//tea.miltonbayer.com/");
                $('#winnercontent a.winner-email').attr("href", "mailto:?&amp;subject=Milton Bayer's Tea Generator&amp;body=Thanks to Milton Bayer's Tea Generator, I know it's " + text + "'s turn to make me a cuppa! - https://tea.miltonbayer.com/");
            } else if (page == 'beer') {
                /* beer */
                $('#winnercontent a.winner-tw').attr("href", "https://twitter.com/home?status=Thanks%20to%20%40miltonbayer's%20%23BeerGenerator,%20I%20know%20it's%20" + text + "'s%20turn%20to%20buy%20a%20round!%20-%20https%3A//tea.miltonbayer.com/?beer");
                $('#winnercontent a.winner-email').attr("href", "mailto:?&amp;subject=Milton Bayer's Beer Generator&amp;body=Thanks to Milton Bayer's Beer Generator, I know it's " + text + "'s turn to buy a round! - https://tea.miltonbayer.com/?beer");
            } else if (page == 'xmas') {
                /* xmas */
                $('#winnercontent a.winner-tw').attr("href", "https://twitter.com/home?status=Thanks%20to%20%40miltonbayer's%20%23ChristmasGenerator,%20I%20know%20it's%20" + text + "'s%20turn!%20Merry%20Christmas!%20-%20https%3A//tea.miltonbayer.com/?xmas");
                $('#winnercontent a.winner-email').attr("href", "mailto:?&amp;subject=Milton Bayer's Christmas Generator&amp;body=Thanks to Milton Bayer's Christmas Generator, I know it's " + text + "'s turn! Merry Christmas! - https://tea.miltonbayer.com/");
            } else if (page == 'gen') {
                $('#winnercontent a.winner-tw').attr("href", "https://twitter.com/home?status=Thanks%20to%20%40miltonbayer's%20%23RandomGenerator,%20I%20know%20it's%20" + text + "'s%20turn!%20-%20https%3A//tea.miltonbayer.com/?gen");
                $('#winnercontent a.winner-email').attr("href", "mailto:?&amp;subject=Milton Bayer's Random Generator&amp;body=Thanks to Milton Bayer's Random Generator, I know it's " + text + "'s turn! - https://tea.miltonbayer.com/?gen");
            }

            //ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
            ctx.restore();
        }

        function drawArrow() {
            ctx.fillStyle = params.arrowColor;
            ctx.beginPath();
            ctx.moveTo(250 - 4, 250 - (params.outerRadius + 15));
            ctx.lineTo(250 + 4, 250 - (params.outerRadius + 15));
            ctx.lineTo(250 + 4, 250 - (params.outerRadius - 15));
            ctx.lineTo(250 + 9, 250 - (params.outerRadius - 15));
            ctx.lineTo(250 + 0, 250 - (params.outerRadius - 23));
            ctx.lineTo(250 - 9, 250 - (params.outerRadius - 15));
            ctx.lineTo(250 - 4, 250 - (params.outerRadius - 15));
            ctx.lineTo(250 - 4, 250 - (params.outerRadius + 15));
            ctx.fill();
        }

        function drawWheel() {
            if (ctx !== null) {
                ctx.strokeStyle = params.wheelBorderColor;
                ctx.lineWidth = params.wheelBorderWidth;
                ctx.font = params.wheelTextFont;

                ctx.clearRect(0, 0, 500, 500);

                var img = document.getElementById("bg");
                ctx.save();
                ctx.translate(250, 250);
                ctx.rotate(startAngle);
                ctx.drawImage(img, -params.outerRadius, -params.outerRadius,
                    2 * params.outerRadius, 2 * params.outerRadius);
                ctx.restore();

                var text = null,
                    i = 0,
                    totalJoiner = pplLength;

                for (i = 0; i < totalJoiner; i++) {
                    text = pplArray[i];
                    //$(params.winnerDiv).html(text).show();  $(params.peopleArray).html(text)
                    //var el = $( '<div></div>' );
                    //el.html("<html><head><title>titleTest</title></head><body><a href='test0'>test01</a><a href='test1'>test02</a><a href='test2'>test03</a></body></html>");
                    //$("a", el) // All the anchor elements
                    //alert(el);
                    //alert(text.length);
                    //let el;        
                    //el= text.split(']')[0];                           
                    el = text.substring(text.indexOf('> ')+1, text.indexOf("</"));
                    //el=text.slice(-1)[0];
                    //alert(el);

                    var angle = startAngle + i * arc;
                    ctx.fillStyle = colorCache.length > totalJoiner ? colorCache[i] : genHex();

                    ctx.beginPath();
                    ctx.arc(250, 250, params.outerRadius, angle, angle + arc, false);
                    ctx.arc(250, 250, params.innerRadius, angle + arc, angle, true);
                    ctx.stroke();
                    ctx.fill();//
                   

                    ctx.save();
                    ctx.shadowOffsetX = -1;
                    ctx.shadowOffsetY = -1;
                    ctx.shadowBlur = 1;
                    ctx.shadowColor = params.wheelTextShadowColor;

                    ctx.fillStyle = params.wheelTextColor;
                    ctx.translate(250 + Math.cos(angle + arc / 2) * params.textRadius, 250 + Math.sin(angle + arc / 2) * params.textRadius);
                    ctx.rotate(angle + arc / 2 + Math.PI / 2 + 80);

                    ctx.strokeStyle = params.strokeColour;
                    ctx.lineWidth = params.strokeWidth;
                    ctx.strokeText(el, -ctx.measureText(el).width / 2, 0);

                    ctx.fillText(el, -ctx.measureText(el).width / 2, 0);

                    ctx.restore();
                    ctx.closePath();
                }
                drawArrow();
            }
        }

        function easeOut(t, b, c, d) {
            /*var ts = (t/=d)*t;
            var tc = ts*t;
            return b+c*(tc + -3*ts + 3*t);*/

            /* goes until it reaches spinAngleStart - need to make sure it reaches spinAngleStart faster */

            var ts = (t /= d);
            var tc = ts * t;
            var x = b + c * (tc + -3 * ts + 3 * t);
            return x;

            /*
             +1 causes it to go backwards
             +0.2 cause it to bounce-back a little bit.
             
             -1 means it won't stop spinning before the pop-up
             
             *2 causes it to go backwards (doesn't calc winner 
             
             /2 means it won't stop spinning before the pop-up
             
            */
        }

        methods.init.apply(this, []);

        methods.updatePanel();
    }

    /*  ---  please look at the index.html source in order to understand what they do ---
     *  outerRadius : the big circle border
     *  innerRadius  : the inner circle border
     *  textRadius   : How far the the text on the wheel locate from the center point
     *  spinTrigger  : the element that trigger the spin action 
     *  wheelBorderColor : what is the wheel border color
     *  wheelBorderWidth : what is the "thickness" of the border of the wheel
     *  wheelTextFont : what is the style of the text on the wheel
     *  wheelTextColor : what is the color of the tet on the wheel
     *  wheelTextShadow : what is the shadow for the text on the wheel
     *  resultTextFont : it is not being used currently
     *  arrowColor : what is the color of the arrow on the top
     *  participants : what is the container for participants for the wheel
     *  joiner : usually a form input where user can put in their name
     *  addPplTrigger : what element will trigger the add participant
     *  winDiv : the element you want to display the winner
     * 	strokeWidth : The width of the stroke.
     *  strokeColour : The stroke colour for the text.
     */


    var strokeclr;

    if (page == 'beer') {
        strokeclr = '#362309';//#40362f#c4ad9c
    } else if (page == 'tea') {
        strokeclr = '#211505';//#bc7c20362309
    } else if (page == 'xmas') {
        strokeclr = '#e8d1ab';
    } else if (page == 'gen') {
        strokeclr = '#362308';
    } else {
        strokeclr = '#bc7c20';
    }

    $.fn.spinwheel.default_options = {
        outerRadius: 200,
        innerRadius: 3,
        textRadius: 140,//100,
        spinTrigger: '#spin',
        wheelBorderColor: 'transparent',
        wheelBorderWidth: 0,
        wheelTextFont: 'bold 20px sans-serif',//17
        wheelTextColor: '#FFDFD3',
        wheelTextShadowColor: 'rgba(88,59,57,0)',//(220,220,220,0)(88,59,57,0)
        resultTextFont: 'bold 30px sans-serif',
        arrowColor: 'black',//'transparent',
        paricipants: '.participants',
        addPplTrigger: '.add',
        joiner: '.joiner',
        winnerDiv: '.winner',
        strokeWidth: 5,//3
        strokeColour: strokeclr//
    }

})(jQuery);

function getQuerystring() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function() {

    // OLD
    var url = window.location.href;
    var page = url.split("/").pop();
    page = page.split("?");
    page = page[0];

    if (page == "tea") {
        cookie = getCookie("teaNameList");
    } else if (page == "beer") {
        cookie = getCookie("beerNameList");
    } else if (page == "xmas") {
        cookie = getCookie("xmasNameList");
    } else if (page == "gen") {
        cookie = getCookie("genNameList");
    }

    // NEW
    var querystrings = getQuerystring();

    if (querystrings.indexOf("tea") >= 0) {
        page = "tea";
        cookie = getCookie("teaNameList");
    } else if (querystrings.indexOf("beer") >= 0) {
        page = "beer";
        cookie = getCookie("beerNameList");
    } else if (querystrings.indexOf("xmas") >= 0) {
        page = "xmas";
        cookie = getCookie("xmasNameList");
    } else if (querystrings.indexOf("gen") >= 0) {
        page = "gen";
        cookie = getCookie("genNameList");
    } else {
        page = "tea";
        cookie = getCookie("teaNameList");
    }

    console.log(cookie.length);

    if (cookie.length == 0) {
        $('.spinner').spinwheel({
            pplArray: ["Fast🐭?", "Slow😺?", "Fast/Slow🐰", "Fast🐶?", "Slow🐡?", "Slow/Fast🐦?"]
        });
    } else {
        var gotnames = cookie;
        var splitnames = gotnames.split(",");

        for (var i in splitnames) {
            $('.participants').append("<li>" + splitnames[i] + "</li>");
        }

        $('.spinner').spinwheel({
            pplArray: splitnames
        });

        setAllNames();

    }

    /* On click effects */

    $('#winnerwrapper .nav-icon.cross').click(function() {
        $('#winnerwrapper').removeClass('open');
    });

    $('#enternames').click(function() {
        $('#addnameswrapper').addClass('open');
    });

    $('#addnameswrapper .nav-icon.cross, #submitspin').click(function() {
        $('#addnameswrapper').removeClass('open');
    });

    $('#menubtn').click(function() {
        if ($('#menubtn').hasClass('cross')) {
            $('#menubtn').removeClass('cross');
            $('#menu').removeClass('open');
        } else {
            $('#menubtn').addClass('cross');
            $('#menu').addClass('open');
        }
    });

    /* custom scrollbar */
    $(".participantswrapper").mCustomScrollbar();

    /* Share buttons */
    $('.shareText').click(function() {
        $('.share-btns').toggleClass('showButts');
    });

    /* quote revolver */
    $('.quotes').quovolver({
        autoPlaySpeed: 2200,
        pauseOnHover: true
    });

    /* add page to body */
    // OLD
    var url = window.location.href;
    var page = url.split("/").pop();
    page = page.split("?");
    page = page[0];

    // NEW
    var querystrings = getQuerystring();

    if (querystrings.indexOf("tea") >= 0) {
        page = "tea";
        cookie = getCookie("teaNameList");
    } else if (querystrings.indexOf("beer") >= 0) {
        page = "beer";
        cookie = getCookie("beerNameList");
    } else if (querystrings.indexOf("xmas") >= 0) {
        page = "xmas";
        cookie = getCookie("xmasNameList");
    } else if (querystrings.indexOf("gen") >= 0) {
        page = "gen";
        cookie = getCookie("genNameList");
    }

    $('body').addClass(page);

    /* share buttons */
    if (page == 'tea') {
        $('a.winner-fb').attr("href", "https://www.facebook.com/sharer/sharer.php?u=https://tea.miltonbayer.com/");
        $('.share-btns a.winner-tw').attr("href", "https://twitter.com/home?status=Whose%20turn%20is%20it%20to%20make%20the%20next%20round%20of%20tea%20in%20the%20office?%20Use%20our%20%23TeaGenerator%20to%20find%20out!%20-%20http%3A//tea.miltonbayer.com/");
        $('.share-btns a.winner-email').attr("href", "mailto:?&amp;subject=Milton Bayer's Tea Generator&amp;body=Whose turn is it to make the next round of tea in the office? Use Milton Bayer's Tea Generator to find out - http://tea.miltonbayer.com/");
    } else if (page == 'beer') {
        $('a.winner-fb').attr("href", "https://www.facebook.com/sharer/sharer.php?u=https://tea.miltonbayer.com/?beer");
        $('.share-btns a.winner-tw').attr("href", "https://twitter.com/home?status=Whose%20turn%20is%20it%20to%20buy%20the%20next%20round?%20Use%20our%20%23BeerGenerator%20to%20find%20out!%20-%20https%3A//tea.miltonbayer.com/?beer");
        $('.share-btns a.winner-email').attr("href", "mailto:?&subject=Milton Bayer's Beer Generator&body=Whose turn is it to buy the next round? Use Milton Bayer's Beer Generator to find out! - http://tea.miltonbayer.com/?beer");
    } else if (page == 'xmas') {
        $('a.winner-fb').attr("href", "https://www.facebook.com/sharer/sharer.php?u=https://tea.miltonbayer.com/?xmas");
        $('.share-btns a.winner-tw').attr("href", "https://twitter.com/home?status=%40miltonbayer%20takes%20the%20arguing%20out%20of%20Christmas%20by%20creating%20a%20%23ChristmasGenerator%20for%20all%20of%20your%20chores!%20-%20http%3A//tea.miltonbayer.com/?xmas");
        $('.share-btns a.winner-email').attr("href", "mailto:?&subject=Milton Bayer Christmas Generator&body=Milton Bayer takes the arguing out of Christmas by creating a #ChristmasGenerator for all of your chores! - http://tea.miltonbayer.com/?xmas");
    } else if (page == 'gen') {
        $('a.winner-fb').attr("href", "https://www.facebook.com/sharer/sharer.php?u=https://www.miltonbayer.com/?gen");
        $('.share-btns a.winner-tw').attr("href", "https://twitter.com/home?status=%40miltonbayer%20stops%20the%20arguing%20by%20creating%20a%20%23RandomGenerator%20for%20all%20of%20your%20needs!%20-%20http%3A//tea.miltonbayer.com/?gen");
        $('.share-btns a.winner-email').attr("href", "mailto:?&subject=Milton Bayer's Random Generator&body=Milton Bayer stops the arguing by creating a #RandomGenerator for all of your chores! - http://tea.miltonbayer.com/?gen");
    }


    /* Open social btns in new window */
    jQuery('a[target^="_new"]').click(function(e) {
        var width = 600;
        var height = 400;
        window.open(this.href, 'newwindow', 'width=' + width + ', height=' + height + ', top=150, left=150');
        return false;
    });

    /* If it's Safari */

    $(window).on("orientationchange", function() {

    });

    var isSafari = /constructor/i.test(window.HTMLElement);

    if (isSafari) {

        var windowWidth = $(window).width();
        var added = 0;
        var top = parseInt($('button.add').css('top'), 10);

        if (windowWidth < 568) {
            $('.gen button.add').css('top', (top + 9) + 'px');
        } else {
            $('.gen button.add').css('top', (top + 8) + 'px');
        }

    }

    /* xmas custom task */

    var task = "It's your turn!";

    /* Removes the line if text is added */
    $('#task').on('keyup change', function() {
        if ($(this).val().length > 0) {
            $(this).parent('div').addClass('no-line');
            $(this).addClass('no-line');
            task = $(this).val();
        } else {
            $(this).parent('div').removeClass('no-line');
            $(this).removeClass('no-line');
            task = "It's your turn!";
        }
    });

    /* checks whether the user has input a custom task on the xmas spinner */
    $('#spin').click(function() {
        if (task == "It's your turn!") {
            $('body.xmas #winnercontent h2').text(task);
        } else {
            task = task.toLowerCase();
            $('body.xmas #winnercontent h2').text("It's your turn to " + task);
        }
    });


    /* gen custom task */

    var task = "It's your turn!";
    /* checks whether the user has input a custom task on the xmas spinner */
    $('#spin').click(function() {
        if (task == "It's your turn!") {
            $('body.gen #winnercontent h2').text(task);
        } else {
            task = task.toLowerCase();
            $('body.gen #winnercontent h2').text("It's your turn to " + task);
        }
    });



    /* mutes the music */
    $('.sound-icon').click(function() {
        $(this).toggleClass('mute');
    });

    /* cookies */
    $('#savenames').click(function() {
        if ($('.participants li').length == 0) {
            sweetAlert("No names", "You can't save an empty list of names!", "error");
        } else {
            setAllNames();
            swal("Names saved!", "Your list of names has been saved.", "success");
        }
    });

    /* clear names */

    $('#clearnames').click(function() {
        $('.participants').empty();
    });

    /* query string */

    var queryString = window.location.search;
    var querystrings = getQuerystring();

    //if (queryString.length > 0){
    if (querystrings.indexOf("spin") >= 0) {
        $('#menu').removeClass('open');
        $('#menubtn').removeClass('cross');
    }

    /* xmas enter names focus */

    $('body.xmas #enternames').click(function() {
        $('#task').focus();
    });

    /* gen enter names focus */

    $('body.gen #enternames').click(function() {
        $('#task').focus();
    });

});

function setAllNames() {

    var allNames = "";
    $('.participants li').each(function(i) {
        allNames += ($(this).text() + ",");
    });
    allNames = allNames.slice(0, -1);

    if ($('body').hasClass('tea')) {
        setCookie("teaNameList", "" + allNames + "", 30);
    } else if ($('body').hasClass('beer')) {
        setCookie("beerNameList", "" + allNames + "", 30);
    } else if ($('body').hasClass('xmas')) {
        setCookie("xmasNameList", "" + allNames + "", 30);
    } else if ($('body').hasClass('gen')) {
        setCookie("genNameList", "" + allNames + "", 30);
    }

}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}