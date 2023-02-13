import Link from 'next/link';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar () {
    const { data: session, status: status } = useSession();

    const getAuthButton = (status: String) => {
        switch(status) {
            case "loading":
                return (<>
                    <div className="inline-block px-4 py-2" role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </>);
            case "unauthenticated":
                return (<>
                    <a onClick={()=>signIn()} href="javascript:void(0)" className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800" > Sign in </a>
                </>);
            case "authenticated":
                return (<>
                    <Link href="/dashboard" className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800" > Dashboard </Link>
                </>);
        }
    }

    const [navbarOpen, setNavbarOpen] = useState(false);
    return (
        <>
            <nav className="w-full shadow bg-white text-black border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <a href="javascript:void(0)">
                            <Image src={'/images/logo.svg'} alt={'logo'} width={100} height={60} />
                        </a>
                        <div className="md:hidden">
                            <button className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border dark:text-white bg-gray-900" onClick={() => setNavbarOpen(!navbarOpen)} >
                                {navbarOpen ? ( 
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor" >
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className={`flex-1 justify-self-evenly pb-3 mt-8 md:block md:pb-0 md:mt-0 ${ navbarOpen ? "block" : "hidden" }`} >
                            <ul className="items-center justify-between space-y-18 md:flex md:space-x-32 md:space-y-0">
                                <li className="hover:text-indigo-200 dark:text-white"> <a href="/?#home-section">Home</a> </li>
                                <li className="hover:text-indigo-200 dark:text-white"> <a href="/?#image-section">Images</a> </li>
                                <li className="hover:text-indigo-200 dark:text-white"> <a href="/?#blog-section">Blogs</a> </li>
                            </ul>
                            {/* <div className="mt-3 space-y-2 lg:hidden md:inline-block">
                                <ul>
                                    <li>
                                        { getAuthButton(status) }
                                    </li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                    <div className="hidden space-x-2 md:inline-block">
                        { getAuthButton(status) }
                    </div>
                </div>
            </nav>
            <hr className="h-px my-0 bg-gray-200 border-0 dark:bg-gray-700" />
        </>
    );
}