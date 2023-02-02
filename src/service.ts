import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

// global
let accessToken: string;
// Authorization
export const oAuth = async(id: string, secret: string) => {
  const apiUrl = `https://accounts.spotify.com/api/token`
  const response = await axios.post( `${apiUrl}`, {
    'grant_type':'client_credentials',
    'client_id':`${id}`,
    'client_secret': `${secret}`
  },
  {
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded' 
    }
  });
  accessToken = response.data.access_token;
  // return response.data.access_token;
}

// search tracks
export const searchTrack = async(trackName: string) => {
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=10`;
  const responese = await axios.get( `${apiUrl}`, {
    headers: { Authorization: `Bearer ${accessToken}`}
  });
  let resultArray: any[] = [];
  if(responese.status === 200){
    for(let i=0; i<responese.data.tracks.limit; i++){
      let artistsArray: string[] = [];
      for(let j=0; j<responese.data.tracks.items[i].artists.length; j++){
        artistsArray.push(responese.data.tracks.items[i].artists[j].name);
      }
      const resutData: string = `${responese.data.tracks.items[i].name}\n${artistsArray.join("、")}\n${responese.data.tracks.items[i].external_urls.spotify}`;
      resultArray.push(resutData);
    }
  }
  return resultArray;
}