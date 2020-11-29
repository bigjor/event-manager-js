class ItemEvent {
    constructor(title, date) {
        this.title = title
        this.date = date
    }
}

class CustomItemEvent extends ItemEvent {
    constructor(title, description, date, color) {
        super(title, date);
        this.description = description
        this.color = color 
    }

    from(event) {
        this.title = event.title
        this.description = event.description
        this.date = event.date
        this.color = event.color
        return this
    }
}

class Calendar {
    constructor() {
        this.events = []
        this.today = new Date()
        this.target = undefined
        this.current = this.today
        this.selected = this.current
    }

    firstDayOfWeek(month, year) {
        let number = new Date(month, year, 1).getDay()
        return number == 0 ? 7 : number - 1
    }

    daysInMonth(month, year) { 
        return new Date(year, month, 0).getDate();
    }
    
    isSameDate(date, otherDate = undefined) {
        if (!otherDate) otherDate = new Date()
        return  date.getFullYear() == otherDate.getFullYear() &&
                date.getMonth() == otherDate.getMonth() &&
                date.getDate() == otherDate.getDate()  
    }
    
    draw(element = undefined) {
        if (element) this.target = element
        if (!this.target) return
        this.target.innerHTML = ''
        let year = this.selected.getFullYear()
        let month = this.selected.getMonth() + 1
        
        // DRAW DAY BOX
        for (let day = 1; day <= this.daysInMonth(month, year); day++) {
            let date = new Date(year, month - 1, day)
            let container = document.createElement('div')
            container.setAttribute('ref', this.dateToString(date))
            let number = document.createElement('div')
            number.className = 'number'
            number.appendChild(document.createTextNode(day))
            if (this.isSameDate(date, this.selected))
                number.className = 'selected'
            if (this.isSameDate(date))
                number.className = 'current'
            container.className = 'item-day'
            container.appendChild(number)
    
            for(let ev of this.events) {
                if (!this.isSameDate(date, ev.object.date)) continue;
                let divEvent = document.createElement('div')
                divEvent.className = 'event'
                divEvent.style.background = ev.object.color
                divEvent.innerText = ev.object.title
                container.appendChild(divEvent)
            }
    
            container.addEventListener('click', () => {
                this.selected = new Date(year, month - 1, day)
                Object.values(container.parentElement.children).forEach(item => {
                    if (item.getAttribute('ref')) 
                        if (item.getAttribute('ref') == this.dateToString(date) && this.isSameDate(date))
                            item.children[0].className = 'current'
                        else if (item.getAttribute('ref') == container.getAttribute('ref'))
                            item.children[0].className = 'selected'
                        else
                            item.children[0].className = 'number'
                })
            })
    
            this.target.appendChild(container)
    
        }
    }
       
    
    nextMonth() {
        let currentMonth = this.selected.getMonth()
        let currentYear = this.selected.getFullYear()
        let month = null
        let year = null
        
        if (currentMonth == 11) {
            year = currentYear + 1
            month = 0
        } else {
            year = currentYear
            month = currentMonth + 1
        }
    
        this.selected = new Date(year, month, 1)
        this.draw()

        return this.selected
    }

    prevMonth() {
        let currentMonth = this.selected.getMonth()
        let currentYear = this.selected.getFullYear()
        let month = null
        let year = null

        if (currentMonth == 0) {
            year = currentYear - 1
            month = 11
        } else {
            year = currentYear
            month = currentMonth - 1
        }

        this.selected = new Date(year, month, 1)
        this.draw()
        return this.selected
    }
    
    dateToString(date, delimiter = '-') {
        if (!date) return ''
        let day = date.getDate();
        let month = date.getMonth() + 1;
        return `${day < 10 ? '0' + day : day}${delimiter}${month < 10 ? '0' + month : month}${delimiter}${date.getFullYear()}`
    }

    setTarget(element) {
        this.target = element  
    }

    getTarget() {
        return this.target
    }

    addEvent(event) {
        let { title, description, date, color } = event

        color = color == 'random' ? this.randomColor() : color 
        
        let newEvent = new CustomItemEvent(title, description, date, color)
        
        window.localdb.createEvent(this.uuidv4(), event)
        this.updateEvents()
    }

    setSelected(date) {
        let dateObj = new Date()  
        date.split('-').forEach((item, index) => {
            if (index == 0) dateObj.setFullYear(parseInt(item))
            if (index == 1) dateObj.setMonth(parseInt(item) - 1)
            if (index == 2) dateObj.setDate(parseInt(item))
        })
        this.selected = dateObj
        return this.selected
    }

    getToday() {
        return this.today
    }

    getSelected() {
        return this.selected
    }

    updateEvents() {
        let getEvents = window.localdb.getEventAllObject()
        getEvents.onsuccess = () => {
            this.events = getEvents.result
            this.draw()
        }
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    randomColor() {
        return '#xxxxxx'.replace(/[x]/g, function(c) {
            let r = Math.random() * 16 | 0, v = r;
            return v.toString(16);
        });
    }
    
    
}

const calendar = new Calendar()

/* -------------------------------------------------------------------------- */
/*                             ONMOUNTED DATABASE                             */
/* -------------------------------------------------------------------------- */
document.addEventListener('onMountedDB', function() {
    calendar.updateEvents()
})

export default calendar