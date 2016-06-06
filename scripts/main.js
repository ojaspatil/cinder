window.onload = function () {
    var cars = getCarsData();
    var mover = false, x, y, posx, posy, first = true;

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

