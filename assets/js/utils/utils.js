export function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
}

export function getCookie(name) {
    let nameEQ = name + '='
    let ca = document.cookie.split(';')
  
    for(let c of ca) {
        while (c.charAt(0) == ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  
    return null
}

export function deleteCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getParam(param) {
    let result = null, entry = []
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            entry = item.split("=")
            if (entry[0] == param) 
                result = decodeURIComponent(entry[1])
            
        })
    return result
}