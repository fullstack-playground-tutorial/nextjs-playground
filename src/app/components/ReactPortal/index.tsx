import { ReactNode, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"

interface Props {
    children: ReactNode,
    wrapperId: string,
}

function createWrapperAndAppendToBody(wrapperId: string): HTMLElement {
    const wrapperElement = document.createElement('div')
    wrapperElement.setAttribute("id", wrapperId)
    document.body.appendChild(wrapperElement)
    return wrapperElement
}

function ReactPortal({ children, wrapperId }: Props) {
    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null)
    let systemCreated = false
    
    useLayoutEffect(() => {
        let element = document.getElementById(wrapperId)
        if (element == null) {
            element = createWrapperAndAppendToBody(wrapperId)
        }
        setWrapperElement(element)
        return () => {
            if (systemCreated && element?.parentNode) {
                element.parentNode.removeChild(element)
            }
        }
    }, [wrapperId])

    if (wrapperElement === null) return null
    return createPortal(children, wrapperElement)
}

export default ReactPortal