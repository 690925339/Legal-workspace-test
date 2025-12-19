export default {
    name: 'AppLayout',
    template: `
        <div class="app-layout">
            <Sidebar />
            <main class="workspace">
                <slot></slot>
            </main>
        </div>
    `,
    styles: `
        <style scoped>
        .app-layout {
            display: flex;
            height: 100vh;
            overflow: hidden;
        }
        
        .workspace {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: white;
            overflow: hidden;
        }
        </style>
    `
};
