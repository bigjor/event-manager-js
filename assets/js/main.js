/* ----------------------------- REF 29 | Mòduls ---------------------------- */

// COMPONENTS
import calendar from './modules/calendar.js'

// SERVICES
import localdb from './services/localdb.js'
import api from './services/api/API.js'

// UTILS
import { getParam, setCookie, getCookie, deleteCookie } from './utils/utils.js'

// TESTS
import { apiTestExec } from './test/TestAPI.js'

/* --------------------- REF 10 | Funcions autoinvocades -------------------- */
(function() {

    /* --------------------------- REF 21 | use strict -------------------------- */
    'use strict';

    // GENERAL VARS
    window.test = arguments[1].test || false
    window.production = arguments[1].production || false
    window.name = arguments[0]
    window.app = {}

    // GENERAL FUNCTIONS

    /* ---------------------------- REF 7 | Funcions ---------------------------- */
    window.log = (text, ...args) => {
        let privileges = typeof args[args.length - 1] == 'boolean' ? args[args.length - 1] : false
        let opts = `color: #fff;
                    background: ${args[0] && typeof args[0] == 'string' ? args[0] : '#000'};
                    padding: ${args[1] && typeof args[1] == 'string' ? args[1] : '.15em'};
                    border-radius: ${args[2] && typeof args[2] == 'string' ? args[2] : '4px'};`
        if (!window.production || privileges) console.log(`%c${text}`, opts)
    }

    document.pageTransition = (oldPage, newPage) => {
        oldPage.style.opacity = 0
        oldPage.active = false
        setTimeout(() => {
            oldPage.style.display = 'none'
            newPage.style.display = 'block'
            newPage.style.opacity = 100
            newPage.active = true
        }, 200)
    }

    /* -------------------------------------------------------------------------- */
    /*                                 INICIO APP                                 */
    /* -------------------------------------------------------------------------- */

    /* --------------------- REF 20 | Registre d'events W3C --------------------- */
    window.addEventListener('DOMContentLoaded', function() {
        window.log(window.name || 'UNNAMED', 'orange', '.2em .6em', true)
        window.log('DOM LOADED', 'gray')


        /* ------------------------------- TESTS EXEC ------------------------------- */
        if (test) {
            window.log('EXECUTING TESTS', 'gray')
            apiTestExec()
        }
        
        /* ----------------------------- INICIO LOCALDB ----------------------------- */
        localdb.init()
        window.localdb = localdb

        /* ---------------------------------- PAGES --------------------------------- */
        let loginPage = document.getElementById('login-page')
        let loginPageErrors = document.getElementById('login-page-errors')

        let calendarPage = document.getElementById('calendar-page')
        let eventManagerPage = document.getElementById('event-manager-page')

        /* ----------------------------- LOGIN & SESSION ---------------------------- */
        if (getCookie('user')) 
            calendarPage.style.display = 'block'
        else
            loginPage.style.display = 'block'

        /* --------------------------- REF 14 | Selectors --------------------------- */
        let userInput = document.getElementsByName('user')[0]
        let passInput = document.getElementsByName('pass')[0]

        let btnLogin = document.getElementById('btnLogin')
        btnLogin.addEventListener('click', async function(event) {

            /* ---------------------------- REF 19 | Closure ---------------------------- */
            async function check() {
                let errors = []
                if (userInput.value.length < 1) {
                    errors.push('El usuario no debe estar vacío')
                }
                    
                if (passInput.value.length < 1) {
                    errors.push('La contraseña no debe estar vacía')
                    return errors
                }

                let API = api.create({ 
                    baseURL: 'http://localhost:3000',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                })

                /* ------------------------------ REF 27 | JSON ----------------------------- */
                let data = { user: userInput.value, pass: passInput.value }
                // NOT WORKING
                // let data = new FormData()
                // data.append('user', userInput.value)
                // data.append('pass', passInput.value)
                let result = await API.post('/login', JSON.stringify(data))
                console.log(result)
                if (!JSON.parse(result).logged) errors.push('Usuario o contraseña incorrectas')
                return errors  
            }

            /* ----------------------------- REF 5 | Arrays ----------------------------- */
            function drawErrors(errors = [], target) {
                if (!target) return
                console.log(errors)
                errors.forEach(error => {
                    let div = document.createElement('div')
                    div.className = 'error'
                    div.appendChild(document.createTextNode(error))
                    target.appendChild(div)
                })
            }
            
            loginPageErrors.innerHTML = ''
            event.preventDefault()
            let errors = await check()

            /* --------------------- REF 28 | Cookies i LocalStorage -------------------- */
            if (errors.length == 0) {
                setCookie('user', userInput.value, 1)
                document.pageTransition(loginPage, calendarPage)
            } else {
                drawErrors(errors, loginPageErrors)
            }
        })



        /* -------------------------------- CALENDAR -------------------------------- */
        let calendarHtml = document.getElementById('calendar')
        let dateText = document.getElementById('dateText')
        

        if (getParam('date')) 
            dateText.innerText = calendar.dateToString(calendar.setSelected(getParam('date')), '/')
        else
            dateText.innerText = calendar.dateToString(calendar.getSelected(), '/')
        
        calendar.setTarget(calendarHtml)
        calendar.draw(calendarHtml)
        

        let btnPrev = document.getElementById('btnPrev')
        btnPrev.addEventListener('click', function() {
            dateText.innerText = calendar.dateToString(calendar.prevMonth(), '/')
        })

        let btnNext = document.getElementById('btnNext')
        btnNext.addEventListener('click', function() {
            dateText.innerText = calendar.dateToString(calendar.nextMonth(), '/')
        })

        let btnNew = document.getElementById('btnNew')
        btnNew.addEventListener('click', function() {
            document.pageTransition(calendarPage, eventManagerPage)
            document.querySelectorAll('.form-title h2').forEach(node => {
                if (eventManagerPage.contains(node)) {
                    node.textContent = 'Nuevo evento'
                }
            })
        })

        let btnExit = document.getElementById('btnExit')
        btnExit.addEventListener('click', function() {
            deleteCookie('user')
            document.pageTransition(calendarPage, loginPage)
        })

        /* ------------------------------ EVENT MANAGER ----------------------------- */
        let btnAddEvent = document.getElementById('btnAddEvent')
        btnAddEvent.addEventListener('click', function(event) {
            event.preventDefault()

            if (eventReactive.event != null) {
                if (typeof eventReactive.event.object.date == 'string') {
                    let year = 0
                    let month = 0
                    let day = 0
    
                    eventReactive.event.object.date.split('-').forEach((item, index) => {
                        if (index == 0) year = parseInt(item)
                        if (index == 1) month = parseInt(item)
                        if (index == 2) day = parseInt(item)
                    })
                    
                    let dateObj = new Date(year, month - 1, day)
                    eventReactive.event.object.date = dateObj
                }

                calendar.editEvent(eventReactive.event.id, eventReactive.event.object)
                
                eventReactive.event = null
                removeListeners();
                document.pageTransition(eventManagerPage, calendarPage)
                return;
            }


            let form = document.querySelector('form#event-manager')
            let id = form[0].value
            let title = form[1].value
            let description = form[2].value
            let date = form[3].value
            let color = form[4].value
            
            
            let year = 0
            let month = 0
            let day = 0

            date.split('-').forEach((item, index) => {
                if (index == 0) year = parseInt(item)
                if (index == 1) month = parseInt(item)
                if (index == 2) day = parseInt(item)
            })
            
            
            let dateObj = new Date(year, month - 1, day)
            
            let eventObj = {
                title,
                description,
                color,
                date: dateObj
            }

            calendar.addEvent(eventObj)
            document.pageTransition(eventManagerPage, calendarPage)
        });

        /* ---------------------- REF 17 | Formularis reactius ---------------------- */
        var eventReactive = {
            eventInternal: null,
            eventListener: function(val) {},
            set event(val) {
              this.eventInternal = val
              this.eventListener(val)
            },
            get event() {
              return this.eventInternal
            },
            registerListener: function(listener) {
              this.eventListener = listener
            }
        }
    
        eventReactive.registerListener(function(val) {
            if (eventManagerPage.active != true) {
                document.pageTransition(calendarPage, eventManagerPage)
                
                document.querySelectorAll('.form-title h2').forEach(node => {
                    if (eventManagerPage.contains(node)) {
                        node.textContent = 'Editar evento'
                    }
                })

                let form = document.querySelector('form#event-manager')
                for (let field of form) {
                    let prop = field.name
                    if (field.name == prop) {
                        if (field.type == 'date')
                            field.value = calendar.dateToString(eventReactive.event.object[prop], '-', true)
                        if (field.type == 'text' || field.type == 'select')
                            field.value = eventReactive.event.object[prop]
                    }
                    field.addEventListener('change', (value) => {
                        eventReactive.event.object[prop] = value.target.value
                    })
                }
            }
        });

        function removeListeners() {
            let form = document.querySelector('form#event-manager')
            for (let field of form) 
                field.removeEventListener('change', null, false)
        }
    
        window.app.eventReactive = eventReactive
        
    })


    
    

})('EVENTS APP | JORDAN', { test: false, production: false })