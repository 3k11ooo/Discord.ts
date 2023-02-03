import Vibrant from 'node-vibrant';
import axios from 'axios';

// ジャケ画から色を作成
export const colorPick = async (img_path: string): Promise<string> => {
  try{
    const responese = await axios.get(img_path, { responseType: 'arraybuffer'});
    const buffer = Buffer.from(responese.data, 'binary');
    const vibrant: Vibrant = new Vibrant(buffer);
    const palette: any = await vibrant.getPalette();
    const dominantColor: string = palette.Vibrant!.hex;
    return dominantColor;
  }
  catch(error){
    console.log(error);
    return '#0000';
  }
}