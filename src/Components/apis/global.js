import axios from 'axios';
import API_BASE_URL from '../Config/apiConfig';

export class globalApiActions {
  // retrieve the list of rooms by floor (name + floor + DynamicId)
  static async getAllList() {
    const res = await axios.get(`${API_BASE_URL}/geographicContext/space`)

    const { data } = await res
    return data
  }

}