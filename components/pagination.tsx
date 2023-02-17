import React from 'react'

interface paginationInterface {
    page: any;
    per_page: any;
    total_count: any;
    handlePageChange: any;
}

const Pagination = ({ page, per_page, total_count, handlePageChange }:paginationInterface ) => {

    var nPages = Math.ceil(total_count / per_page)
    var currentPage = page;

    const pageNumbers:any = [Array.from(Array(nPages + 1).keys())].slice(1)

    const nextPage = () => {
            if(currentPage !== nPages) handlePageChange(currentPage + 1)
    }
    const prevPage = () => {
        if(currentPage !== 1) handlePageChange(currentPage - 1)
    }
    return (
        <div className="flex">
                    <ul className="inline-flex m-auto items-center -space-x-px">
                        <li>
                            <a onClick={prevPage}  href="#" className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Previous</span>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            </a>
                        </li>
                        {pageNumbers.map((pgNumber: any) => (
                            <li key={pgNumber} className= {`page-item ${page == pgNumber ? "px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white" : 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'} `} >
                                <a onClick={() => handlePageChange(pgNumber)} className='page-link' href='#'>
                                    {pgNumber}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a onClick={nextPage} href="#" className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Next</span>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            </a>
                        </li>

                    </ul>
        </div>
    )
}

export default Pagination