const REGULAR_EMAIL = /^[^@]+@\w+(\.\w+)+\w$/;

document.addEventListener("DOMContentLoaded", () => {
    const timer = document.querySelector('.timer');
    const sendForm = document.querySelector('.sendmail_form');
    const popup = document.querySelector('.popup');

    popup.querySelector('.popup_back').addEventListener('click', () => closePopup(popup))

    popup.querySelectorAll('.popup_close').forEach((btn) => {
        btn.addEventListener('click', () => closePopup(popup));
    })

    sendForm.addEventListener('submit', sendMail);

    async function sendMail(evt) {
        evt.preventDefault();

        const sendInput = sendForm.querySelector('.form_input');

        if (!REGULAR_EMAIL.test(sendInput.value)) {
            const params = {
                title: 'Ahtung!',
                text: 'Email you entered isn\'t valid',
            }

            openPopup(popup, params);
        }


    }

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
    popupNode.querySelector('.popup_title').textContent = parameters.title;
    popupNode.querySelector('.popup_text').textContent = parameters.text;

    popupNode.classList.add('active');
}

