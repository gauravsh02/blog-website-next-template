import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

const Sidebar = () => {
    const [toggleCollapse, setToggleCollapse] = useState(false);
    const [isCollapsible, setIsCollapsible] = useState(false);

    const activeMenuCol: Boolean = false;

    const onMouseOver = () => {
        setIsCollapsible(!isCollapsible);
    };

    const handleSidebarToggle = () => {
        setToggleCollapse(!toggleCollapse);
    };

    return (

        // sidebar border
        // bg-gray-100 border-r border-gray-200

        <div className={`h-screen px-4 pt-8 pb-4 bg-primary flex justify-between max-h-screen overflow-y-auto flex-col dark:border-gray-600 p-5 dark:bg-gray-900 ${toggleCollapse ? "w-20" : "w-75"} `} onMouseEnter={onMouseOver} onMouseLeave={onMouseOver} style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }} >
            <div className="flex flex-col">
                <div className="flex items-center justify-between relative">
                    <div className="flex items-center pl-1 gap-4">
                        <Image src={'/images/logo.svg'} alt={'logo'} width={100} height={60} />
                        <span className={ `mt-2 text-lg font-medium text-text ${toggleCollapse ? "hidden" : ""}` } >
                            {/* Logo */}
                        </span>
                    </div>
                    {isCollapsible && (
                        <button className={`p-4 rounded bg-primary absolute right-0  ${ toggleCollapse ? "rotate-180" : "" }`} onClick={handleSidebarToggle} >
                            <Image src={'/images/collapseicon.svg'} alt={'logo'} width={16} height={15} />
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-start mt-24">
                    <div className={`flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap ${ activeMenuCol ? "bg-light-lighter" : "" }`}>
                        <Link href={"/dashboard"} className="flex py-4 px-3 items-center w-full h-full">
                            <div style={{ width: "2.5rem" }}>
                                <Image src={'/images/home.svg'} alt={'logo'} width={24} height={24} />
                            </div>
                            {!toggleCollapse && (
                                <span className={ "text-md font-medium text-text-light" } > Ddashboard </span>
                            )}
                        </Link>
                    </div>

                    <div className={`flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap ${ activeMenuCol ? "bg-light-lighter" : "" }`}>
                        <Link href={"/dashboard/users"} className="flex py-4 px-3 items-center w-full h-full">
                            <div style={{ width: "2.5rem" }}>
                                <Image src={'/images/users.svg'} alt={'logo'} width={24} height={24} />
                            </div>
                            {!toggleCollapse && (
                                <span className={ "text-md font-medium text-text-light" } > Users </span>
                            )}
                        </Link>
                    </div>

                    <div className={`flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap ${ activeMenuCol ? "bg-light-lighter" : "" }`}>
                        <Link href={"/dashboard/posts"} className="flex py-4 px-3 items-center w-full h-full">
                            <div style={{ width: "2.5rem" }}>
                                <Image src={'/images/post.svg'} alt={'logo'} width={24} height={24} />
                            </div>
                            {!toggleCollapse && (
                                <span className={ "text-md font-medium text-text-light" } > Posts </span>
                            )}
                        </Link>
                    </div>

                    <div className={`flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap ${ activeMenuCol ? "bg-light-lighter" : "" }`}>
                        <Link href={"/dashboard/Categories"} className="flex py-4 px-3 items-center w-full h-full">
                            <div style={{ width: "2.5rem" }}>
                                <Image src={'/images/post.svg'} alt={'logo'} width={24} height={24} />
                            </div>
                            {!toggleCollapse && (
                                <span className={ "text-md font-medium text-text-light" } > Categories </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>

            <div className={`flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap px-3 py-4`}>
                <div style={{ width: "2.5rem" }}>
                    <Image src={'/images/logout.svg'} alt={'logo'} width={24} height={24} />
                </div>
                {!toggleCollapse && (
                    <span className={"text-md font-medium text-text-light"}> Logout </span>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
