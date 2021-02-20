/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import './index.scss'

const change = msg => {
    document.querySelector('body').innerText = msg
}

document.querySelector('body').innerText = 'Hello, World!'

setTimeout(() => {
    change('Deferred hello world!')
}, 3000)
