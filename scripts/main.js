window.onload = function () {
    var cars = getCarsData();
    var mover = false, x, y, posx, posy, first = true;

    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    printCards();
    initializeCards();
    attachEvents();

    function printCards() {
        var carsHtml = '';
        for (var i = 0; i < cars.length; i++) {
            carsHtml += "<div id='";
            carsHtml += cars[i].name;
            carsHtml += "' class='cars card marker'><img alt='";
            carsHtml += cars[i].alt;
            carsHtml += "' src='content/images/";
            carsHtml += cars[i].img;
            carsHtml += "'/><span><strong>";
            carsHtml += cars[i].alt;
            carsHtml += "</strong>,";
            carsHtml += cars[i].cost;
            carsHtml += "</span></div>"
        }
        carsHtml += "<button id='reset_button' style='vertical-align:middle'><span>Reset Cards</span></button>"
        document.getElementById("cars_tinder").innerHTML = carsHtml;
    }

    function initializeCards() {
        var marker = document.getElementsByClassName('marker');
        for (var i = 0; i < marker.length; i++) {
            var card = marker[i];
            if(mobilecheck()) {
                card.addEventListener('touchstart', function (e) {
                    mover = true;
                });
                card.addEventListener('touchend', function (e) {
                    mover = false;
                    first = true;
                    //Cancel action
                    if (posx < 100 && posx > -100) {
                        var element = this;
                        var id = setInterval(cancelAction, 3);

                        function cancelAction() {
                            cancelCardAction(element, id);
                        }
                    } else {//Carry out action
                        var element = this;
                        if (posx < 0) {
                            var id = setInterval(rejectAction, 3);
                            function rejectAction() {
                                rejectCardAction(element, id);
                            }
                        } else {
                            var id = setInterval(selectAction, 3);
                            function selectAction() {
                                selectCardAction(element, id);
                            }
                        }
                    }
                });
                card.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                    var touch = e.touches[0] || e.changedTouches[0];
                    var rect = getBoundingRect(this);
                    if (mover) {
                        if (first) {
                            x = touch.pageX;
                            y = touch.pageY;
                            first = false;
                        }
                        posx = touch.pageX - x;
                        posy = touch.pageY - y;
                        var absPosx = Math.abs(posx);
                        rotateAndTransform(this, absPosx, 1);
                    }
                });
            }
            else{
                card.onmousedown = function () {
                    mover = true;
                };
                card.onmouseup = function () {
                    mover = false;
                    first = true;
                    event.stopPropagation();
                    //Cancel action
                    if (posx < 100 && posx > -100) {
                        var element = this;
                        var id = setInterval(cancelAction, 3);

                        function cancelAction() {
                            cancelCardAction(element, id);
                        }
                    } else {//Carry out action
                        var element = this;
                        if (posx < 0) {
                            var id = setInterval(rejectAction, 3);
                            function rejectAction() {
                                rejectCardAction(element, id);
                            }
                        } else {
                            var id = setInterval(selectAction, 3);
                            function selectAction() {
                                selectCardAction(element, id);
                            }
                        }

                    }
                };
                card.onmousemove = function (e) {
                    var rect = getBoundingRect(this);
                    if (mover) {
                        if (first) {
                            x = e.pageX;
                            y = e.pageY;
                            first = false;
                        }
                        posx = e.pageX - x;
                        posy = e.pageY - y;
                        var absPosx = Math.abs(posx);
                        rotateAndTransform(this, absPosx, 1);
                    }
                };
            }
        }

        var html = document.getElementsByTagName("html")[0];
        var currentCard = marker[0];
        currentCard.classList.add("current");
        html.onmouseup = function () {
            mover = false;
        };
    }

    function cancelCardAction(element, id) {
        var absPosx = Math.abs(posx);
        if ((1 - absPosx / 250) > 0.99) {
            clearInterval(id);
        } else {
            rotateAndTransform(element, absPosx, 1);
            posx < 0 ? posx++ : posx--;
        }
    }

    function selectCardAction(element, id) {
        var absPosx = Math.abs(posx);
        if ((1 - absPosx / 250) < 0.01) {
            clearInterval(id);
            resetCard(element);
            equipNextCard();
            enableYesNoButtons();
            openDescriptionPage(element);
        } else {
            rotateAndTransform(element, absPosx, 2);
            posx++;
        }
    }

    function rejectCardAction(element, id) {
        var absPosx = Math.abs(posx);
        if ((1 - absPosx / 250) < 0.01) {
            clearInterval(id);
            resetCard(element);
            equipNextCard();
            enableYesNoButtons();
        } else {
            rotateAndTransform(element, absPosx, 2);
            posx--;
        }
    }

    //main function to determine rotation animation
    function rotateAndTransform(element, absPosx, speed) {
        var deg = speed * (parseInt(posx) / 10);
        var relativePosX = speed * posx;
        var relativeAbsPosX = speed * absPosx;
        element.style.transform = 'rotate(' + deg + 'deg) translate(' + relativePosX + 'px, -' + relativeAbsPosX + 'px)';
        element.style.webkitTransform = 'rotate(' + deg + 'deg) translate(' + relativePosX + 'px, -' + relativeAbsPosX + 'px)';
        element.style.mozTransform = 'rotate(' + deg + 'deg) translate(' + relativePosX + 'px, -' + relativeAbsPosX + 'px)';
        element.style.msTransform = 'rotate(' + deg + 'deg) translate(' + relativePosX + 'px, -' + relativeAbsPosX + 'px)';
        element.style.oTransform = 'rotate(' + deg + 'deg) translate(' + relativePosX + 'px, -' + relativeAbsPosX + 'px)';
        element.style.opacity = 1 - absPosx / 500;
    }

    function getBoundingRect(element) {

        var style = element.currentStyle || window.getComputedStyle(element);
        var margin = {
            left: parseInt(style.marginLeft),
            right: parseInt(style.marginRight),
            top: parseInt(style.marginTop),
            bottom: parseInt(style.marginBottom)
        };
        var padding = {
            left: parseInt(style["padding-left"]),
            right: parseInt(style["padding-right"]),
            top: parseInt(style["padding-top"]),
            bottom: parseInt(style["padding-bottom"])
        };
        var border = {
            left: parseInt(style["border-left"]),
            right: parseInt(style["border-right"]),
            top: parseInt(style["border-top"]),
            bottom: parseInt(style["border-bottom"])
        };
        var pos = {
            left: parseInt(style.left),
            right: parseInt(style.right),
            top: parseInt(style.top),
            bottom: parseInt(style.bottom)
        };
        var rect = element.getBoundingClientRect();
        rect = {
            left: rect.left - margin.left - pos.left,
            right: rect.right - margin.right - padding.left - padding.right - pos.right,
            top: rect.top - margin.top - pos.top,
            bottom: rect.bottom - margin.bottom - padding.top - padding.bottom - border.bottom - pos.bottom
        };
        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;
        return rect;

    };


    function resetAllCards() {
        enableYesNoButtons();
        var cardStack = document.getElementsByClassName("card");
        for (var i = 0; i < cardStack.length; i++) {
            var card = cardStack[i];
            card.classList.remove("current");
            card.classList.add("marker");
            card.style.display = "block";
        }
        equipNextCard();
    };

    function yesButtonPress() {
        disableYesNoButtons();
        var current = document.getElementsByClassName('marker');
        if (current[0] != null) {
            var id = setInterval(selectAction, 1);
            posx = 0;
            function selectAction() {
                selectCardAction(current[0], id);
            }

            equipNextCard();
        }
    };

    function noButtonPress() {
        disableYesNoButtons();
        var current = document.getElementsByClassName('marker');
        if (current[0] != null) {
            var id = setInterval(selectAction, 1);
            posx = -1;
            function selectAction() {
                rejectCardAction(current[0], id);
            }

            equipNextCard();
        }
    };


    function attachEvents() {
        var el = document.getElementById("reset_button");
        if (el.addEventListener)
            el.addEventListener("click", resetAllCards, false);
        else if (el.attachEvent)
            el.attachEvent('onclick', resetAllCards);

        var e2 = document.getElementById("yes_button");
        if (e2.addEventListener)
            e2.addEventListener("click", yesButtonPress, false);
        else if (e2.attachEvent)
            e2.attachEvent('onclick', yesButtonPress);

        var e3 = document.getElementById("no_button");
        if (e3.addEventListener)
            e3.addEventListener("click", noButtonPress, false);
        else if (e3.attachEvent)
            e3.attachEvent('onclick', noButtonPress);

        var e4 = document.getElementById("back");
        if (e4.addEventListener)
            e4.addEventListener("click", exitDescriptionPage, false);
        else if (e4.attachEvent)
            e4.attachEvent('onclick', exitDescriptionPage);
    }


    function resetCard(element) {
        element.style.display = "none";
        element.style.transform = null;
        element.style.webkitTransform = null;
        element.style.mozTransform = null;
        element.style.msTransform = null;
        element.style.oTransform = null;
        element.style.opacity = 1;
        element.classList.remove("marker");
    }

    function equipNextCard() {
        posx = 0;
        var markers = document.getElementsByClassName("marker");
        if (markers[0] != null) {
            markers[0].classList.add("current");
        }
    }


    function openDescriptionPage(element) {
        document.getElementById("description_page").style.display = "block";
        document.getElementById("back").style.display = "block";
        document.getElementById("cars_tinder").style.display = "none";
        document.getElementById("cinder_buttons").style.display = "none";
        openDescription(element);
    }

    function exitDescriptionPage() {
        document.getElementById("description_page").style.display = "none";
        document.getElementById("back").style.display = "none";
        document.getElementById("cars_tinder").style.display = "block";
        document.getElementById("cinder_buttons").style.display = "block";
    }


    function enableYesNoButtons() {
        document.getElementById("yes_button").disabled = false;
        document.getElementById("no_button").disabled = false;
    }

    function disableYesNoButtons() {
        document.getElementById("yes_button").disabled = true;
        document.getElementById("no_button").disabled = true;
    }


    function openDescription(element) {
        var descriptionHtml = '';
        for (var i = 0; i < cars.length; i++) {
            if (element.id == cars[i].name) {
                descriptionHtml += "<div><img alt='";
                descriptionHtml += cars[i].alt;
                descriptionHtml += "' src='content/images/";
                descriptionHtml += cars[i].img;
                descriptionHtml += "'/></div><div style='width: 100%'><span><strong>";
                descriptionHtml += cars[i].alt;
                descriptionHtml += "</strong>,";
                descriptionHtml += cars[i].cost;
                descriptionHtml += "</span></div><div><div class='button phone_call'><button id='phone_call_button' class='trigger' data-number='";
                descriptionHtml += cars[i].number;
                descriptionHtml += "'></button></div></div><p>";
                descriptionHtml += cars[i].description;
                descriptionHtml += "</p>";
                var phoneNumber = cars[i].number;
                break;
            }
        }
        document.getElementById("description_page").innerHTML = descriptionHtml;
        document.getElementById("phone_call_button").onclick = function () {
            window.open('tel:' + phoneNumber);
        };
    }


    function getCarsData() {
        return [
            {
                name: "astonMartin",
                alt: "Aston Martin V12 Vantage",
                img: "Aston-Martin-V12-Vantage-S36.jpg",
                cost: "1 Million",
                description: " The V12 Vantage was an unprecedented engineering achievement. Combining a V12 engine with our lightest sports-car in a package of pure aggression. We could have stopped there, we didn’t. An even lighter chassis, an even more powerful engine, an even more responsive transmission. V12 Vantage S – the most ferocious Aston Martin ever produced.",
                number: "9945162244"
            },
            {
                name: "bugattiVeyron",
                alt: "Bugatti Veyron",
                img: "bugatti-veyron-super-sport-.jpg",
                cost: "2.5 Million",
                description: "Since its launch in 2005, the Bugatti Veyron has been regarded as a supercar of superlative quality. It was a real challenge for developers to fulfil the specifications that the new supercar was supposed to meet: over 1,000 hp, a top speed of over 400 km/h and the ability to accelerate from 0 to 100 in under three seconds. Even experts thought it was impossible to achieve these performance specs on the road. But that was not all.",
                number: "9945162244"
            },
            {
                name: "ferrariSpider",
                alt: "Ferrari 458 Spider",
                img: "Ferrari-458-Spider-14.jpg",
                cost: "3.6 Million",
                description: "AN EFFORTLESS MARRIAGE OF TECHNOLOGY, DESIGN AND BEAUTY. The 458 Spider is the first car ever to combine a mid-rear engine with a retractable folding hard top that delivers both unprecedented in-cabin comfort when closed and unparalleled Spider performance.",
                number: "9945162244"
            },
            {
                name: "lamborghiniGallardo",
                alt: "Lamborghini Gallardor",
                img: "lamborghini-gallardo.jpg",
                cost: "600 Thousand",
                description: "The first generation Gallardo came with an even firing 5 litre 90 degree V10 (4961cc). The Gallardo offers two choices of transmissions, a conventional (H-Box) six-speed manual transmission, and an advanced six-speed electro-hydraulically controlled semi-automatic robotized manual, which Lamborghini abbreviates to E-gear. The E-gear allows the driver to make shifts much faster than they could with a manual transmission. The driver shifts up and down via paddles behind the steering wheel, but can also change to an automatic mode. The vehicle is designed by Luc Donckerwolke and was based on the 1995 Calà prototype by Italdesign Giugiaro.",
                number: "9945162244"
            },
            {
                name: "rollsRoyce",
                alt: "Rolls Royce",
                img: "rolls-royce.jpg",
                cost: "1.5 Million",
                description: "A commanding presence, Phantom Family encapsulates contemporary luxury. Its signature design is complemented by modern features, with the potential to personalise it to the smallest detail. Born of the desire to build The Best Car in the World, Phantom is the result of complete creative and engineering freedom. When it came to designing the current Phantom Family, it’s fitting that the influence came from Sir Henry Royce himself: “Strive for perfection in everything you do. Take the best that exists and make it better. When it doesn’t exist, design it.” From that challenge, Phantom was born. And the result is the definition of automotive design and technological perfection.",
                number: "9945162244"
            },
        ];
    }
}

