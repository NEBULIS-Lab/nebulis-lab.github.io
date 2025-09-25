// Lottie动画初始化脚本
// 使用用户提供的原始Lottie动画

document.addEventListener('DOMContentLoaded', function() {
    // 检查Lottie库是否已加载
    if (typeof lottie === 'undefined') {
        console.warn('Lottie库未加载，请检查网络连接');
        return;
    }

    // 初始化动画
    function initStarAnimation() {
        const container = document.getElementById('star-animation');
        if (!container) {
            console.warn('动画容器未找到');
            return;
        }

        try {
            // 使用用户提供的Lottie动画链接
            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://assets5.lottiefiles.com/packages/lf20_V9t630.json', // 示例链接，请替换为您的实际链接
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                }
            });

            // 动画加载完成后的回调
            animation.addEventListener('DOMLoaded', function() {
                console.log('星星动画加载完成');
            });

            // 错误处理
            animation.addEventListener('data_failed', function() {
                console.error('动画数据加载失败，请检查网络连接或动画链接');
            });

        } catch (error) {
            console.error('动画初始化失败:', error);
        }
    }

    // 延迟初始化，确保DOM完全加载
    setTimeout(initStarAnimation, 100);
});

// 导出函数供其他脚本使用
window.initStarAnimation = function() {
    const container = document.getElementById('star-animation');
    if (!container) return;
    
    // 重新初始化动画
    container.innerHTML = '';
    setTimeout(() => {
        if (typeof lottie !== 'undefined') {
            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://assets5.lottiefiles.com/packages/lf20_V9t630.json', // 请替换为您的实际链接
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                }
            });
        }
    }, 100);
};
