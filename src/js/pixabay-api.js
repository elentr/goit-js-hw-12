import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50360143-67f83f4bf6f92da79a63477ea';

export async function getImagesByQuery(query, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 15,
      },
    });
    return response.data;
  } catch(error) {
      // console.error('Axios error:', error);
      throw error;
    };
}