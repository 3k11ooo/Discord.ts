import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()


export const searchTrack = async(trackName: string) => {
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=10`;
  const responese = await axios.get( `${apiUrl}`,{
    headers: { Authorization: `Bearer ${process.env.accessToken}`}
  });
  let trackArray: any[] = [];
  for(let i=0; i<responese.data.track.limit; i++){
    let artistsArray: string[] = [];
    for(let j=0; j<responese.data.track.items[i].artists.length; j++){
      artistsArray.push(responese.data.track.items[i].artists[j].name);
    }
    const trackData: any = {
      name: responese.data.track.items[i].name,
      artist: String(artistsArray),
      url: responese.data.track.items[i].external_urls.spotify,
    }
    trackArray.push(trackData);
  }
  return trackArray;
}