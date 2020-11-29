/**
 * Nombre de la tabla, que es importada en la constante TABLES para crearlas en el init
 * Table name, which is imported in the constant TABLES to create them in init
 */
const EVENTS = 'Events'
/**
 * Propiedad auto_increment define si el id de la table se sumara en +1 por registro
 * Auto_increment property defines if the table id will be added by +1 per record
 */
const AUTO_INCREMENT = true
/**
 * Metodos CRUD de la tabla
 * Table methods CRUD
 */
const table_events = {
  name: EVENTS,
  auto_increment: AUTO_INCREMENT,
  // INSERT [OBJECT]
  createEvent(id, object, okfn = undefined, nokfn = undefined) {
    let tx = this.reqEventManagerApp.db.transaction(EVENTS, 'readwrite')
    let store = tx.objectStore(EVENTS)

    let obj = { id, object }
    let requestUpdate = store.put(obj)

    requestUpdate.onerror = function(event) {
      if (nokfn) nokfn(event)
    }
    requestUpdate.onsuccess = function(event) {
      console.log('createEvent | ' + event)
      if (okfn) okfn()
    }
  },
  // INSERT [ARRAY]
  createEvents(events, okfn = undefined, nokfn = undefined) {
    if (events == null) return
    let tx = this.reqEventManagerApp.db.transaction(EVENTS, 'readwrite')
    let store = tx.objectStore(EVENTS)
    for (let event of events) {
      let obj = event

      console.log(obj)

      let requestUpdate = store.put(obj)

      requestUpdate.onerror = function(event) {
        if (nokfn) nokfn(event)
      }
      requestUpdate.onsuccess = function(event) {
        console.log('createEvent | ' + event)
        if (okfn) okfn()
      }
    }
  },
  // SELECT + WHERE ID =
  getEvent(id) {
    let tx = this.reqEventManagerApp.db.transaction(EVENTS, 'readwrite')
    let store = tx.objectStore(EVENTS)

    return store.get(id)
  },
  // SELECT ALL KEYS FROM TABLE
  getEventAll(okfn = undefined, nokfn = undefined) {
    let tx = this.reqEventManagerApp.db.transaction(EVENTS, 'readwrite')
    let store = tx.objectStore(EVENTS)
    this.onerror = function(event) {
      if (nokfn) nokfn(event)
    }
    this.onsuccess = function(event) {
      console.log('getEventAll | ' + event)
      if (okfn) okfn()
    }
    return store.getAllKeys()
  },
  // SELECT * FROM TABLE
  getEventAllObject(okfn = undefined, nokfn = undefined) {
    let tx = this.reqEventManagerApp.db.transaction(EVENTS, 'readwrite')
    let store = tx.objectStore(EVENTS)
    this.onerror = function(event) {
      if (nokfn) nokfn(event)
    }
    this.onsuccess = function(event) {
      console.log('getEventAllObject | ' + event)
      if (okfn) okfn()
    }
    return store.getAll()
  },
  // DELETE + WHERE ID =
  deleteEvent(id) {
    let tx = this.reqEventManagerApp.db.transaction(EVENTS, 'readwrite')
    let store = tx.objectStore(EVENTS)
    store.delete(id)
  },
  // DELETE ALL ROWS (CLEAN TABLE)
  dropEvents() {
    let self = this
    let events = this.getEventAllObject()
    return new Promise(function(resolve, reject) {
      events.onsuccess = function(event) {
        let arrayEvents = event.target.result
        for (let i = 0; i < arrayEvents.length; i++) {
          // TODO: Comprobar si hay que eliminar
          self.deleteEvent(arrayEvents[i].id)
        }
        resolve('success')
      }
      events.onerror = function(event) {
        reject(event)
      }
    })
  }
}

export default table_events
