import events from './tables/events.js'

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
    init: async function() {
        if (this.reqEventManagerApp) return

        console.log('localdb | init')

        let emit = document.createEvent('Event')
        emit.initEvent('onMountedDB', true, true);

        this.reqEventManagerApp = indexedDB.open('App', VERSION)

        this.reqEventManagerApp.onerror = function(event) {
            console.log('reqEventManagerApp | Error db!! | ' + event)
        }
        this.reqEventManagerApp.onsuccess = function(event) {
            this.db = this.result
            document.dispatchEvent(emit);
            console.log('reqEventManagerApp | dbopen | ' + this.db)
        }
        this.reqEventManagerApp.onupgradeneeded = function(event) {
            console.log('reqEventManagerApp | onupgradeneeded | ' + event)
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
