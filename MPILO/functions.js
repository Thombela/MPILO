import { BASE_URL } from "./constants"

export function DisplayDate(date) {
    return new Date(date * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}
export function DisplayName(User) {
    if (!User) {
        return 'Deleted User'
    }
    else if (User && User.type == 'business') {
        if (!isNullOrEmpty(User.business_name)) {
            return User.business_name
        }
        else {
            return "@" + User.username
        }
    }
    else if (User && User.type == 'driver') {
        return User.name + " " + User.surname
    }
    else {
        return ''
    }
}
export const uploadFile = async (path, data) => {
    const url = BASE_URL + path;

    let formData = new FormData();
    formData.append("name", data.name);
    formData.append("folderName", data.folderName);
    formData.append("type", data.type);
    formData.append("file", {
        uri: data.uri,
        name: data.name,
        type: 'video/mov'
    });
    console.log(data)

    const reqData = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: formData
    });

    return await reqData.json();
};
export const submitData = async (file, data) => {
    const url = BASE_URL + "/backend/controllers/" + file + '.php'

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}
export const GetData = async (path) => {
    const url = BASE_URL + path
    const reqData = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return await reqData.json();
}
export const PostData = async (path, data) => {
    const url = BASE_URL + path
    const reqData = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await reqData.json();
}
function isNullOrEmpty(value) {
    return value === null || value === undefined || value === ""
}