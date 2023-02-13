const utils =  {
    isEmpty: (val: any) => {
        return (!val || val.length === 0 );
    },
    isValidEmail: (email: string) => {
        return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    },
    isValidPassword: (password: string) => {
        // /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/ with special charavccters
        return password.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
    },
    validateInput : (inputTyoe: string, field: object, optinallsField?: object ) => {

    },
    convertFileToBase64 : async (file: File) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve({
                    "name": file.name,
                    "type": file.type,
                    "size": file.size,
                    "base64": reader.result
                });
            };
            reader.onerror = function (error) {
                console.log('File Read Error: ', error);
                reject(false);
            };
        });
    } 
};

export default utils;