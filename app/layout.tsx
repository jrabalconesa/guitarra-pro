import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Guitarra PRO',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'Guitarra PRO'},description:'Ejercicios de guitarra adaptativos, tablatura y escucha de notas individuales.',icons:{icon:[{url:'/favicon.ico',sizes:'any'},{url:'/branding/guitarra-pro-icon-32.png',type:'image/png',sizes:'32x32'},{url:'/branding/guitarra-pro-icon-192.png',type:'image/png',sizes:'192x192'}],apple:[{url:'/branding/guitarra-pro-mobile-180.png',sizes:'180x180',type:'image/png'}]}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
