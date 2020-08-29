const dom = {
    create(htmlString) {
        /* 此处需用template标签，否则某些标签会出问题，比如td */
        let template = document.createElement('template')
        template.innerHTML = htmlString.trim()
        return template.content.firstChild
    },
    after(node, nextNode) {
        node.parentNode.insertBefore(nextNode, node.nextSibling)
    },
    before(node, prevNode) {
        node.parentNode.insertBefore(prevNode, node)
    },
    append(parentNode, node) {
        parentNode.append(node)
    },
    wrap(node, parentNode) {
        dom.before(node, parentNode)
        dom.append(parentNode, node)
    },
    remove(node) {
        node.parentNode.removeChild(node)
        return node
    },
    empty(node) {
        const result = []
        let current = node.firstChild
        while(current) {
            result.push(dom.remove(current))
            current = node.firstChild
        }
    },
    attr(node, name, value) {
        if (arguments.length === 2) {
            return node.getAttribute(name)
        } else if (arguments.length === 3) {
            node.setAttribute(name, value)
        }
    },
    text(node, text) {
        // 兼容IE8
        if (arguments.length === 2) {
            'innerText' in node ? node.innerText = text : node.textContent = text
        } else if (arguments.length === 1) {
            return 'innerText' in node ? node.innerText : node.textContent
        }
    },
    html(node, htmlString) {
        if (arguments.length === 2) {
            node.innerHTML = htmlString
        } else if (arguments.length === 1) {
            return node.innerHTML
        }
    },
    style(node, name, value) {
        if (arguments.length === 3) {
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                return node.style[name]
            } else if(name instanceof Object) {
                // 对象形式设置
                const styleObject = name
                for (let key in styleObject) {
                    node.style[key] = styleObject[key]
                }
            }
        }
    },
    class: {
        add(node, className) {
            node.classList.add(className)
        },
        remove(node, className) {
            node.classList.remove(className)
        },
        has(node, className) {
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
    },
    parent(node) {
        return node.parentNode
    },
    children(node) {
        return node.children
    },
    siblings(node) {
        return Array.from(node.parentNode.children).filter(n => n !== node)
    },
    next(node) {
        // 过滤 TEXT_NODE
        let current = node.nextSibling
        while(current && current.nodeType === 3) {
            current = current.nextSibling
        }
        return current
    },
    previous(node) {
        // 过滤 TEXT_NODE
        let current = node.previousSibling
        while(current && current.nodeType === 3){
            current = current.previousSibling
        }
        return current
    },
    each(nodes, fn) {
        for (let i = 0; i < nodes.length; i++) {
            fn.call(null, nodes[i])
        }
    },
    index(node) {
        const list = dom.children(node.parentNode)
        let i
        for (i = 0; i < list.length; i ++) {
            if (list[i] === node) {
                break
            }
        }
        return i
    }
}

window.dom = dom