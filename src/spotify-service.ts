import dotenv from 'dotenv';
import axios from 'axios';
import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { colorPick } from './service'
dotenv.config()

// global
let accessToken: string;
// Authorization
export const oAuth = async(id: string, secret: string): Promise<string | null> => {
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
  if(!accessToken) return null;
  else return 'Accept!';
}

// search tracks
export const searchTrack = async(trackName: string) => {
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`;
  const responese = await axios.get( `${apiUrl}`, {
    headers: { Authorization: `Bearer ${accessToken}`}
  });
  let resultArray: EmbedBuilder[] = [];
  if(responese.status === 200){
    for(let i=0; i<responese.data.tracks.limit; i++){
      let artistsArray: string[] = [];
      for(let j=0; j<responese.data.tracks.items[i].artists.length; j++){
        artistsArray.push(responese.data.tracks.items[i].artists[j].name);
      }
      // ジャケ画から色をとる 非同期処理する
      const colorCode: any = await colorPick(responese.data.tracks.items[i].album.images[1].url);
      // アーティストが複数の場合分け
      let filedsName: string = '';
      if(artistsArray.length < 2) filedsName = 'Artist';
      else filedsName = 'Artists';
      // 埋め込み
      const trackData = new EmbedBuilder()
      .setTitle(responese.data.tracks.items[i].name)
      .setImage(responese.data.tracks.items[i].album.images[1].url)
      .setURL(responese.data.tracks.items[i].external_urls.spotify) // 
      .addFields({ name: filedsName, value: artistsArray.join('、') })
      // .addFields({ name: '\u200B', value: responese.data.tracks.items[i].preview_url})
      .setColor(colorCode)
      resultArray.push(trackData);
    }
  }
  return resultArray;
}
    // .setTimestamp(responese.data.tracks.items[i].album.release_date)//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
