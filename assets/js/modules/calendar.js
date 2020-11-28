// GLOBAL VARS
let target = undefined
let current = new Date()
let selected = current
// METHODS
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function dayOfWeek(month, year) {
    return new Date(month, year, 1).getDay();
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

function draw(element = undefined) {
    if (element) target = element
    target.innerHTML = ''
    let year = selected.getFullYear()
    let month = selected.getMonth()
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

        container.addEventListener('click', function() {
            selected = new Date(year, month, day)
            Object.values(container.parentElement.children).forEach(item => {
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
    let month = null
    let year = null

    if (currentMonth == 11) {
        year = currentYear + 1
        month = 0
    } else {
        year = currentYear
        month = currentMonth + 1
    }

    selected = new Date(year, month, 1)
    draw()

    return selected
}

function prevMonth() {
    let currentMonth = selected.getMonth()
    let currentYear = selected.getFullYear()
    let month = null
    let year = null

    if (currentMonth == 0) {
        year = currentYear - 1
        month = 11
    } else {
        year = currentYear
        month = currentMonth - 1
    }

    selected = new Date(year, month, 1)
    draw()

    return selected
}

const calendar = {
    dayOfWeek: (month, year) => dayOfWeek(month, year),
    daysInMonth: (month, year) => daysInMonth(month, year),
    isSameDate: (date, otherDate) => isSameDate(date, otherDate),
    draw: element => draw(element),
    nextMonth: () => nextMonth(),
    prevMonth: () => prevMonth(),
    dateToString: (date, delimiter) => dateToString(date, delimiter),
    setTarget: element => setTarget(element),
    today: new Date(),
    selected: selected
}

export default calendar