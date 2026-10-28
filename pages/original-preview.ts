export async function originalPreview(songId:string){
 const response=await fetch('/api/songs?id='+encodeURIComponent(songId)+'&original=1');
 if(!response.ok)throw Error('No se pudo abrir el archivo original guardado en este navegador.');
 return URL.createObjectURL(await response.blob());
}
