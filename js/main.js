const days = document.querySelector('.days');
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const timer = document.querySelector('.timer');

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

    const remaining = getTimeRemaining(date);


    days.textContent = '' + remaining.days;
    hours.textContent = remaining.hours >= 10 ? '' + remaining.hours : '0' + remaining.hours;
    minutes.textContent = remaining.minutes >= 10 ? '' + remaining.minutes : '0' + remaining.minutes;
    seconds.textContent = remaining.seconds >= 10 ? '' + remaining.seconds : '0' + remaining.seconds;

    setTimeout(() => setTimer(timerNode), 1e3);

}

setTimer(timer);