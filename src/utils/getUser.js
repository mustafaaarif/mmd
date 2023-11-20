import {authenticationService} from "../jwt/_services/authentication.service";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const getUser = async(token, currentUser, setCurrentUser) => {

  let options = {
    'method': 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      'Content-Type': 'application/json'
    }
  }

  if (!token) return false;
  try {
    const response = await fetch(API_URL + 'users/', options);
    if (response.status === 401) {
      authenticationService.logout();
      return false;
    }
    const json = await response.json();

    setCurrentUser(json.results[0]);
    
  } catch (error) {
    console.log('error', error);
  }
}
export { getUser };