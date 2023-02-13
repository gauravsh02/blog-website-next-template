import { useSession, getSession } from "next-auth/react";
import Layout from "../../components/layout";

export default function Dashboard ( ) {
    const { data: session } = useSession();

    return (
        <Layout>
            <div className="bg-slate-200 dark:bg-slate-800 rounded-md p-8 h-full">
                <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
                    Users
                </h1>
                <div className="bg-primary m-2 p-2 dark:bg-gray-900">
                    <div className="flex flex-col">
                        <div className="max-h-96 overflow-x-auto overflow-y-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
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
                                            <tr className="bg-gray-100 border-b dark:bg-slate-600 dark:border-slate-400">
                                                <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> 1 </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> Name 1 </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> Email 1 </td>
                                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200"> Role 1 </td>
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-slate-800 dark:border-slate-400">
                                                <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> 2 </th>
                                                <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> Name 2 </th>
                                                <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> Email 2 </th>
                                                <th className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left dark:text-gray-200 "> Role 2 </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context:any) {
    const session = await getSession(context)

    if (!session) {
        return {
        redirect: {
            destination: '/',
            permanent: false,
        }}
    }
    return { props: { } }
}