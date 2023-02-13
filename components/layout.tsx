import Sidebar from "./Sidebar";
export default function Layout({ children }: any) {
    return (
        <>
            <div className="flex flex-row h-screen justify-start">
                <Sidebar />
                <div className="bg-primary flex-1 p-4 text-white h-screen dark:bg-gray-900">
                    {/* <div className="h-50"> */}
                        {children}
                    {/* </div> */}
                </div>
            </div>
        </>
    )
};