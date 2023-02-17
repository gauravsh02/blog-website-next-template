import { useState, useEffect } from "react";
import Image from "next/image";

import Layout from "../../../components/layout";
import Pagination from "../../../components/pagination";
import Modals from "../../../components/Modals";
import utils from "../../../utils/utils"

import { ToastContainer, toast } from "react-toastify";

export default function Dashboard () {

    interface categoryData {
        categoryId: string, categoryName: string, categoryStatus: boolean
    }

    const categoryInitData: categoryData = {
        categoryId: "",
        categoryName: "",
        categoryStatus: true
    };

    const [paginationData, setPaginationData] = useState( {page: 1, per_page: 10, total_count: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [categoryData, setCategoryData] = useState <categoryData[]>([]);

    const [modalCategoryData, setModalCategoryData] = useState( categoryInitData );
    const [modalCategoryErrorArray, setModalCategoryErrorArray] = useState <string[]> ( [] );

    useEffect( () => {
        setIsLoading(true);
        const getCategoryList = async () => {
            const fetchData = await fetch("/api/categories?page="+paginationData.page+"&per_page="+paginationData.per_page, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });
            const categoryList = await fetchData.json();

            setCategoryData(categoryList.data);
            setPaginationData(categoryList.pagination);

            setCurrentPage(categoryList.pagination.page);
            setPerPage(categoryList.pagination.per_page);
            setTotalCount(categoryList.pagination.total_count);

            setIsLoading(false);
        }
        getCategoryList();
    }, [currentPage, perPage, refreshKey])

    const setInputDataForCategory = function(value:any, inputType:string) {
        if( inputType === "categoryName" ) {
            setModalCategoryData({...modalCategoryData, [inputType]: value});
        } else if ( inputType === "categoryStatus") {
            setModalCategoryData({...modalCategoryData, [inputType]: !modalCategoryData[inputType]});
        }
    }

    const pageChange = function(param: number) {
        setPaginationData( {...paginationData, page: param} );
        setCurrentPage(param);
    }

    const createCategoryAction = async function () {

        // common code 
        let error = [];

        if( utils.isEmpty(modalCategoryData.categoryName) ) {
            error.push("Please ender Category name");
        }

        if( error.length ) {
            setModalCategoryErrorArray(error);
            return false;
        } else {
            setModalCategoryErrorArray([]);
        }

        const toastObj = toast.loading("Saving...")

        const fetchData = await fetch("/api/categories", { 
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryName: modalCategoryData.categoryName, categoryStatus: modalCategoryData.categoryStatus })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            return true;
        }
    }

    const cancelCategoryAction = function () {
        setModalCategoryData(categoryInitData);
        setModalCategoryErrorArray([]);
    }

    const deleteCategory = async function (category: any) {
        const toastObj = toast.loading("Deleting...")

        const fetchData = await fetch("/api/categories", { 
            method: 'DELETE',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: category.categoryId })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            return true;
        }
    }

    const updateCategoryStatus = async function (e:any, category:any) {
        const toastObj = toast.loading("Updating...")

        const fetchData = await fetch("/api/categories/"+category.categoryId+"/status", { 
            method: 'PATCH',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: category.categoryId, categoryStatus: !category.categoryStatus })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            return true;
        }
    }

    const setCategoryUpdateData = async function (category:any) {
        setModalCategoryData(category);
        return true;
    }

    const updateCategoryAction = async function () {

        // common code
        let error = [];

        if( utils.isEmpty(modalCategoryData.categoryName) ) {
            error.push("Please ender Category name");
        }

        if( error.length ) {
            setModalCategoryErrorArray(error);
            return false;
        } else {
            setModalCategoryErrorArray([]);
        }

        const toastObj = toast.loading("Updating...");

        const fetchData = await fetch("/api/categories/"+modalCategoryData.categoryId, { 
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: modalCategoryData.categoryId, categoryName: modalCategoryData.categoryName, categoryStatus: modalCategoryData.categoryStatus })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            return true;
        }
        
    }

    const dummyInit = function(e:any) {
        return true;
    }

    return (<Layout>
        <div className="bg-slate-200 dark:bg-slate-800 rounded-md p-8 h-full">

            <div className="flex py-5">
                <div className="w-1/2">
                    <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
                        Categories
                    </h1>
                </div>
                <div className="w-1/2 flex justify-end">
                    <Modals modalSize={"small"} params={undefined} buttonText={"Create Category"} modalTitle={"Create Category"} successButtonText={"Create"} cancelButtonText={"Cancel"} initAction={dummyInit} successAction={createCategoryAction} cancelAction={cancelCategoryAction} buttonClass={undefined} isResourceLoading={isLoading} >
                        <form>

                            { modalCategoryErrorArray.length ? (<div className="py-2">
                                <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                    <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Error</span>
                                    <div>
                                        <span className="font-medium">Error</span>
                                        <ul className="mt-1.5 ml-4 list-disc list-inside">
                                            { modalCategoryErrorArray.map( (er, index) => (
                                                <li key={index}>
                                                    {er}
                                                </li>
                                            )) }
                                        </ul>
                                    </div>
                                </div>
                            </div>) : ("")}

                            <div className="py-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
                                <input type="text" id="category-name" value={modalCategoryData.categoryName} onChange={e => { setInputDataForCategory(e.target.value, "categoryName"); }} placeholder="Category Name" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>

                            <div className="flex items-center px-2">
                                <input id="checked-checkbox" type="checkbox" checked={modalCategoryData.categoryStatus} onChange={e => { setInputDataForCategory(e.target.value, "categoryStatus"); }} className="block w-full p-2  w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="checked-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
                            </div>
                        </form>
                    </Modals>
                </div>
            </div>

            <div className="bg-primary m-2 p-2 dark:bg-gray-900">
                <div className="flex flex-col">
                    <div className="max-h-96 overflow-x-auto overflow-y-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden">

                                { isLoading ? (
                                    <div className="flex items-center flex-col px-4 py-2" role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                ) : (
                                    <table className="min-w-full">
                                        <thead className="bg-white border-b dark:bg-slate-800 dark:border-slate-400">
                                            <tr>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> # </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Category Name </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Status </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {categoryData.map((cat, index) => (
                                                
                                                <tr key={index} className={ index % 2 == 0 ? "bg-gray-100 border-b dark:bg-slate-600 dark:border-slate-400" : "bg-white border-b dark:bg-slate-800 dark:border-slate-400" } >
                                                    <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                        {index+1}
                                                    </td>
                                                    <td  className={ index % 2 == 0 ? "text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                        {cat.categoryName}
                                                    </td>
                                                    <td  className={ index % 2 == 0 ? "text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" checked={cat.categoryStatus} onChange={e => { updateCategoryStatus(e.target.value, cat); }}  className="sr-only peer" />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </td>
                                                    <td  className={ index % 2 == 0 ? "text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                        <div className="inline-flex rounded-md shadow-sm" role="group">
                                                            {/* <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                                                <Image src={'/images/edit.svg'} alt={'edit'} className="w-4 h-4 mr-2 fill-current text-gray-900 dark:text-white" width={24} height={24} />
                                                                Edit
                                                            </button> */}

                                                            <Modals 
                                                                modalSize={"small"} 
                                                                params={cat} 
                                                                buttonClass={"inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"} 
                                                                buttonText={ <> <Image src={'/images/edit.svg'} alt={'edit'} className="w-4 h-4 mr-2 fill-current text-gray-900 dark:text-white" width={24} height={24} /> Edit </> }
                                                                modalTitle={"Edit Category"} 
                                                                successButtonText={"Update"} 
                                                                cancelButtonText={"Cancel"} 
                                                                initAction={setCategoryUpdateData}
                                                                successAction={updateCategoryAction} 
                                                                cancelAction={cancelCategoryAction}
                                                                isResourceLoading={isLoading} 
                                                            >
                                                                <form>
                                                                    { modalCategoryErrorArray.length ? (<div className="py-2">
                                                                        <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                                                            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                                                            <span className="sr-only">Error</span>
                                                                            <div>
                                                                                <span className="font-medium">Error</span>
                                                                                <ul className="mt-1.5 ml-4 list-disc list-inside">
                                                                                    { modalCategoryErrorArray.map( (er, index) => (
                                                                                        <li key={index}>
                                                                                            {er}
                                                                                        </li>
                                                                                    )) }
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>) : ("")}

                                                                    <div className="py-2">
                                                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
                                                                        <input type="text" id="category-name" value={modalCategoryData.categoryName} onChange={e => { setInputDataForCategory(e.target.value, "categoryName"); }} placeholder="Category Name" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                                    </div>

                                                                    <div className="flex items-center px-2">
                                                                        <input id="checked-checkbox" type="checkbox" checked={modalCategoryData.categoryStatus} onChange={e => { setInputDataForCategory(e.target.value, "categoryStatus"); }} className="block w-full p-2  w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                                        <label htmlFor="checked-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
                                                                    </div>
                                                                </form>
                                                            </Modals>

                                                            <Modals 
                                                                modalSize={"popup"} 
                                                                params={cat} 
                                                                buttonClass={"inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"} 
                                                                buttonText={ <> <Image src={'/images/trash.svg'} alt={'delete'} className="w-4 h-4 mr-2 fill-current text-gray-900 dark:text-white" width={24} height={24} /> Delete </> } 
                                                                modalTitle={"Delete Category"} 
                                                                successButtonText={"Delete"} 
                                                                cancelButtonText={"Cancel"} 
                                                                initAction={dummyInit} 
                                                                successAction={deleteCategory} 
                                                                cancelAction={dummyInit}
                                                                isResourceLoading={isLoading}
                                                            >
                                                                <>
                                                                    <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"> Are you sure you want to delete this product? </h3>
                                                                </>
                                                            </Modals>

                                                            {/* <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                                                <Image src={'/images/archive.svg'} alt={'delete'} className="w-4 h-4 mr-2 fill-current text-gray-900 dark:text-white" width={24} height={24} />
                                                                Delete
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>

                                            ))}

                                        </tbody>
                                    </table>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination page={currentPage} per_page={perPage} total_count={totalCount} handlePageChange={pageChange} />

        </div>
    </Layout>);
}