// Palette preview only: no visitor collection, cookies, or analytics requests.
document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('[data-visitor-theme]');
    const toggle = document.querySelector('.visitor-theme-toggle');
    if (!footer || !toggle) return;

    function updateToggle() {
        const isLight = footer.dataset.visitorTheme === 'light';
        const english = isLight ? 'Dark palette' : 'Light palette';
        const chinese = isLight ? '深色配色' : '浅色配色';
        toggle.dataset.en = english;
        toggle.dataset.zh = chinese;
        const isChinese = document.documentElement.lang.startsWith('zh');
        toggle.textContent = isChinese ? chinese : english;
        document.title = isChinese ? 'NEBULIS Lab - 访客地图版式预览' : 'NEBULIS Lab - Visitor Map Layout Preview';
    }

    toggle.addEventListener('click', function () {
        footer.dataset.visitorTheme = footer.dataset.visitorTheme === 'dark' ? 'light' : 'dark';
        updateToggle();
    });

    // language.js emits this event before updating <html lang> and the page title.
    document.addEventListener('languageChanged', function () {
        queueMicrotask(updateToggle);
    });
    updateToggle();
});
