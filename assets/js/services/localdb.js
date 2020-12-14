import events from './tables/events.js'

/* ---------------------- REF 4 | Variables let i const --------------------- */

const VERSION = 1
const TABLES = {
  EVENTS: {
    name: events.name,
    auto_increment: events.auto_increment
  }
}



const localAppBD = {
    db: undefined,
    /* -------------------------------------------------------------------------- */
    /*                              DB: EVENTMANAGER                              */
    /* -------------------------------------------------------------------------- */
    reqEventManagerApp: undefined,
    init: function() {
        if (this.reqEventManagerApp) return

        window.log('localdb | init'.toUpperCase(), 'gray')

        let emit = document.createEvent('Event')
        emit.initEvent('onMountedDB', true, true);

        this.reqEventManagerApp = indexedDB.open('App', VERSION)

        this.reqEventManagerApp.onerror = function(event) {
            window.log('reqEventManagerApp | Error db!! | '.toUpperCase() + event, 'red')
        }
        this.reqEventManagerApp.onsuccess = function(event) {
            this.db = this.result
            document.dispatchEvent(emit);
            window.log('reqEventManagerApp | dbopen | '.toUpperCase() + this.db, 'green')
        }
        this.reqEventManagerApp.onupgradeneeded = function(event) {
            window.log('reqEventManagerApp | onupgradeneeded | ' + event, 'blue')
            for (let table of Object.values(TABLES)) {
                event.currentTarget.result.createObjectStore(table.name, {
                    keyPath: 'id',
                    autoIncrement: table.auto_increment
                })
            }
        }
  },

  /* -------------------------------------------------------------------------- */
  /*                           METHODS TABLE: Events                            */
  /* -------------------------------------------------------------------------- */
  ...events
}

export default localAppBD
