document.addEventListener('DOMContentLoaded', async () => {
    var TIMER_PARAGRAPH = document.getElementById('timer');

    if (!TIMER_PARAGRAPH)
        return;
    else {
        const datetime = new Date().toLocaleString();

        TIMER_PARAGRAPH.innerHTML = datetime;

        setInterval(async () => await __uptDtUtc(), 1000);
    }
});

async function __uptDtUtc() {
    var TIMER_PARAGRAPH = document.getElementById('timer');

    const datetime = new Date().toLocaleString();

    TIMER_PARAGRAPH.innerHTML = datetime;
}
