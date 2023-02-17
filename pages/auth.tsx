import React, { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useSession, signIn, signOut, getProviders, getSession } from "next-auth/react";
import utils from "../utils/utils";
import Router from "next/router";

const Auth: NextPage = ({ providers }: any) => {

    const { data: session } = useSession();
    const [authType, setAuthType] = useState("Login");

    interface FormDataInputInterfaceType {
        [index: string]: { key: string; type: string; value: string | boolean ;error: string }
    }
    const [formData, setFormData] = useState<FormDataInputInterfaceType>({
        "name" : {"key": "name", type: "string", "value": "", "error": "" },
        "email" : {"key": "email", type: "email", "value": "", "error": "" },
        "password" : {"key": "password", type: "password", "value": "", "error": "" },
        "repeatPassword" : {"key": "repeatPassword", type: "password", "value": "", "error": "" },
        "tANDcCheck" : {"key": "tANDcCheck", type: "checkbox", "value": false, "error": "" },
    });

    const toggelTANDcCheck = () => {
        setFormData( (formData) => ({...formData, tANDcCheck: {...formData.tANDcCheck, value : !formData.tANDcCheck.value}}) )
    }

    const setInputValue = (e: React.ChangeEvent<HTMLInputElement>, keyNode: string) => {
        formData[keyNode].value = e.target.value;
        setFormData( (formData) => ({...formData, keyNode : {...formData[keyNode], value: e.target.value} }) )
    }

    const validateField = (e: React.ChangeEvent<HTMLInputElement> | undefined, keyNodes: Array<string>) => {
        if(e){
            e.preventDefault();
        }
        const isLogin = isLoginForm();
        let isError = false;
        let error = "";

        keyNodes.forEach((keyNode) => {
            let formField = formData[keyNode];
            if(formField.type === 'string' ) {
                if(utils.isEmpty(formField.value)) {
                    error = "Field cant be empty";
                    isError = true;
                }
            } else if(formField.type === 'email' ) {
                if(!utils.isValidEmail(String(formField.value))) {
                    error = "Invalid Email";
                    isError = true;
                }
            } else if(formField.type === 'password' ) {
                if(!utils.isValidPassword(String(formField.value))) {
                    error = "Invalid Password";
                    isError = true;
                }
            }
            formData[keyNode].error = error;
        });

        if(!isLogin && keyNodes?.length > 1) {
            if(String(formData.name.value).length <= 0){
                error = "Field cant be empty";
                formData.name.error = error;
                isError = true;
            }

            if(String(formData.password.value).length > 0 && String(formData.repeatPassword.value).length > 0 && String(formData.password.value) !== String(formData.repeatPassword.value)){
                error = "Password does not match";
                formData.repeatPassword.error = error;
                isError = true;
            }

            if(!formData.tANDcCheck.value){
                error = "Please accept Terms and conditions";
                formData.tANDcCheck.error = error;
                isError = true;
            }
            
        }
        setFormData( formData );

        return !isError;
    }

    const toggelAuthType = () => {
        setAuthType((authType === "Login" ? "signup" : "Login" ));   
    }

    const isLoginForm = () => {
        return authType === "Login";
    }


    // providers button is we add more provider
    const ProvidersButtons = ( {providers}: any ) => {
        return (<>
            {Object.values(providers).map( ( provider: any ) => {
                return provider.name !== "Credentials" && (
                    <div className="flex items-start mb-6">
                        <button onClick={() => { signIn(provider.id, { callbackUrl: `${process.env.WEB_URL}/` }); }} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> { provider.name } </button>
                    </div>
                );
            } ) }
        </>);
    }

    const redirectToHome = () => {
        const { pathname } = Router;
        if (pathname === "/auth") {
            Router.push("/");
        }
      };

    const loginUser = async () => {
        const csfrToken: string =  await get_CSFR_token();
        const res: any = await signIn("cred-login", {
            redirect: false,
            email: formData.email.value,
            password: formData.password.value,
            callbackUrl: `${window.location.origin}`,
            csrfToken: csfrToken

        });
        res.error ? console.log(res.error) : redirectToHome();
    }

    const registerUser = async () => {
        try {
            const response: any = await fetch("/api/register", {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: formData.name.value, email: formData.email.value, password: formData.password.value, })
            });
            console.log(response);
            if(response.status === 200) {
                await loginUser();
                redirectToHome();
            } else {
                throw new Error(response.statusText);
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const handelFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
        if( isLoginForm() ) {
            const isValid = validateField(undefined, ["email", "password"]);
            return isValid ? loginUser() : false;
        } else {
            const isValid = validateField(undefined, ["name", "email", "password", "repeatPassword", "tANDcCheck"]);
            return isValid ? registerUser() : false;
        }
    }

    const get_CSFR_token = async () => {
        const csfrToken: any = await fetch("/api/auth/csrf");
        return csfrToken.csrfToken;
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="signin">
                    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                        <div className="flex justify-center items-center pb-5">
                            <Image className="max-w-lg h-auto rounded-lg" width={80} height={35} src="/images/logo.svg" alt={"image description"} />
                        </div>

                        <div>
                            { session ? (
                                <>
                                    <div>Signed in as {session?.user?.email} <br /></div>
                                    <button onClick={() => signOut()}>
                                        Sigout
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => signIn()}>
                                    Sigin
                                </button>
                            )
                            }
                        </div>

                        <form onSubmit={ handelFormSubmission } >
                            { isLoginForm() ? 
                                ( 
                                    "" 
                                ) : (
                                    <div className="mb-6">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                        <input value={String(formData.name.value)}  onChange={(e) => setInputValue(e, formData.name.key)} onBlur={(e) => validateField(e, [formData.name.key])} type="text" id="text" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="user" />
                                        { !utils.isEmpty(formData.name.error) ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"> {formData.name.error} </span> :  "" }

                                    </div>
                                ) 
                            }
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input value={String(formData.email.value)}  onChange={(e) => setInputValue(e, formData.email.key)} onBlur={(e) => validateField(e, [formData.email.key])} type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="user@mail.com" />
                                { !utils.isEmpty(formData.email.error) ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"> {formData.email.error} </span> :  "" }
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                <input value={String(formData.password.value)}  onChange={(e) => setInputValue(e, formData.password.key)} onBlur={(e) => validateField(e, [formData.password.key])} type="password" id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="****************" />
                                { !utils.isEmpty(formData.password.error) ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"> {formData.password.error} </span> :  "" }
                            </div>

                            { isLoginForm() ? 
                                ( 
                                    "" 
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat password</label>
                                            <input value={String(formData.repeatPassword.value)}  onChange={(e) => setInputValue(e, formData.repeatPassword.key)} onBlur={(e) => validateField(e, [formData.repeatPassword.key])} type="password" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="****************" />
                                            { !utils.isEmpty(formData.repeatPassword.error) ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"> {formData.repeatPassword.error} </span> :  "" }
                                        </div>
                                        <div className="flex items-start mb-6">
                                            <div className="flex items-center h-5">
                                                <input id="terms" type="checkbox" checked={Boolean(formData.tANDcCheck.value)}  onChange={toggelTANDcCheck} onBlur={(e) => validateField(e, [formData.tANDcCheck.key])} className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
                                            </div>
                                            <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
                                            { !utils.isEmpty(formData.tANDcCheck.error) ? <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"> {formData.tANDcCheck.error} </span> :  "" }
                                            <div>
                                                {
                                                    formData.repeatPassword.value
                                                }
                                                <div>  </div>
                                                {
                                                    formData.password.value
                                                }
                                            </div>
                                        </div>
                                    </>
                                    
                                ) 
                            }

 
                            <div className="flex items-start mb-6">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> { isLoginForm() ? "SignIn"  : "Register new account" } </button>
                            </div>
                            <div className="flex items-start mb-6">
                                <label onClick={() => toggelAuthType()} htmlFor="signin-register-toggle" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> { isLoginForm() ? "Not registered yet?"  : "Already have an account?" } <a href="#" className="text-blue-600 hover:underline dark:text-blue-500"> { authType === "Login" ? "SignUp"  : "SignIn" } </a></label>
                            </div>

                            <ProvidersButtons providers={providers} />

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auth;

export async function getServerSideProps(context:any) {
    const session = await getSession(context)

    if (session) {
        return {
        redirect: {
            destination: '/',
            permanent: false,
        },
        }
    }
    return  {
        props: {
            providers: await getProviders()
        }
    };
}