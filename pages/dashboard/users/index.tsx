import { useState, useEffect } from "react";

import Layout from "../../../components/layout";
import Pagination from "../../../components/pagination";
import Modals from "../../../components/Modals";

export default function Dashboard () {

    const [paginationData, setPaginationData] = useState( {page: 1, per_page: 10, total_count: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState([]);

    useEffect( () => {
        setIsLoading(true);
        const getUserList = async () => {
            const fetchData = await fetch("/api/users?page="+paginationData.page+"?per_page="+paginationData.per_page, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });
            const userList = await fetchData.json();

            setUserData(userList.data);
            setPaginationData(userList.pagination);

            setCurrentPage(userList.pagination.page);
            setPerPage(userList.pagination.per_page);
            setTotalCount(userList.pagination.total_count);
            

            setIsLoading(false);
        }
        getUserList();

    }, [currentPage, perPage])

    const pageChange = function(param: number) {
        setPaginationData( {...paginationData, page: param} );
    }

    return (<Layout>
        <div className="bg-slate-200 dark:bg-slate-800 rounded-md p-8 h-full">
            <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
                Users
            </h1>

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
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> User </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Email </th>
                                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left dark:text-gray-200 "> Role </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {userData.map((user:any, index:number) => (
                                            ( index % 2 == 0 ) ? (
                                                <tr key={index} className="bg-gray-100 border-b dark:bg-slate-600 dark:border-slate-400">
                                                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> {index+1} </td>
                                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> {user.name} </td>
                                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> {user.email} </td>
                                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> {user.role} </td>
                                                    </tr>
                                                ) : (
                                                    <tr key={index} className="bg-white border-b dark:bg-slate-800 dark:border-slate-400">
                                                        <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> {index+1} </th>
                                                        <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> {user.name} </th>
                                                        <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> {user.email} </th>
                                                        <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> {user.role} </th>
                                                    </tr>
                                            )
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