// GLOBAL VARS
let target = undefined
let current = new Date()
let selected = current
let events = []
// METHODS
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function firstDayOfWeek(month, year) {
    let number = new Date(month, year, 1).getDay()
    return number == 0 ? 7 : number - 1
}

function isSameDate(date, otherDate = undefined) {
    if (!otherDate) otherDate = new Date()
    return  date.getFullYear() == otherDate.getFullYear() &&
            date.getMonth() == otherDate.getMonth() &&
            date.getDate() == otherDate.getDate()
}

function dateToString(date, delimiter = '-') {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    return `${day < 10 ? '0' + day : day}${delimiter}${month < 10 ? '0' + month : month}${delimiter}${date.getFullYear()}`
}

function setTarget(element) {
    target = element
}

function newSpacer() {
    let container = document.createElement('div')
    container.className = 'item-day'
    return container
}

function draw(element = undefined) {
    if (element) target = element
    target.innerHTML = ''
    let year = selected.getFullYear()
    let month = selected.getMonth() + 1
    
    // DRAW DAY BOX
    for (let day = 1; day <= daysInMonth(month, year); day++) {
        let date = new Date(year, month - 1, day)
        let container = document.createElement('div')
        container.setAttribute('ref', dateToString(date))
        let number = document.createElement('div')
        number.className = 'number'
        number.appendChild(document.createTextNode(day))
        if (calendar.isSameDate(date, selected))
            number.className = 'selected'
        if (calendar.isSameDate(date))
            number.className = 'current'
        container.className = 'item-day'
        container.appendChild(number)

        for(let ev of events) {
            if (!isSameDate(date, ev.object.date)) continue;
            window.log(date + ", " + ev.object.date)
            let divEvent = document.createElement('div')
            divEvent.className = 'event'
            divEvent.style.background = ev.object.color
            divEvent.innerText = ev.object.title
            container.appendChild(divEvent)
        }

        container.addEventListener('click', function() {
            selected = new Date(year, month - 1, day)
            Object.values(container.parentElement.children).forEach(item => {
                if (item.getAttribute('ref')) 
                    if (item.getAttribute('ref') == dateToString(date) && isSameDate(date))
                        item.children[0].className = 'current'
                    else if (item.getAttribute('ref') == container.getAttribute('ref'))
                        item.children[0].className = 'selected'
                    else
                        item.children[0].className = 'number'
            })
        })

        target.appendChild(container)

    }
}

function nextMonth() {
    let currentMonth = selected.getMonth()
    let currentYear = selected.getFullYear()
    // let currentDay = selected.getDate()
    let month = null
    let year = null
    
    if (currentMonth == 11) {
        year = currentYear + 1
        month = 0
    } else {
        year = currentYear
        month = currentMonth + 1
    }
    
    // let days = daysInMonth(month, year)
    selected = new Date(year, month, 1)
    draw()

    return selected
}

function prevMonth() {
    let currentMonth = selected.getMonth()
    let currentYear = selected.getFullYear()
    // let currentDay = selected.getDate()
    let month = null
    let year = null

    if (currentMonth == 0) {
        year = currentYear - 1
        month = 11
    } else {
        year = currentYear
        month = currentMonth - 1
    }

    // let days = daysInMonth(month, year)
    selected = new Date(year, month, 1)
    draw()

    return selected
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function randomColor() {
    return '#xxxxxx'.replace(/[x]/g, function(c) {
        let r = Math.random() * 16 | 0, v = r;
        return v.toString(16);
    });
}

function updateEvents() {
    let getEvents = localdb.getEventAllObject()
    getEvents.onsuccess = () => {
        events = getEvents.result
        draw()
    }
}

function setSelected(date) {
    let dateObj = new Date()  
    date.split('-').forEach((item, index) => {
        if (index == 0) dateObj.setFullYear(parseInt(item))
        if (index == 1) dateObj.setMonth(parseInt(item) - 1)
        if (index == 2) dateObj.setDate(parseInt(item))
    })
    selected = dateObj
    return selected
}

/* -------------------------------------------------------------------------- */
/*                             ONMOUNTED DATABASE                             */
/* -------------------------------------------------------------------------- */
document.addEventListener('onMountedDB', function() {
    updateEvents()
})

function addEvent(event) {
    console.log(event.date)
    event.color = (event.color == 'random') ? randomColor() : event.color 
    localdb.createEvent(uuidv4(), event)
    updateEvents()
}

const calendar = {
    firstDayOfWeek: (month, year) => firstDayOfWeek(month, year),
    daysInMonth: (month, year) => daysInMonth(month, year),
    isSameDate: (date, otherDate) => isSameDate(date, otherDate),
    draw: element => draw(element),
    nextMonth: () => nextMonth(),
    prevMonth: () => prevMonth(),
    dateToString: (date, delimiter) => dateToString(date, delimiter),
    setTarget: element => setTarget(element),
    addEvent: event => addEvent(event),
    setSelected: date => setSelected(date),
    today: new Date(),
    selected: selected
}

export default calendar