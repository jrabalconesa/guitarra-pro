// Personal drafts never use the old unscoped keys shared by all accounts.
export function accountStorageKey(accountKey,name){return typeof accountKey==='string'&&/^[a-f0-9]{24}$/.test(accountKey)?`guitar:${accountKey}:${name}`:null;}
/** @param {*} fallback */
export function readLocal(key,fallback=null){if(!key)return fallback;try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
export function writeLocal(key,value){if(!key)return false;try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
export function removeLocal(key){if(key)try{localStorage.removeItem(key)}catch{}}
