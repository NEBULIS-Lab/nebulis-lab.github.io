// NEBULIS Lab Login Page JavaScript
// 登录页面的表单处理和验证

document.addEventListener('DOMContentLoaded', function() {
    // 初始化登录表单
    initLoginForm();
    
    // 初始化表单验证
    initFormValidation();
    
    // 初始化记住我功能
    initRememberMe();
});

// 初始化登录表单
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', handleLoginSubmit);
}

// 处理登录提交
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // 基本验证
    if (!validateEmail(email)) {
        showError('请输入有效的邮箱地址');
        return;
    }
    
    if (!password || password.length < 6) {
        showError('密码至少需要6个字符');
        return;
    }
    
    // 显示加载状态
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '登录中...';
    submitBtn.disabled = true;
    
    // 模拟登录请求
    simulateLogin(email, password, remember)
        .then(result => {
            if (result.success) {
                showSuccess('登录成功！');
                
                // 如果选择了记住我，保存到本地存储
                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                }
                
                // 重定向到内部页面（实际项目中应该重定向到真实的内部页面）
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                showError(result.message || '登录失败，请检查邮箱和密码');
            }
        })
        .catch(error => {
            showError('登录过程中发生错误，请稍后重试');
            console.error('Login error:', error);
        })
        .finally(() => {
            // 恢复按钮状态
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// 模拟登录请求
function simulateLogin(email, password, remember) {
    return new Promise((resolve) => {
        // 模拟网络延迟
        setTimeout(() => {
            // 这里应该是真实的API调用
            // 现在只是模拟一些基本的验证
            
            // 模拟的验证逻辑
            const validEmails = [
                'admin@nebulislab.org',
                'member@nebulislab.org',
                'researcher@nebulislab.org'
            ];
            
            const validPasswords = [
                'password123',
                'admin123',
                'member123'
            ];
            
            if (validEmails.includes(email.toLowerCase()) && validPasswords.includes(password)) {
                resolve({
                    success: true,
                    user: {
                        email: email,
                        name: 'NEBULIS Lab Member',
                        role: 'member'
                    }
                });
            } else {
                resolve({
                    success: false,
                    message: '邮箱或密码错误'
                });
            }
        }, 1500);
    });
}

// 初始化表单验证
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            validateEmailField(emailInput);
        });
        
        emailInput.addEventListener('input', () => {
            clearFieldError(emailInput);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            validatePasswordField(passwordInput);
        });
        
        passwordInput.addEventListener('input', () => {
            clearFieldError(passwordInput);
        });
    }
}

// 验证邮箱字段
function validateEmailField(input) {
    const email = input.value.trim();
    
    if (!email) {
        showFieldError(input, '请输入邮箱地址');
        return false;
    }
    
    if (!validateEmail(email)) {
        showFieldError(input, '请输入有效的邮箱地址');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

// 验证密码字段
function validatePasswordField(input) {
    const password = input.value;
    
    if (!password) {
        showFieldError(input, '请输入密码');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(input, '密码至少需要6个字符');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

// 验证邮箱格式
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示字段错误
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#dc2626';
}

// 清除字段错误
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// 显示错误消息
function showError(message) {
    showMessage(message, 'error');
}

// 显示成功消息
function showSuccess(message) {
    showMessage(message, 'success');
}

// 显示消息
function showMessage(message, type) {
    // 移除现有的消息
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message login-message-${type}`;
    messageDiv.textContent = message;
    
    // 样式设置
    messageDiv.style.padding = '0.75rem 1rem';
    messageDiv.style.borderRadius = '0.5rem';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.fontSize = '0.875rem';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = '#fef2f2';
        messageDiv.style.color = '#dc2626';
        messageDiv.style.border = '1px solid #fecaca';
    } else if (type === 'success') {
        messageDiv.style.backgroundColor = '#f0fdf4';
        messageDiv.style.color = '#16a34a';
        messageDiv.style.border = '1px solid #bbf7d0';
    }
    
    // 插入到表单前面
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.parentNode.insertBefore(messageDiv, loginForm);
        
        // 自动移除消息
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// 初始化记住我功能
function initRememberMe() {
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    const emailInput = document.getElementById('email');
    
    if (rememberCheckbox && emailInput) {
        // 检查是否有保存的邮箱
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }
}

// 忘记密码处理
function initForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (!forgotPasswordLink) return;
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!email) {
            showError('请先输入邮箱地址');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('请输入有效的邮箱地址');
            return;
        }
        
        // 模拟发送重置密码邮件
        showSuccess('重置密码邮件已发送到您的邮箱');
        
        // 实际项目中应该调用API发送重置邮件
        console.log('Password reset requested for:', email);
    });
}

// 键盘快捷键
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter键提交表单
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape键清除错误消息
        if (e.key === 'Escape') {
            const message = document.querySelector('.login-message');
            if (message) {
                message.remove();
            }
        }
    });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    initForgotPassword();
    initKeyboardShortcuts();
});

// 导出函数
window.LoginPage = {
    validateEmail,
    showError,
    showSuccess,
    simulateLogin
};
