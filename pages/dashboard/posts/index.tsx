import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Layout from "../../../components/layout";
import Pagination from "../../../components/pagination";
import Modals from "../../../components/Modals";
import utils from "../../../utils/utils"
import { ToastContainer, toast } from "react-toastify";

import moment from 'moment'

import Editor from "../../../components/editor";

import { RemoveBadgeClose } from "../../../components/logo";

export default function Dashboard () {

    interface postData {
        postId: string, title: string, slug: string, summary: string, content: string, tags: string[], tagsStr: string , categoryStr: string, category: string[], bannerImage: string, bannerImageFile: any, isPublished?: boolean, updatedAt?:any
    }
    interface categoryData {
        categoryId: string, categoryName: string, categoryStatus: boolean
    }

    const postInitData: postData = {
        postId: "",
        title: "",
        slug: "",
        summary: "",
        content: "",
        tagsStr: "",
        tags: [],
        categoryStr: "",
        category: [],
        bannerImage: "",
        bannerImageFile: undefined
    };

    const [paginationData, setPaginationData] = useState( {page: 1, per_page: 10, total_count: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [postData, setPostData] = useState<postData[]>([]);

    const [modalPostData, setModalPostData] = useState( postInitData );
    const [postDataError, setPostDataError] = useState<string[]>( [] );
    const [isResourceLoading, setIsResourceLoading] = useState(false);

    // temp for editor
    const [editorData, setEditorData] = useState( "" );

    const [activeCategoryList, setActiveCategoryList] = useState<categoryData[]>( [] );

    useEffect( () => {
        setIsLoading(true);
        const getUserList = async () => {
            const fetchData = await fetch("/api/posts?page="+paginationData.page+"&per_page="+paginationData.per_page, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });
            const postList = await fetchData.json();

            setPostData(postList.data);
            setPaginationData(postList.pagination);

            setCurrentPage(postList.pagination.page);
            setPerPage(postList.pagination.per_page);
            setTotalCount(postList.pagination.total_count);
            

            setIsLoading(false);
        }
        getUserList();

    }, [currentPage, perPage, refreshKey]);

    useEffect( () => {
        const getCategoryList = async () => {
            const fetchData = await fetch("/api/categories/active", { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });
            const activeCategory = await fetchData.json();
            setActiveCategoryList(activeCategory.data);
        }
        getCategoryList();

    }, [])

    const setInputDataForPost = function(value:any, inputType:string) {
        if( inputType === "title" || inputType === "slug" || inputType === "summary" ) {
            setModalPostData({...modalPostData, [inputType]: value});
        } else if ( inputType === "tagsStr" ) {
            if(! /^([a-zA-Z0-9_-]+)$/.test(value) && value !== "" ) {
                console.log("ERR");
                return;
            }
            setModalPostData({...modalPostData, [inputType]: value});
        } else if ( inputType === "categoryStr" ) {
            setModalPostData({...modalPostData, [inputType]: "", category: [ value ]});
        } else if ( inputType === "content" ) {
            setModalPostData({...modalPostData, [inputType]: value});
        }
    }

    const handleKeyDown = function(e:any, inputType:any) {
        if( e.key === "Enter" ) {
            // if( inputType === "categoryStr"  && !utils.isEmpty(modalPostData.categoryStr) ) {
            //     setModalPostData({...modalPostData, categoryStr: "", category: [ modalPostData.categoryStr ] });
            // } else 
            if ( inputType === "tagsStr" && !utils.isEmpty(modalPostData.tagsStr) ) {
                let tagsArray = modalPostData.tags;
                tagsArray.push(modalPostData.tagsStr);
                setModalPostData({...modalPostData, tagsStr: "", tags: tagsArray });
            }
        }
    }

    const removeTagByIndex = function( index:number ) {
        let tagsArray = modalPostData.tags;
        tagsArray.splice(index, 1);
        setModalPostData({...modalPostData, tags: tagsArray });
    }

    const pageChange = function(param: number) {
        setPaginationData( {...paginationData, page: param} );
        setCurrentPage(param);
    }

    const createPostInit = async function () {

        if(!utils.isEmpty(modalPostData.tagsStr)) {
            handleKeyDown({"key":"Enter"}, "tagsStr");
        }
        if(!utils.isEmpty(modalPostData.categoryStr)) {
            handleKeyDown({"key":"Enter"}, "categoryStr");
        }

        setPostDataError([]);
        setModalPostData(postInitData);
        // temp for editor
        setEditorData("");
        return true;
    }

    const createNewPost = async function () {
        // TEMP data for content
        setInputDataForPost(editorData, "content");
        
        let error = [];

        if( utils.isEmpty(modalPostData.title) ) {
            error.push("Please enter Title");
        }
        if( utils.isEmpty(modalPostData.slug) ) {
            error.push("Please enter Slug");
        }
        if( utils.isEmpty(modalPostData.summary) ) {
            error.push("Please enter Summary");
        }
        if( utils.isEmpty(editorData) ) {
            error.push("Please enter content");
        }
        if( utils.isEmpty(modalPostData.tags) && utils.isEmpty(modalPostData.tagsStr) ) {
            if(!utils.isEmpty(modalPostData.tagsStr)) {
                handleKeyDown({"key":"Enter"}, "tagsStr");
            }
            error.push("Please enter Tags");
        }
        if( utils.isEmpty(modalPostData.category) && utils.isEmpty(modalPostData.categoryStr) ) {
            if(!utils.isEmpty(modalPostData.categoryStr)) {
                handleKeyDown({"key":"Enter"}, "categoryStr");
            }
            error.push("Please select category");
        }
        if( utils.isEmpty(modalPostData.bannerImage) ) {
            error.push("Please select banner image");
        }

        if( error.length ) {
            setPostDataError(error);
            return false;
        } else {
            setPostDataError([]);
        }
        setIsResourceLoading(true);
        const toastObj = toast.loading("Saving...")

        const fetchData = await fetch("/api/posts", { 
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: modalPostData.title,
                slug: modalPostData.slug,
                summary: modalPostData.summary,
                content: editorData,
                tags: modalPostData.tags,
                category: modalPostData.category,
                bannerImage: modalPostData.bannerImage,
                bannerImageFile: modalPostData.bannerImageFile
             })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setIsResourceLoading(false);
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            setIsResourceLoading(false);
            return true;
        }
    }

    const cancelCreateNewPost = async function () {
        setPostDataError([]);
        setModalPostData(postInitData);
        // temp for editor
        setEditorData("");
        return true;
    }

    // // temp for editor
    // const tempSetEditorData = function (editorData) {
    //     // console.log([4, modalPostData])
    //     // setEditorData(value);
    //     // setInputDataForPost(value, inputType);
    //     // console.log([5, modalPostData])
    //      // TEMP data for content
    //      setInputDataForPost(editorData, "content");
    // }

    const deletePost = async function (post:any) {
        
        setIsResourceLoading(true);
        const toastObj = toast.loading("Deleting...")

        const fetchData = await fetch("/api/posts/"+post.postId, { 
            method: 'DELETE',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: post.postId })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setIsResourceLoading(false);
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            setIsResourceLoading(false);
            return true;
        }

    }

    const updatePostStatus = async function (e:any, post:any) {
        const toastObj = toast.loading("Updating...")

        const fetchData = await fetch("/api/posts/"+post.postId+"/status", { 
            method: 'PATCH',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: post.postId, isPublished: !post.isPublished })
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

    const selectBannerImage = async function (e:any) {
        const file:any = await utils.convertFileToBase64(e.target.files[0]);
        setModalPostData({...modalPostData, bannerImageFile: file, bannerImage: file.name })
    }

    const updatePostInit = async function(post:any) {
        setEditorData(post.content);
        setModalPostData(post);
        return true;
    }

    const updatePost = async function() {
     
        // setInputDataForPost(editorData, "content");
        
        let error = [];

        if( utils.isEmpty(modalPostData.title) ) {
            error.push("Please enter Title");
        }
        if( utils.isEmpty(modalPostData.slug) ) {
            error.push("Please enter Slug");
        }
        if( utils.isEmpty(modalPostData.summary) ) {
            error.push("Please enter Summary");
        }
        if( utils.isEmpty(editorData) ) {
            error.push("Please enter content");
        }
        if( utils.isEmpty(modalPostData.tags) && utils.isEmpty(modalPostData.tagsStr) ) {
            if(!utils.isEmpty(modalPostData.tagsStr)) {
                handleKeyDown({"key":"Enter"}, "tagsStr");
            }
            error.push("Please enter Tags");
        }
        if( utils.isEmpty(modalPostData.category) && utils.isEmpty(modalPostData.categoryStr) ) {
            if(!utils.isEmpty(modalPostData.categoryStr)) {
                handleKeyDown({"key":"Enter"}, "categoryStr");
            }
            error.push("Please select category");
        }
        if( utils.isEmpty(modalPostData.bannerImage) ) {
            error.push("Please select banner image");
        }

        if( error.length ) {
            setPostDataError(error);
            return false;
        } else {
            setPostDataError([]);
        }
        setIsResourceLoading(true);
        const toastObj = toast.loading("Saving...")

        const fetchData = await fetch("/api/posts/"+modalPostData.postId, { 
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                postId: modalPostData.postId,
                title: modalPostData.title,
                slug: modalPostData.slug,
                summary: modalPostData.summary,
                content: editorData,
                tags: modalPostData.tags,
                category: modalPostData.category,
                bannerImage: modalPostData.bannerImage,
                bannerImageFile: modalPostData.bannerImageFile
             })
        });
        if (fetchData.status !== 200) {
            const errorMessage = await fetchData.json();
            toast.update(toastObj, { render: errorMessage.error, type: "error", isLoading: false, position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setIsResourceLoading(false);
            return false;

        } else {
            const successMessage = await fetchData.json();
            toast.update(toastObj, { render: successMessage.msg, type: "success", isLoading: false,  position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored" });
            setRefreshKey(refreshKey+1);
            setIsResourceLoading(false);
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
                        Posts
                    </h1>
                </div>
                <div className="w-1/2 flex justify-end">
                    <Modals modalSize={"extralarge"} buttonText={"Create Post"} modalTitle={"Create Post"} params={undefined} buttonClass={undefined} initAction={createPostInit} successAction={createNewPost} cancelAction={cancelCreateNewPost} successButtonText={"Create Post"} cancelButtonText={"Cancel"} isResourceLoading={isResourceLoading} >
                        <form>

                        { postDataError.length ? (<div className="py-2">
                                <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                    <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Error</span>
                                    <div>
                                        <span className="font-medium">Error</span>
                                        <ul className="mt-1.5 ml-4 list-disc list-inside">
                                            { postDataError.map( (er, index) => (
                                                <li key={index}>
                                                    {er}
                                                </li>
                                            )) }
                                        </ul>
                                    </div>
                                </div>
                            </div>) : ("")}

                            <div className="py-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
                                <input type="text" id="post-title" value={modalPostData.title} onChange={e => { setInputDataForPost(e.target.value, "title"); }} placeholder="Post Title" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="py-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Slug</label>
                                <input type="text" id="post-slug" value={modalPostData.slug} onChange={e => { setInputDataForPost(e.target.value, "slug"); }} placeholder="Slug" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="py-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Summary</label>
                                <input type="text" id="post-summary" value={modalPostData.summary} onChange={e => { setInputDataForPost(e.target.value, "summary"); }} placeholder="summary" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="py-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Banner Image</label>
                                <input onChange={selectBannerImage} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
                            </div>
                            <div className="py-2">
                                <label htmlFor="Category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an Category</label>
                                <select id="Category" onChange={(event) => setInputDataForPost(event.target.value, "categoryStr")} value={modalPostData.categoryStr} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="" selected disabled>Choose a Category</option>
                                    { activeCategoryList.map( ( acat, index) => {
                                        return (<>
                                            <option key={index} value={acat.categoryName}>{acat.categoryName}</option>
                                        </>) } )
                                    }
                                </select>
                                <div>
                                    {
                                        modalPostData.category.map( ( element, index) => {
                                            return (
                                                <div key={index} className="py-2 flex inline-flex">
                                                    <span id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                                        {element}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="py-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                                <input type="text" id="post-tagsStr" value={modalPostData.tagsStr} onChange={e => { setInputDataForPost(e.target.value, "tagsStr"); }} onKeyDown={ (e) => handleKeyDown(e, "tagsStr") } placeholder="tags" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                <div>
                                    {
                                        modalPostData.tags.map( ( element, index) => {
                                            return (
                                                <div key={index} className="py-2 flex inline-flex">
                                                    <span id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                                        {element}
                                                    <button onClick={ () => { removeTagByIndex(index) } } type="button" className="inline-flex items-center p-0.5 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                        <RemoveBadgeClose />
                                                        <span className="sr-only">Remove badge</span>
                                                    </button>
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="py-2">
                                {/* temp for editor */}
                                {/* modalPostData.content */}
                                {/* setInputDataForPost */}
                                <Editor defaultValue={editorData} setEditorValue={setEditorData} />
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
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Title </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Slug </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Published </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Updated At </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {postData.map((pd, index) => (
                                            <tr key={index} className={ index % 2 == 0 ? "bg-gray-100 border-b dark:bg-slate-600 dark:border-slate-400" : "bg-white border-b dark:bg-slate-800 dark:border-slate-400" }>
                                                <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } > {index+1} </td>
                                                <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } > {pd.title} </td>
                                                <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } > {pd.slug} </td>
                                                <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={pd.isPublished} onChange={e => { updatePostStatus(e.target.value, pd); }}  className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </td>
                                                <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                    { moment(pd.updatedAt).format("DD MMM YYYY h:mm:ss a") }
                                                </td>
                                                <td className={ index % 2 == 0 ? "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" : "text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200" } >
                                                    
                                                    <Modals
                                                        modalSize={"extralarge"}
                                                        buttonClass={"inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"}
                                                        buttonText={ <> <Image src={'/images/edit.svg'} alt={'edit'} className="w-4 h-4 mr-2 fill-current text-gray-900 dark:text-white" width={24} height={24} /> Edit </> }
                                                        modalTitle={"Edit Post"}
                                                        params={pd}
                                                        initAction={updatePostInit}
                                                        successAction={updatePost}
                                                        cancelAction={cancelCreateNewPost}
                                                        successButtonText={"Update Post"}
                                                        cancelButtonText={"Cancel"}
                                                        isResourceLoading={isResourceLoading}
                                                    >
                                                        <form>

                                                        { postDataError.length ? (<div className="py-2">
                                                                <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                                                    <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                                                    <span className="sr-only">Error</span>
                                                                    <div>
                                                                        <span className="font-medium">Error</span>
                                                                        <ul className="mt-1.5 ml-4 list-disc list-inside">
                                                                            { postDataError.map( (er, index) => (
                                                                                <li key={index}>
                                                                                    {er}
                                                                                </li>
                                                                            )) }
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>) : ("")}

                                                            <div className="py-2">
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
                                                                <input type="text" id="post-title" value={modalPostData.title} onChange={e => { setInputDataForPost(e.target.value, "title"); }} placeholder="Post Title" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                            </div>
                                                            <div className="py-2">
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Slug</label>
                                                                <input type="text" id="post-slug" value={modalPostData.slug} onChange={e => { setInputDataForPost(e.target.value, "slug"); }} placeholder="Slug" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                            </div>
                                                            <div className="py-2">
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Summary</label>
                                                                <input type="text" id="post-summary" value={modalPostData.summary} onChange={e => { setInputDataForPost(e.target.value, "summary"); }} placeholder="summary" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                            </div>
                                                            <div className="py-2">
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Banner Image</label>
                                                                <input onChange={selectBannerImage} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />

                                                                { modalPostData.postId ? ( <div className="py-2"> <Link href={modalPostData.bannerImage} className={"block mb-2 text-sm font-medium text-gray-900 dark:text-white"} target="_blank" > Image : {modalPostData.bannerImage} </Link> </div>) : ("") }

                                                            </div>
                                                            <div className="py-2">
                                                                <label htmlFor="Category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an Category</label>
                                                                <select id="Category" onChange={(event) => setInputDataForPost(event.target.value, "categoryStr")} value={modalPostData.categoryStr} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                                    <option value="" selected disabled>Choose a Category</option>
                                                                    { activeCategoryList.map( ( acat, index) => {
                                                                        return (<>
                                                                            <option key={index} value={acat.categoryName}>{acat.categoryName}</option>
                                                                        </>) } )
                                                                    }
                                                                </select>
                                                                <div>
                                                                    {
                                                                        modalPostData.category.map( ( element, index) => {
                                                                            return (
                                                                                <div key={index} className="py-2 flex inline-flex">
                                                                                    <span id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                                                                        {element}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="py-2">
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                                                                <input type="text" id="post-tagsStr" value={modalPostData.tagsStr} onChange={e => { setInputDataForPost(e.target.value, "tagsStr"); }} onKeyDown={ (e) => handleKeyDown(e, "tagsStr") } placeholder="tags" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                                <div>
                                                                    {
                                                                        modalPostData.tags.map( ( element, index) => {
                                                                            return (
                                                                                <div key={index} className="py-2 flex inline-flex">
                                                                                    <span id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                                                                                        {element}
                                                                                    <button onClick={ () => { removeTagByIndex(index) } } type="button" className="inline-flex items-center p-0.5 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                                                        <RemoveBadgeClose />
                                                                                        <span className="sr-only">Remove badge</span>
                                                                                    </button>
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="py-2">
                                                                {/* temp for editor */}
                                                                {/* modalPostData.content */}
                                                                {/* setInputDataForPost */}
                                                                <Editor defaultValue={editorData} setEditorValue={setEditorData} />
                                                            </div>
                                                        </form>
                                                    </Modals>

                                                    <Modals 
                                                        modalSize={"popup"} 
                                                        params={pd} 
                                                        buttonClass={"inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"} 
                                                        buttonText={ <> <Image src={'/images/trash.svg'} alt={'delete'} className="w-4 h-4 mr-2 fill-current text-gray-900 dark:text-white" width={24} height={24} /> Delete </> } 
                                                        modalTitle={"Delete Post"} 
                                                        successButtonText={"Delete"} 
                                                        cancelButtonText={"Cancel"} 
                                                        initAction={dummyInit} 
                                                        successAction={deletePost} 
                                                        cancelAction={dummyInit}
                                                        isResourceLoading={isResourceLoading}
                                                    >
                                                        <>
                                                            <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"> Are you sure you want to delete this Post? </h3>
                                                        </>
                                                    </Modals>

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