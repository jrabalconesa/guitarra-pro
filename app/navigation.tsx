'use client';
import {useEffect,useRef,useState} from 'react';
import ProNavIcon from './pro-nav-icon';
import {Menu,X} from 'lucide-react';
const GROUPS:[string,string[]][]=[
 ['APRENDER Y PRACTICAR',['practica','aia','ruta']],
 ['TÉCNICA Y REPERTORIO',['caged','biblioteca']],
 ['MI APRENDIZAJE',['progreso','profesor']],
 ['INSTRUMENTOS Y CONFIGURACIÓN',['afinador']]
];
export default function Navigation({tabs,icons,tab,onNavigate}:{tabs:string[][],icons:Record<string,any>,tab:string,onNavigate:(id:string)=>void}){
 const [open,setOpen]=useState(false),dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();if(!open&&dialog.current?.open)dialog.current?.close();},[open]);
 useEffect(()=>{if(!open)return;const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=prev}},[open]);
 useEffect(()=>{const desktop=window.matchMedia('(min-width:700px)');const closeOnDesktop=()=>{if(desktop.matches)setOpen(false)};desktop.addEventListener('change',closeOnDesktop);return()=>desktop.removeEventListener('change',closeOnDesktop)},[]);
 function choose(id:string){setOpen(false);onNavigate(id)}
 function item(id:string,title:string,mobile=false){const Icon=icons[id];return <button title={title} aria-label={title} key={id} aria-current={tab===id?'page':undefined} className={(tab===id?'nav active':'nav')+(id==='aia'?' nav-aia':'')} onClick={()=>choose(id)}><ProNavIcon name={id}/><span className="nav-label">{mobile?(id==='aia'?'AIA':id==='progreso'?'Progreso':title):title}</span>{tab===id&&<span className="nav-dot"/>}</button>}
 const grouped=GROUPS.map(([title,ids])=><div className="pro-nav-group" key={title}><div className="pro-nav-group-title">{title}</div>{ids.map(id=>{const found=tabs.find(t=>t[0]===id);return found?item(found[0],found[1]):null})}</div>);
 return <><nav className="desktop-nav" aria-label="Secciones">{grouped}</nav><nav className="mobile-nav" aria-label="Accesos principales">{['practica','aia','ruta','progreso'].map(id=>{const found=tabs.find(t=>t[0]===id);return found?item(found[0],found[1],true):null})}<button className={'nav '+(open?'active':'')} aria-expanded={open} aria-controls="section-menu" onClick={()=>setOpen(true)}><ProNavIcon name="menu"/><span className="nav-label">Menú</span></button></nav><dialog ref={dialog} id="section-menu" className="section-menu" aria-labelledby="section-menu-title" onClose={()=>setOpen(false)} onCancel={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="section-menu-heading"><h2 id="section-menu-title">Todas las secciones</h2><button className="secondary" onClick={()=>setOpen(false)} aria-label="Cerrar menú"><X size={21}/></button></div><nav aria-label="Todas las secciones">{GROUPS.map(([title,ids])=><div className="pro-nav-group" key={title}><div className="pro-nav-group-title">{title}</div>{ids.map(id=>{const found=tabs.find(t=>t[0]===id);return found?item(found[0],found[1]):null})}</div>)}</nav></dialog></>;
}
