/* ------------------------- REF 22 | XMLhttpRequest ------------------------ */
/* ---------------------------- REF 25 | API REST --------------------------- */
class API {
    constructor(baseURL, withCredentials, headers) {
        this.baseURL = baseURL
        this.headers = headers
        this.request = new XMLHttpRequest()
        this.request.withCredentials = withCredentials || false
    }

    /* ---------------------------- REF 1 | Objectes ---------------------------- */
    create(opts) {
        let baseURL = opts.baseURL || 'http://localhost'
        let headers = opts.headers || {}
        let withCredentials = opts.withCredentials || false
        let instance = new API(baseURL, withCredentials, headers)
        return instance
    }

    post(path = '', body = null) {
        this.request.open('POST', `${this.baseURL}${path}`, true); 
        for (const header in this.headers) {
            this.request.setRequestHeader(header, this.headers[header])    
        }
        let promise = new Promise((resolve, reject) => {
            this.request.onreadystatechange = function (event) {
                if (event.target.readyState == 4) 
                    if(event.target.status == 200)
                        resolve(event.target.response)
                        return
                  
                reject(event)
            }
        })
        this.request.send(body)
        return promise
    }

    get(path = '', body = null) {
        this.request.open('GET', `${this.baseURL}${path}`, true); 
        for (const header in this.headers) {
            this.request.setRequestHeader(header, this.headers[header])    
        }

        /* ---------------------------- REF 26 | Promises --------------------------- */
        let promise = new Promise((resolve, reject) => {
            this.request.onreadystatechange = function (event) {
                if (event.target.readyState == 4) 
                    if(event.target.status == 200)
                        resolve(event.target.response)
                        return
                  
                reject(event)
            }
        })
        this.request.send(body); 
        return promise
    }
}

export default new API()