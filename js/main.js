const REGULAR_EMAIL = /^[^@]+@\w+(\.\w+)+\w$/;

document.addEventListener("DOMContentLoaded", () => {
    const timer = document.querySelector('.timer');
    const sendForm = document.querySelector('#mail_form');
    const popup = document.querySelector('.popup');

    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') closePopup(popup);
    })

    popup.querySelector('.popup_back').addEventListener('click', () => closePopup(popup))
    popup.querySelectorAll('.popup_close').forEach((btn) => {
        btn.addEventListener('click', () => closePopup(popup));
    })

    sendForm.addEventListener('submit', (event) => sendMail(event, sendForm, popup));

    setTimer(timer);
});

function getNormalizedRemaining(remaining) {
    const seconds = Math.floor(remaining / 1000) % 60;
    const minutes = Math.floor(remaining / 1000 / 60) % 60;
    const hours = Math.floor(remaining / 1000 / 60 / 60) % 24;
    const days = Math.floor(remaining / 1000 / 60 / 60 / 24);

    return {
        seconds,
        minutes,
        hours,
        days
    };
}

function getTimeRemaining(date) {
    const now = new Date();
    const remaining = date - now;

    return remaining > 0 ? getNormalizedRemaining(remaining) : getNormalizedRemaining(0);
}

function setTimer(timerNode) {
    const [day, month, year] = timerNode.getAttribute('data-targetDate').split('-');
    const date = new Date(+year, +month - 1, +day)

    const days = timerNode.querySelector('.days');
    const hours = timerNode.querySelector('.hours');
    const minutes = timerNode.querySelector('.minutes');
    const seconds = timerNode.querySelector('.seconds');

    const remaining = getTimeRemaining(date);

    days.textContent = '' + remaining.days;
    hours.textContent = remaining.hours >= 10 ? '' + remaining.hours : '0' + remaining.hours;
    minutes.textContent = remaining.minutes >= 10 ? '' + remaining.minutes : '0' + remaining.minutes;
    seconds.textContent = remaining.seconds >= 10 ? '' + remaining.seconds : '0' + remaining.seconds;

    setTimeout(() => setTimer(timerNode), 1e3);
}

function closePopup(popupNode) {
    popupNode.classList.remove('active');
}

function openPopup(popupNode, parameters) {
    popupNode.querySelector('.popup_title').textContent = parameters.title || ' ';
    popupNode.querySelector('.popup_text').textContent = parameters.text || ' ';
    popupNode.classList.add('active');
}

function sendMail(evt, sendForm, resultNode) {
    evt.preventDefault();

    const email = sendForm.email.value;

    if (!REGULAR_EMAIL.test(email)) {
        const params = {
            title: 'Oops!',
            text: 'Email you entered isn\'t valid',
        }

        openPopup(resultNode, params);
        return;
    }

    openPopup(resultNode, {title: 'sending...'});

    fetch("https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-rapidapi-host": "rapidprod-sendgrid-v1.p.rapidapi.com",
            "x-rapidapi-key": "709c9481b3msh63cc2969d037d98p1f5a90jsn255f9e3036f9",
        },
        body: {
            "personalizations": [
                {
                    "to": [{"email": email}],
                    "subject": "Event inviting"
                }
            ],
            "from": {
                "email": "from_address@example.com"
            },
            "content": [
                {
                    "type": "text/plain",
                    "value": "Hi! We wanna invite you to our event: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                }
            ]
        }
    })
        .then(() => openPopup(resultNode, {
                title: 'Success!',
                text: 'You have successfully subscribed to the email newsletter',
            })
        )
        .catch(() => openPopup(resultNode, {
                title: 'Error:(',
                text: 'We can\'t send your data',
            })
        )
}
