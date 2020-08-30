window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
    let elements  // 围绕操作elements
    if (typeof selectorOrArrayOrTemplate === 'string') {
        if (selectorOrArrayOrTemplate[0] === '<') {
            // create
            elements = [createElement(selectorOrArrayOrTemplate)]
        } else {
            elements = document.querySelectorAll(selectorOrArrayOrTemplate)
        }
    } else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate
    }

    function createElement(htmlString) {
        /* 此处需用template标签，否则某些标签会出问题，比如td */
        let template = document.createElement('template')
        template.innerHTML = htmlString.trim()
        return template.content.firstChild
    }

    const api = Object.create(jQuery.prototype)

    Object.assign(api, {
        elements: elements,
        /* oldApi 新构造的jQuery对象才有，处理部分链式操作问题 */
        oldApi: selectorOrArrayOrTemplate.oldApi
    })

    return api
}

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    jquery: true, //标识是jquery构造的对象
    get(index) {
        return this.elements[index]
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el))
        } else if (this.jquery === true) {
            this.each(el => node.get(0).appendChild(el))
        }
    },
    append(children) {
        if (children instanceof Element) {
            this.each(el => this.get(0).appendChild(children))
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i])
            }
        } else if (children.jquery === true) {
            children.each(node => this.get(0).appendChild(node))
        }
    },
    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i)
        }
    },
    find(selector) {
        let array = []
        this.each(node => {
            array = array.concat(Array.from(node.querySelectorAll(selector)))
        })
        array.oldApi = this // 保存旧的api
        return jQuery(array)
    },
    parent() {
        const array = []
        this.each(node => {
            if (array.indexOf(node.parentNode) === -1) {
                array.push(node.parentNode)
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    children() {
        const array = []
        this.each(node => {
            if (array.indexOf(node.parentNode) === -1) {
                array.push(...node.children)
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    addClass(className) {
        this.each(node => {
            node.classList.add(className)
        })
    },
    end() {
        return this.oldApi // 返回上一层
    },
    on(eventName, fn) {
        this.each(node => {
            node.addEventListener(eventName, fn)
        })
    },
    off(eventName, fn) {
        this.each(node => {
            node.removeEventListener(eventName, fn)
        })
    }
}