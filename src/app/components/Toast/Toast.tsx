"use client";
import { useContext } from "react"
import { AlertContext } from "../../core/client/store/alert/AlertContext";

export const showAlert = (alertContext: AlertContext | undefined, title: string, message: string, onClose?: () => void) => {
    alertContext?.setAlertState({
        message: message,
        title: title,
        onClose: onClose,
        visible: true
    })
}

function AlertModal() {
    const alertContext = useContext(AlertContext)
    const onCloseModal = (e: React.MouseEvent) => {
        e.preventDefault()
        alertContext?.setAlertState({ ...alertContext?.alertState, visible: false })
        alertContext?.alertState?.onClose && alertContext?.alertState?.onClose()
    }


    const contentModal = alertContext?.alertState?.visible ?
        <div id="toast-modal" aria-labelledby="modal-title" role="dialog" tabIndex={-1} aria-modal={true}>
            <div className="fixed inset-0 bg-transparent bg-opacity-75 transition-opacity"></div>
            <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full max-h-full md:inset-0" >
                <div className="relative w-full max-w-xs max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex rounded-t-lg bg-red-500 p-4">
                            <div className="my-auto mx-auto flex text-center rounded-full w-8 h-8 border-white border-2 text-white items-center justify-center">!</div>
                        </div>
                        {/* Modal body */}
                        <div className="flex flex-col p-4">
                            <div className=""></div>
                            <div className="text-center font-semibold text-base">{alertContext.alertState.title}</div>
                            <div className="text-center text-sm">{alertContext.alertState.message}</div>
                        </div>
                        {/* footer */}
                        <div className="flex flex-row justify-center p-4">
                            <button type="button" className="p-2 rounded-full mx-4 w-1/3 text-white bg-red-500 text-base hover:bg-red-600" onClick={(e)=>onCloseModal(e)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div> : null

    return contentModal
}

export default AlertModal
