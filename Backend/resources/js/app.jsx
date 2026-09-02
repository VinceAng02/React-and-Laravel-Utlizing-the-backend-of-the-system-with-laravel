import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

/**
 * Inertia.js client-side application bootstrap for React
 * Dynamically resolves page components from resources/js/Pages/
 */
createInertiaApp({
    title: (title) => (title ? `${title} - Task Manager` : 'Task Manager'),
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#6366f1',
        showSpinner: true,
    },
});
