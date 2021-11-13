import clickFile from '../../assets/click.wav';
import hoverFile from '../../assets/hover2.wav';

export const click = new Audio(clickFile);
const hover = fetch(hoverFile).then((response) => response.blob());
export async function playHover(audio: any) {
  const blob = await hover;
  audio.src = URL.createObjectURL(blob);
  audio.play().catch(() => null);
}
