import axios from "axios";
const KEY = `33042709-ff335eccdd4e8b99fec3c8b69`;
const MAIN_URL = `https://pixabay.com/api/`;

export async function serverRequest(customRequest, page) {
    const fulUrl = `${MAIN_URL}?key=${KEY}&q=${customRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
    const responce = await axios.get(fulUrl)
    const data = responce.data
    
    return data
}