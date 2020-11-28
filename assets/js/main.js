import calendar from './modules/calendar.js'

// GENERAL FUNCTIONS
window.log = (text, ...args) => {
    let opts = `color: #fff;
                background: ${args[0] ? args[0] : '#000'};
                padding: ${args[1] ? args[1] : '.15em'};
                border-radius: ${args[2] ? args[2] : '4px'};`
    console.log(`%c${text}`, opts)
}

window.addEventListener('DOMContentLoaded', function() {
    console.log("DOM LOADED")
    
    let calendarHtml = document.getElementById('calendar')
    calendar.draw(calendarHtml)
    
    let dateText = document.getElementById('dateText')

    let btnPrev = document.getElementById('btnPrev')
    btnPrev.addEventListener('click', function() {
        dateText.innerText = calendar.dateToString(calendar.prevMonth(), '/')
    })

    let btnNext = document.getElementById('btnNext')
    btnNext.addEventListener('click', function() {
        dateText.innerText = calendar.dateToString(calendar.nextMonth(), '/')
    })
  
})