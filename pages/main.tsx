import './api';
import React from 'react';
import {createRoot} from 'react-dom/client';
import Page from '../app/page';
import version from '../public/version.json';
import '../app/globals.css';
createRoot(document.getElementById('root')!).render(<><div className="pages-storage-notice" role="note">GitHub Pages · Versión basada en Sites {version.sites_version} · Progreso y canciones guardados solo en este navegador. <a href="https://guitarra-pro.joserabalconesa.chatgpt.site">Abrir Sites con sincronización</a></div><Page/></>);
