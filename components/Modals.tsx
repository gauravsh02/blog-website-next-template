import { useState, useEffect } from "react";
import { MiniLoadingSpinner } from "./loadingSpinner";
import {ModalCloseSquareSmall} from "./logo";


type mAction = (a: any) => any;
interface ModalInterface {
    children: any;
    params: any;
    modalSize: any;
    buttonClass: any;
    buttonText: any;
    modalTitle: any;
    successButtonText: any;
    cancelButtonText: any;
    initAction: mAction;
    successAction: mAction;
    cancelAction: mAction;
    isResourceLoading: any;
}

export default function Modals ( { children, params, modalSize, buttonClass, buttonText, modalTitle, successButtonText, cancelButtonText, initAction, successAction, cancelAction, isResourceLoading }: ModalInterface ) {
    
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect( () => {
        setIsLoading( (isResourceLoading ? true : false) );
    }, [isResourceLoading]);

    const openModalAndInitData = async function() {
        if( typeof initAction === "function" ) {
            await initAction(params);
        }
        setShowModal(true);
    }

    const getSuccessButtonText = function() {
        return successButtonText ? successButtonText : "OK";
    };
    const getCancelButtonText = function() {
        return cancelButtonText ? cancelButtonText : "Cancel";
    };

    const successButtonAction = async function() {
        let callCancelButtonAction = true;
        if( typeof successAction === "function" ) {
            callCancelButtonAction = await successAction(params);
        }
        if(callCancelButtonAction) {
            cancelButtonAction();
        }
    }

    const cancelButtonAction = async function() {
        setShowModal(false);
        if( typeof cancelAction === "function" ) {
            await cancelAction(params);
        }
    }

    const getModalBySize = (modalSize: any) => {
        switch (modalSize) {

            case "popup":
                return (<>
                    <button onClick={() => openModalAndInitData()} data-modal-target="popup-modal" data-modal-toggle="popup-modal" className={buttonClass ? buttonClass : "block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"} type="button">
                        {buttonText}
                    </button>
                    {showModal ? (<>
                        <div id="popup-modal" className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur">
                            <div className="relative w-full max-w-md h-full max-h-[calc(100%-1rem)]">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-scroll">
                                    <button onClick={() => setShowModal(false)} disabled={isLoading} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white disabled:cursor-not-allowed" data-modal-hide="popup-modal">
                                        <ModalCloseSquareSmall />
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-6 text-center">
                                        {children}
                                        <button onClick={() => successButtonAction()} disabled={isLoading} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 disabled:cursor-not-allowed"> {isLoading ? (<MiniLoadingSpinner />) : ""} {getSuccessButtonText()} </button>
                                        <button onClick={() => cancelButtonAction()} disabled={isLoading} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium inline-flex px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:cursor-not-allowed"> {isLoading ? (<MiniLoadingSpinner />) : ""} {getCancelButtonText()} </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>) : (<>
                    
                    </>)}

                </>);


            case "small":
                return (<>
                    <button onClick={() => openModalAndInitData()} data-modal-target="small-modal" data-modal-toggle="small-modal" className={ buttonClass ? buttonClass : "block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" } type="button">
                        {buttonText}
                    </button>
                    {showModal ? (<>
                        <div id="small-modal" className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur">
                            <div className="relative w-full max-w-md h-full max-h-[calc(100%-1rem)]">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-scroll">
                                    <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            {modalTitle}
                                        </h3>
                                        <button onClick={() => setShowModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:cursor-not-allowed" data-modal-hide="small-modal">
                                            <ModalCloseSquareSmall />
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {children}
                                    </div>
                                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={() => successButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium inline-flex rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getSuccessButtonText()} </button>
                                        <button onClick={() => cancelButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium inline-flex px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getCancelButtonText()} </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) : (<>
                        
                    </>)}
                </>);

            case "medium":
                return (<>
                    <button onClick={() => openModalAndInitData()} data-modal-target="medium-modal" data-modal-toggle="medium-modal" className={ buttonClass ? buttonClass : "block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" } type="button">
                        {buttonText}
                    </button>
                    {showModal ? (<>
                        <div id="medium-modal" className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur">
                            <div className="relative w-full max-w-lg h-full max-h-[calc(100%-1rem)]">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-scroll">
                                    <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            {modalTitle}
                                        </h3>
                                        <button onClick={() => setShowModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:cursor-not-allowed" data-modal-hide="small-modal">
                                            <ModalCloseSquareSmall />
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {children}
                                    </div>
                                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={() => successButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium inline-flex rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getSuccessButtonText()} </button>
                                        <button onClick={() => cancelButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium inline-flex px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getCancelButtonText()} </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) : (<>
                        
                    </>)}
                </>);


            case "large":
                return (<>
                    <button onClick={() => openModalAndInitData()} data-modal-target="large-modal" data-modal-toggle="large-modal" className={ buttonClass ? buttonClass : "block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" } type="button">
                        {buttonText}
                    </button>
                    {showModal ? (<>
                        <div id="large-modal" className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur">
                            <div className="relative w-full max-w-4xl h-full max-h-[calc(100%-1rem)]">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-scroll">
                                    <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            {modalTitle}
                                        </h3>
                                        <button onClick={() => setShowModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:cursor-not-allowed" data-modal-hide="small-modal">
                                            <ModalCloseSquareSmall />
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {children}
                                    </div>
                                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={() => successButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium inline-flex rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getSuccessButtonText()} </button>
                                        <button onClick={() => cancelButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium inline-flex px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getCancelButtonText()} </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) : (<>
                        
                    </>)}
                </>);

            case "extralarge":
                return (<>
                    <button onClick={() => openModalAndInitData()} data-modal-target="extralarge-modal" data-modal-toggle="extralarge-modal" className={ buttonClass ? buttonClass : "block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" } type="button">
                        {buttonText}
                    </button>
                    {showModal ? (<>
                        <div id="extralarge-modal" className="justify-center items-center flex overflow-scroll fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur">
                            <div className="relative w-full max-w-7xl h-full max-h-[calc(100%-1rem)]">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-scroll">
                                    <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            {modalTitle}
                                        </h3>
                                        <button onClick={() => setShowModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:cursor-not-allowed" data-modal-hide="small-modal">
                                            <ModalCloseSquareSmall />
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {children}
                                    </div>
                                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={() => successButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium inline-flex rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getSuccessButtonText()} </button>
                                        <button onClick={() => cancelButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium inline-flex px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getCancelButtonText()} </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) : (<>
                        
                    </>)}
                </>);


            default :
                return (<>
                    <button onClick={() => openModalAndInitData()} data-modal-target="medium-modal" data-modal-toggle="medium-modal" className={ buttonClass ? buttonClass : "block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" } type="button">
                        {buttonText}
                    </button>
                    {showModal ? (<>
                        <div id="medium-modal" className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur">
                            <div className="relative w-full h-full max-h-[calc(100%-1rem)]">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-scroll">
                                    <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            {modalTitle}
                                        </h3>
                                        <button onClick={() => setShowModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white disabled:cursor-not-allowed" data-modal-hide="small-modal">
                                            <ModalCloseSquareSmall />
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {children}
                                    </div>
                                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={() => successButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium inline-flex rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getSuccessButtonText()} </button>
                                        <button onClick={() => cancelButtonAction()} disabled={isLoading} data-modal-hide="small-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium inline-flex px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:cursor-not-allowed">  {isLoading ? (<MiniLoadingSpinner />) : ""} {getCancelButtonText()} </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) : (<>
                        
                    </>)}


                </>);
        }
    }

    return (<>
        {getModalBySize(modalSize)}
    </>);
}