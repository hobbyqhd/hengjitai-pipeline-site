/**
 * 浮动消息按钮功能
 * 在页面右下角添加固定位置的消息发送按钮
 * 完全独立实现，不依赖其他JS文件
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('浮动消息按钮脚本已加载');
    
    // 多语言翻译配置
    const translations = {
        'zh-CN': {
            modalTitle: '发送信息',
            modalDescription: '请填写以下信息，我们将尽快与您联系',
            nameLabel: '姓名',
            emailLabel: '邮箱',
            phoneLabel: '电话号码',
            messageLabel: '消息内容',
            submitButton: '发送信息',
            submitLoading: '提交中...',
            successMessage: '提交成功！我们会尽快与您联系。',
            errorMessage: '提交失败，请稍后重试或直接联系我们。',
            required: '*',
            close: '关闭',
            emailSubject: '恒基泰管道装备网站快捷信息提交'
        },
        cn: {
            modalTitle: '发送信息',
            modalDescription: '请填写以下信息，我们将尽快与您联系',
            nameLabel: '姓名',
            emailLabel: '邮箱',
            phoneLabel: '电话号码',
            messageLabel: '消息内容',
            submitButton: '发送信息',
            submitLoading: '提交中...',
            successMessage: '提交成功！我们会尽快与您联系。',
            errorMessage: '提交失败，请稍后重试或直接联系我们。',
            required: '*',
            close: '关闭',
            emailSubject: '恒基泰管道装备网站快捷信息提交'
        },
        en: {
            modalTitle: 'Send Message',
            modalDescription: 'Please fill out the information below and we will contact you as soon as possible',
            nameLabel: 'Name',
            emailLabel: 'Email',
            phoneLabel: 'Phone Number',
            messageLabel: 'Message',
            submitButton: 'Send Message',
            submitLoading: 'Submitting...',
            successMessage: 'Successfully submitted! We will contact you soon.',
            errorMessage: 'Submission failed, please try again later or contact us directly.',
            required: '*',
            close: 'Close',
            emailSubject: 'Hengjitai Pipeline Equipment Website Quick Contact'
        },
        jp: {
            modalTitle: 'メッセージ送信',
            modalDescription: '以下の情報をご記入ください。できるだけ早くご連絡いたします',
            nameLabel: '氏名',
            emailLabel: 'メールアドレス',
            phoneLabel: '電話番号',
            messageLabel: 'メッセージ',
            submitButton: 'メッセージ送信',
            submitLoading: '送信中...',
            successMessage: '送信完了！できるだけ早くご連絡いたします。',
            errorMessage: '送信に失敗しました。後でもう一度お試しください。',
            required: '*',
            close: '閉じる',
            emailSubject: 'ヘンユアン工業ウェブサイトクイック連絡'
        },
        ru: {
            modalTitle: 'Отправить сообщение',
            modalDescription: 'Пожалуйста, заполните информацию ниже, и мы свяжемся с вами как можно скорее',
            nameLabel: 'Имя',
            emailLabel: 'Электронная почта',
            phoneLabel: 'Номер телефона',
            messageLabel: 'Сообщение',
            submitButton: 'Отправить сообщение',
            submitLoading: 'Отправка...',
            successMessage: 'Успешно отправлено! Мы свяжемся с вами в ближайшее время.',
            errorMessage: 'Ошибка отправки, попробуйте позже или свяжитесь с нами напрямую.',
            required: '*',
            close: 'Закрыть',
            emailSubject: 'Hengjitai Pipeline Equipment Быстрая связь с сайта'
        },
        ar: {
            modalTitle: 'إرسال رسالة',
            modalDescription: 'يرجى ملء المعلومات أدناه وسنتواصل معك في أقرب وقت ممكن',
            nameLabel: 'الاسم',
            emailLabel: 'البريد الإلكتروني',
            phoneLabel: 'رقم الهاتف',
            messageLabel: 'الرسالة',
            submitButton: 'إرسال رسالة',
            submitLoading: 'جاري الإرسال...',
            successMessage: 'تم الإرسال بنجاح! سنتواصل معك قريباً.',
            errorMessage: 'فشل الإرسال، يرجى المحاولة لاحقاً أو التواصل معنا مباشرة.',
            required: '*',
            close: 'إغلاق',
            emailSubject: 'اتصال سريع من موقع Hengjitai Pipeline Equipment'
        },
        es: {
            modalTitle: 'Enviar Mensaje',
            modalDescription: 'Por favor complete la información a continuación y nos pondremos en contacto con usted lo antes posible',
            nameLabel: 'Nombre',
            emailLabel: 'Correo Electrónico',
            phoneLabel: 'Número de Teléfono',
            messageLabel: 'Mensaje',
            submitButton: 'Enviar Mensaje',
            submitLoading: 'Enviando...',
            successMessage: '¡Enviado exitosamente! Nos pondremos en contacto con usted pronto.',
            errorMessage: 'Error al enviar, por favor intente más tarde o contáctenos directamente.',
            required: '*',
            close: 'Cerrar',
            emailSubject: 'Contacto Rápido del Sitio Web de Hengjitai Pipeline Equipment'
        },
        fr: {
            modalTitle: 'Envoyer Message',
            modalDescription: 'Veuillez remplir les informations ci-dessous et nous vous contacterons dès que possible',
            nameLabel: 'Nom',
            emailLabel: 'Email',
            phoneLabel: 'Numéro de Téléphone',
            messageLabel: 'Message',
            submitButton: 'Envoyer Message',
            submitLoading: 'Envoi en cours...',
            successMessage: 'Envoyé avec succès ! Nous vous contacterons bientôt.',
            errorMessage: 'Échec de l\'envoi, veuillez réessayer plus tard ou nous contacter directement.',
            required: '*',
            close: 'Fermer',
            emailSubject: 'Contact Rapide du Site Web Hengjitai Pipeline Equipment'
        },
        pt: {
            modalTitle: 'Enviar Mensagem',
            modalDescription: 'Por favor preencha as informações abaixo e entraremos em contato o mais breve possível',
            nameLabel: 'Nome',
            emailLabel: 'Email',
            phoneLabel: 'Número de Telefone',
            messageLabel: 'Mensagem',
            submitButton: 'Enviar Mensagem',
            submitLoading: 'Enviando...',
            successMessage: 'Enviado com sucesso! Entraremos em contato em breve.',
            errorMessage: 'Falha no envio, tente novamente mais tarde ou entre em contato conosco diretamente.',
            required: '*',
            close: 'Fechar',
            emailSubject: 'Contato Rápido do Site Hengjitai Pipeline Equipment'
        },
        hi: {
            modalTitle: 'संदेश भेजें',
            modalDescription: 'कृपया नीचे दी गई जानकारी भरें और हम जल्द से जल्द आपसे संपर्क करेंगे',
            nameLabel: 'नाम',
            emailLabel: 'ईमेल',
            phoneLabel: 'फोन नंबर',
            messageLabel: 'संदेश',
            submitButton: 'संदेश भेजें',
            submitLoading: 'भेज रहे हैं...',
            successMessage: 'सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।',
            errorMessage: 'भेजने में असफल, कृपया बाद में पुनः प्रयास करें या सीधे हमसे संपर्क करें।',
            required: '*',
            close: 'बंद करें',
            emailSubject: 'Hengjitai Pipeline Equipment वेबसाइट त्वरित संपर्क'
        },
        de: {
            modalTitle: 'Nachricht senden',
            modalDescription: 'Bitte füllen Sie die unten stehenden Informationen aus und wir werden uns so schnell wie möglich bei Ihnen melden',
            nameLabel: 'Name',
            emailLabel: 'E-Mail',
            phoneLabel: 'Telefonnummer',
            messageLabel: 'Nachricht',
            submitButton: 'Nachricht senden',
            submitLoading: 'Senden...',
            successMessage: 'Erfolgreich gesendet! Wir werden uns bald bei Ihnen melden.',
            errorMessage: 'Senden fehlgeschlagen, bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
            required: '*',
            close: 'Schließen',
            emailSubject: 'Hengjitai Pipeline Equipment Website Schnellkontakt'
        }
    };
    
    // 获取当前语言
    function getCurrentLanguage() {
        // 方法1: 从URL路径中检测语言 (最可靠)
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(Boolean);
        
        if (pathParts.length > 0) {
            const possibleLang = pathParts[0].toLowerCase();
            const supportedLangs = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
            
            if (supportedLangs.includes(possibleLang)) {
                console.log('从URL路径检测到语言:', possibleLang);
                return possibleLang;
            }
        }
        
        // 方法2: 检查文档的lang属性
        const html = document.documentElement;
        if (html.lang) {
            const htmlLang = html.lang.toLowerCase();
            console.log('从HTML lang属性检测到语言:', htmlLang);
            
            // 处理特殊情况
            if (htmlLang === 'zh-cn') return 'cn';
            if (htmlLang === 'ja') return 'jp';
            
            // 检查是否为支持的语言
            const supportedLangs = ['cn', 'en', 'jp', 'ru', 'ar', 'es', 'fr', 'pt', 'hi', 'de'];
            if (supportedLangs.includes(htmlLang)) {
                return htmlLang;
            }
        }
        
        // 方法3: 尝试从页面其他元素检测语言特征
        // 例如检查是否有特定的语言标记类名或ID
        const bodyClasses = document.body.className;
        if (bodyClasses.includes('lang-cn') || bodyClasses.includes('chinese')) return 'cn';
        if (bodyClasses.includes('lang-jp') || bodyClasses.includes('japanese')) return 'jp';
        if (bodyClasses.includes('lang-ru') || bodyClasses.includes('russian')) return 'ru';
        if (bodyClasses.includes('lang-ar') || bodyClasses.includes('arabic')) return 'ar';
        // 其他语言检测...
        
        // 语言检测失败，尝试从meta标签获取
        const metaLang = document.querySelector('meta[name="language"]');
        if (metaLang && metaLang.content) {
            const metalang = metaLang.content.toLowerCase();
            console.log('从meta标签检测到语言:', metalang);
            if (metalang === 'zh-cn' || metalang === 'zh') return 'cn';
            if (metalang === 'ja') return 'jp';
        }
        
        console.log('无法检测语言，使用默认英语');
        return 'en';
    }
    
    // 获取翻译文本
    function getTranslation(key) {
        const lang = getCurrentLanguage();
        console.log(`获取翻译，语言: ${lang}, 键: ${key}`);
        
        // 先尝试从检测到的语言中获取翻译
        if (translations[lang] && translations[lang][key]) {
            console.log(`找到 ${lang} 语言的翻译: ${translations[lang][key]}`);
            return translations[lang][key];
        }
        
        // 如果找不到，检查是否有其他可能的语言匹配
        // 例如，可能语言代码略有不同 (zh vs cn)
        const langMappings = {
            'zh': 'cn',
            'ja': 'jp',
            'zh-cn': 'cn'
        };
        
        const mappedLang = langMappings[lang];
        if (mappedLang && translations[mappedLang] && translations[mappedLang][key]) {
            console.log(`找到映射语言 ${mappedLang} 的翻译: ${translations[mappedLang][key]}`);
            return translations[mappedLang][key];
        }
        
        // 如果仍然找不到，使用英文翻译
        console.log(`未找到翻译，使用默认英文翻译: ${translations.en[key]}`);
        return translations.en[key] || key;
    }
    
    // 判断是否为RTL语言
    function isRTL() {
        const lang = getCurrentLanguage();
        return lang === 'ar';
    }
    
    // 网站主题色 - 使用蓝色
    const themeBlueColor = '#0066cc'; // 主题蓝色
    
    // 检查是否是移动设备
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    }
    
    // 检查是否已存在back-to-top按钮，以避免位置冲突
    const backToTopBtn = document.getElementById('back-to-top');
    
    // 创建按钮样式
    const createButtonStyle = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes floatingPulse {
                0% { transform: scale(1); box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3); }
                50% { transform: scale(1.05); box-shadow: 0 6px 15px rgba(0, 102, 204, 0.5); }
                100% { transform: scale(1); box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3); }
            }
            
            @keyframes messageIconBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            
            #floating-message-btn {
                position: fixed;
                z-index: 9999;
                transition: all 0.4s ease;
            }
            
            #floating-message-btn button {
                background-color: ${themeBlueColor};
                color: white;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3);
                transition: all 0.3s ease;
                cursor: pointer;
                border: none;
                outline: none;
                animation: floatingPulse 3s infinite ease-in-out;
            }
            
            #floating-message-btn button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 15px rgba(0, 102, 204, 0.6);
            }
            
            #floating-message-btn button:active {
                transform: scale(0.95);
            }
            
            #floating-message-btn i {
                font-size: 26px;
                animation: messageIconBounce 2s infinite ease-in-out;
            }
            
            /* 移动端样式优化 */
            @media (max-width: 767px) {
                #floating-message-btn button {
                    width: 50px;
                    height: 50px;
                }
                
                #floating-message-btn i {
                    font-size: 22px;
                }
                
                #floating-message-modal .bg-white {
                    max-width: 100% !important;
                    margin: 0 8px;
                    padding: 16px !important;
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // 创建并应用样式
    createButtonStyle();
    
    // 创建浮动按钮元素
    const floatingBtn = document.createElement('div');
    floatingBtn.id = 'floating-message-btn';
    
    // 根据RTL和设备类型设置按钮位置
    const isMobile = isMobileDevice();
    floatingBtn.style.right = isRTL() ? 'auto' : isMobile ? '16px' : '20px';
    floatingBtn.style.left = isRTL() ? (isMobile ? '16px' : '20px') : 'auto';
    floatingBtn.style.bottom = backToTopBtn ? (isMobile ? '80px' : '100px') : (isMobile ? '16px' : '20px');
    
    // 设置按钮HTML - 恢复为蓝色主题
    floatingBtn.innerHTML = `<button type="button">
        <i class="fas fa-comment"></i>
        <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">${getTranslation('modalTitle')}</span>
    </button>`;
    
    console.log('正在添加浮动按钮到页面');
    document.body.appendChild(floatingBtn);
    
    // 获取按钮元素
    const button = floatingBtn.querySelector('button');
    
    // 模态框ID
    const modalId = 'floating-message-modal';
    
    // 创建模态框
    function createMessageModal() {
        // 检查模态框是否已存在
        if (document.getElementById(modalId)) {
            // 更新已存在模态框的翻译内容
            updateModalTranslations();
            return document.getElementById(modalId);
        }
        
        // 重新检测当前语言，确保使用最新检测结果
        const currentLang = getCurrentLanguage();
        console.log('创建模态框，使用语言:', currentLang);
        
        const isMobile = isMobileDevice();
        const rtl = isRTL();
        
        // 创建模态框样式
        if (!document.getElementById('floating-modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'floating-modal-styles';
            modalStyles.innerHTML = `
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes modalContentSlideIn {
                    from { transform: translateY(20px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                
                @keyframes modalIconPop {
                    0% { transform: scale(0.5); opacity: 0; }
                    70% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes inputFocusEffect {
                    0% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4); }
                    70% { box-shadow: 0 0 0 5px rgba(0, 102, 204, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0); }
                }
                
                #${modalId} {
                    animation: modalFadeIn 0.4s ease-out forwards;
                }
                
                #${modalId} .modal-content {
                    animation: modalContentSlideIn 0.5s ease-out forwards;
                }
                
                #${modalId} .modal-icon {
                    animation: modalIconPop 0.6s ease-out forwards;
                }
                
                #${modalId} input:focus, #${modalId} textarea:focus {
                    animation: inputFocusEffect 1s forwards;
                }
                
                #${modalId} .form-input-container {
                    transition: transform 0.3s ease-out;
                }
                
                #${modalId} .form-input-container:focus-within {
                    transform: translateX(5px);
                }
                
                /* RTL版本 */
                #${modalId} .rtl-content .form-input-container:focus-within {
                    transform: translateX(-5px);
                }
                
                #${modalId} .close-button {
                    transition: all 0.2s ease;
                    border-radius: 50%;
                }
                
                #${modalId} .close-button:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                    transform: rotate(90deg);
                }
                
                #modal-submit-btn {
                    background-color: ${themeBlueColor};
                    transition: all 0.3s ease;
                }
                
                #modal-submit-btn:hover {
                    background-color: rgba(0, 102, 204, 0.85);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
                }
                
                #modal-submit-btn:active {
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(modalStyles);
        }
        
        const modalElement = document.createElement('div');
        modalElement.id = modalId;
        modalElement.className = 'fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4 opacity-0 invisible transition-all duration-300';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute('data-language', currentLang);
        
        modalElement.innerHTML = `
            <div class="modal-content bg-white rounded-xl max-w-md w-full p-6 relative transform scale-95 transition-all duration-300 ${rtl ? 'rtl-content' : ''}"${rtl ? ' dir="rtl"' : ''}>
                <button type="button" class="close-button absolute top-4 ${rtl ? 'left-4' : 'right-4'} text-gray-500 hover:text-gray-700 focus:outline-none w-8 h-8 flex items-center justify-center" id="close-modal-btn">
                    <i class="fas fa-times"></i>
                    <span class="sr-only">${getTranslation('close')}</span>
                </button>
                
                <div class="text-center mb-6">
                    <div class="modal-icon w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-envelope text-2xl" style="color: ${themeBlueColor};"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900">${getTranslation('modalTitle')}</h3>
                    <p class="text-gray-600 mt-2">${getTranslation('modalDescription')}</p>
                </div>
                
                <!-- 成功提示 -->
                <div id="modal-success-message" class="hidden p-4 mb-4 rounded-lg bg-green-50 border border-green-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-check-circle text-green-500"></i>
                        </div>
                        <div class="${rtl ? 'mr-3' : 'ml-3'}">
                            <p class="text-sm font-medium text-green-800">
                                ${getTranslation('successMessage')}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- 错误提示 -->
                <div id="modal-error-message" class="hidden p-4 mb-4 rounded-lg bg-red-50 border border-red-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-red-500"></i>
                        </div>
                        <div class="${rtl ? 'mr-3' : 'ml-3'}">
                            <p class="text-sm font-medium text-red-800">
                                ${getTranslation('errorMessage')}
                            </p>
                        </div>
                    </div>
                </div>
                
                <form id="floating-message-form" action="https://formsubmit.co/ajax/sales@hypipelines.com" method="POST" class="space-y-4">
                    <!-- FormSubmit.co配置 -->
                    <input type="hidden" name="_subject" value="${getTranslation('emailSubject')}">
                    <input type="hidden" name="_template" value="table">
                    <input type="hidden" name="_captcha" value="true">
                    <input type="text" name="_honey" style="display:none">
                    
                    <div class="form-input-container">
                        <label for="floating-name" class="block text-sm font-medium text-gray-700 mb-1">
                            ${getTranslation('nameLabel')} <span class="text-red-500">${getTranslation('required')}</span>
                        </label>
                        <input type="text" id="floating-name" name="name" required 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                    </div>
                    
                    <div class="form-input-container">
                        <label for="floating-email" class="block text-sm font-medium text-gray-700 mb-1">
                            ${getTranslation('emailLabel')} <span class="text-red-500">${getTranslation('required')}</span>
                        </label>
                        <input type="email" id="floating-email" name="email" required 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                    </div>
                    
                    <div class="form-input-container">
                        <label for="floating-phone" class="block text-sm font-medium text-gray-700 mb-1">
                            ${getTranslation('phoneLabel')}
                        </label>
                        <input type="tel" id="floating-phone" name="phone" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                    </div>
                    
                    <div class="form-input-container">
                        <label for="floating-message" class="block text-sm font-medium text-gray-700 mb-1">
                            ${getTranslation('messageLabel')} <span class="text-red-500">${getTranslation('required')}</span>
                        </label>
                        <textarea id="floating-message" name="message" rows="${isMobile ? '3' : '4'}" required 
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"></textarea>
                    </div>
                    
                    <div class="pt-2">
                        <button id="modal-submit-btn" type="submit" 
                                class="w-full text-white font-medium py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <span id="submit-btn-text">${getTranslation('submitButton')}</span>
                            <span id="submit-btn-loading" class="hidden">
                                <i class="fas fa-spinner fa-spin ${rtl ? 'ml-2' : 'mr-2'}"></i>${getTranslation('submitLoading')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modalElement);
        
        // 绑定关闭事件
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modalElement);
            });
        }
        
        // 点击模态框背景关闭
        modalElement.addEventListener('click', function(event) {
            if (event.target === modalElement) {
                closeModal(modalElement);
            }
        });
        
        // 绑定表单提交事件
        const form = document.getElementById('floating-message-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
        
        return modalElement;
    }
    
    // 表单提交处理
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const successMessage = document.getElementById('modal-success-message');
        const errorMessage = document.getElementById('modal-error-message');
        const submitBtnText = document.getElementById('submit-btn-text');
        const submitBtnLoading = document.getElementById('submit-btn-loading');
        
        // 隐藏任何已显示的消息
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // 显示加载状态
        submitBtnText.classList.add('hidden');
        submitBtnLoading.classList.remove('hidden');
        
        try {
            // 使用fetch API发送表单数据
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            // 恢复按钮状态
            submitBtnText.classList.remove('hidden');
            submitBtnLoading.classList.add('hidden');
            
            if (result.success) {
                // 显示成功信息
                successMessage.classList.remove('hidden');
                // 重置表单
                form.reset();
                
                // 3秒后关闭模态框
                setTimeout(() => {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        closeModal(modal);
                    }
                }, 3000);
            } else {
                // 显示错误信息
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('提交表单时发生错误:', error);
            
            // 恢复按钮状态
            submitBtnText.classList.remove('hidden');
            submitBtnLoading.classList.add('hidden');
            
            // 显示错误信息
            errorMessage.classList.remove('hidden');
        }
    }
    
    // 打开模态框
    function openModal(modal) {
        // 更平滑的过渡效果
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.remove('invisible', 'opacity-0');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('overflow-hidden');
            
            // 动画效果
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }
            
            // 为表单输入框添加交错动画
            const inputs = modal.querySelectorAll('.form-input-container');
            inputs.forEach((input, index) => {
                setTimeout(() => {
                    input.style.opacity = '0';
                    input.style.transform = 'translateY(10px)';
                    
                    // 使用CSS动画
                    input.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    // 触发动画
                    setTimeout(() => {
                        input.style.opacity = '1';
                        input.style.transform = 'translateY(0)';
                    }, 10);
                }, index * 100); // 每个输入框延迟100毫秒
            });
            
            // 模态框图标特殊效果
            const iconContainer = modal.querySelector('.modal-icon');
            if (iconContainer) {
                iconContainer.classList.add('animated');
            }
        }, 10);
    }
    
    // 关闭模态框
    function closeModal(modal) {
        // 淡出动画
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            modalContent.style.opacity = '0';
            modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }
        
        // 延迟隐藏模态框
        setTimeout(() => {
            modal.classList.add('invisible', 'opacity-0');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('overflow-hidden');
            
            // 重置表单动画状态
            const inputs = modal.querySelectorAll('.form-input-container');
            inputs.forEach(input => {
                input.style.opacity = '';
                input.style.transform = '';
                input.style.transition = '';
            });
            
            // 500ms后隐藏模态框（允许转场动画完成）
            setTimeout(() => {
                modal.style.display = '';
            }, 200);
        }, 300);
    }
    
    // 添加按钮动效
    function startButtonAnimation() {
        // 初始加载时的入场动画
        setTimeout(() => {
            floatingBtn.style.opacity = '0';
            floatingBtn.style.transform = 'translateY(20px)';
            floatingBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.transform = 'translateY(0)';
            }, 100);
        }, 1000); // 页面加载1秒后显示按钮
        
        // 设置按钮位置自适应
        function updateButtonPosition() {
            const isMobile = isMobileDevice();
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const pageHeight = document.body.scrollHeight;
            
            // 在靠近页面底部时调整按钮位置
            if (scrollPosition + windowHeight > pageHeight - 100) {
                floatingBtn.style.bottom = backToTopBtn ? 
                    (isMobile ? '80px' : '100px') : 
                    (isMobile ? '16px' : '20px');
            }
            
            // 在移动设备上，根据滚动方向显示/隐藏按钮
            if (isMobile) {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScrollY && currentScroll > 300) {
                    // 向下滚动时隐藏按钮
                    floatingBtn.style.transform = 'translateY(80px)';
                    floatingBtn.style.opacity = '0';
                } else {
                    // 向上滚动时显示按钮
                    floatingBtn.style.transform = 'translateY(0)';
                    floatingBtn.style.opacity = '1';
                }
                lastScrollY = currentScroll;
            }
        }
        
        // 记录上次滚动位置，用于检测滚动方向
        let lastScrollY = window.scrollY;
        
        // 监听滚动事件
        window.addEventListener('scroll', updateButtonPosition);
        window.addEventListener('resize', updateButtonPosition);
        
        // 初始化位置
        updateButtonPosition();
    }
    
    // 启动按钮动画
    startButtonAnimation();
    
    // 添加点击事件 - 显示模态框
    button.onclick = function() {
        console.log('浮动按钮被点击，显示模态框');
        // 添加点击反馈
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // 重新检测当前语言
        console.log('点击按钮时检测语言:', getCurrentLanguage());
        
        // 打开模态框
        const modal = createMessageModal();
        // 确保翻译内容最新
        updateModalTranslations();
        openModal(modal);
        
        // 在移动设备上自动聚焦到第一个输入框
        if (isMobileDevice()) {
            setTimeout(() => {
                const firstInput = document.getElementById('floating-name');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);
        }
    };
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById(modalId);
            if (modal && modal.getAttribute('aria-hidden') === 'false') {
                closeModal(modal);
            }
        }
    });
    
    // 更新模态框的翻译内容
    function updateModalTranslations() {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // 获取当前语言
        const currentLang = getCurrentLanguage();
        console.log('更新模态框翻译，当前语言:', currentLang);
        
        // 检查是否需要更新翻译（如果语言没变，可能不需要更新）
        const previousLang = modal.getAttribute('data-language');
        if (previousLang === currentLang) {
            console.log('模态框语言未变化，无需更新翻译');
            return;
        }
        
        // 更新语言标记
        modal.setAttribute('data-language', currentLang);
        
        // 更新标题和描述
        const titleElement = modal.querySelector('h3');
        if (titleElement) titleElement.textContent = getTranslation('modalTitle');
        
        const descElement = modal.querySelector('h3 + p');
        if (descElement) descElement.textContent = getTranslation('modalDescription');
        
        // 更新表单标签
        const nameLabel = modal.querySelector('label[for="floating-name"]');
        if (nameLabel) nameLabel.childNodes[0].nodeValue = getTranslation('nameLabel') + ' ';
        
        const emailLabel = modal.querySelector('label[for="floating-email"]');
        if (emailLabel) emailLabel.childNodes[0].nodeValue = getTranslation('emailLabel') + ' ';
        
        const phoneLabel = modal.querySelector('label[for="floating-phone"]');
        if (phoneLabel) phoneLabel.childNodes[0].nodeValue = getTranslation('phoneLabel') + ' ';
        
        const messageLabel = modal.querySelector('label[for="floating-message"]');
        if (messageLabel) messageLabel.childNodes[0].nodeValue = getTranslation('messageLabel') + ' ';
        
        // 更新按钮文本
        const submitBtnText = document.getElementById('submit-btn-text');
        if (submitBtnText) submitBtnText.textContent = getTranslation('submitButton');
        
        const submitBtnLoading = document.getElementById('submit-btn-loading');
        if (submitBtnLoading) {
            const spinnerIcon = submitBtnLoading.querySelector('i');
            if (spinnerIcon) {
                submitBtnLoading.innerHTML = '';
                submitBtnLoading.appendChild(spinnerIcon);
                submitBtnLoading.appendChild(document.createTextNode(getTranslation('submitLoading')));
            }
        }
        
        // 更新关闭按钮
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            const srSpan = closeBtn.querySelector('.sr-only');
            if (srSpan) srSpan.textContent = getTranslation('close');
        }
        
        // 更新消息提示
        const successMessage = document.getElementById('modal-success-message');
        if (successMessage) {
            const msgText = successMessage.querySelector('p');
            if (msgText) msgText.textContent = getTranslation('successMessage');
        }
        
        const errorMessage = document.getElementById('modal-error-message');
        if (errorMessage) {
            const msgText = errorMessage.querySelector('p');
            if (msgText) msgText.textContent = getTranslation('errorMessage');
        }
        
        // 更新表单的隐藏字段
        const subjectField = modal.querySelector('input[name="_subject"]');
        if (subjectField) subjectField.value = getTranslation('emailSubject');
        
        // 更新RTL设置
        const rtl = isRTL();
        const modalContent = modal.querySelector('div');
        if (modalContent) {
            if (rtl) {
                modalContent.setAttribute('dir', 'rtl');
            } else {
                modalContent.removeAttribute('dir');
            }
        }
        
        console.log('已更新模态框翻译内容');
    }
});
