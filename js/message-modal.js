/**
 * 消息弹窗功能
 * 用于发送快捷信息
 */

document.addEventListener('DOMContentLoaded', () => {
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
        ja: {
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
        const htmlLang = document.documentElement.lang || 'en';
        return translations[htmlLang] ? htmlLang : 'en';
    }

    // 获取翻译文本
    function getTranslation(key) {
        const lang = getCurrentLanguage();
        return translations[lang][key] || translations['en'][key] || key;
    }

    // 检查是否为RTL语言
    function isRTL() {
        return getCurrentLanguage() === 'ar';
    }

    // 创建模态框HTML并添加到文档
    function createMessageModal() {
        const modal = document.createElement('div');
        modal.id = 'message-modal';
        modal.className = 'fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4 opacity-0 invisible transition-all duration-300';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'message-modal-title');

        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-sm w-full p-6 relative transform scale-95 transition-all duration-300"${isRTL() ? ' dir="rtl"' : ''}>
                <button type="button" class="absolute top-4 ${isRTL() ? 'left-4' : 'right-4'} text-gray-500 hover:text-gray-700 focus:outline-none" id="close-message-modal">
                    <i class="fas fa-times"></i>
                    <span class="sr-only">${getTranslation('close')}</span>
                </button>
                
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-envelope text-primary text-2xl"></i>
                    </div>
                    <h3 id="message-modal-title" class="text-xl font-semibold text-gray-900">${getTranslation('modalTitle')}</h3>
                    <p class="text-gray-600 mt-2">${getTranslation('modalDescription')}</p>
                </div>
                
                <!-- 成功提示 -->
                <div id="modal-success" class="hidden p-4 mb-4 rounded-lg bg-green-50 border border-green-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-check-circle text-green-500"></i>
                        </div>
                        <div class="${isRTL() ? 'mr-3' : 'ml-3'}">
                            <p class="text-sm font-medium text-green-800">
                                ${getTranslation('successMessage')}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- 错误提示 -->
                <div id="modal-error" class="hidden p-4 mb-4 rounded-lg bg-red-50 border border-red-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-red-500"></i>
                        </div>
                        <div class="${isRTL() ? 'mr-3' : 'ml-3'}">
                            <p class="text-sm font-medium text-red-800">
                                ${getTranslation('errorMessage')}
                            </p>
                        </div>
                    </div>
                </div>
                
                <form id="message-form" action="https://formsubmit.co/ajax/sales@hypipelines.com" method="POST" class="space-y-4">
                    <!-- FormSubmit.co配置 -->
                    <input type="hidden" name="_subject" value="${getTranslation('emailSubject')}">
                    <input type="hidden" name="_template" value="table">
                    <input type="hidden" name="_captcha" value="true">
                    <input type="text" name="_honey" class="hidden">
                    
                    <div>
                        <label for="modal-name" class="block text-sm font-medium text-gray-700 mb-1">${getTranslation('nameLabel')} <span class="text-red-500">${getTranslation('required')}</span></label>
                        <input type="text" id="modal-name" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    
                    <div>
                        <label for="modal-email" class="block text-sm font-medium text-gray-700 mb-1">${getTranslation('emailLabel')} <span class="text-red-500">${getTranslation('required')}</span></label>
                        <input type="email" id="modal-email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    
                    <div>
                        <label for="modal-phone" class="block text-sm font-medium text-gray-700 mb-1">${getTranslation('phoneLabel')}</label>
                        <input type="tel" id="modal-phone" name="phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    
                    <div>
                        <label for="modal-message" class="block text-sm font-medium text-gray-700 mb-1">${getTranslation('messageLabel')} <span class="text-red-500">${getTranslation('required')}</span></label>
                        <textarea id="modal-message" name="message" rows="4" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    
                    <div class="pt-2">
                        <button id="modal-submit" type="submit" class="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <span id="modal-submit-text">${getTranslation('submitButton')}</span>
                            <span id="modal-submit-loading" class="hidden">
                                <i class="fas fa-spinner fa-spin ${isRTL() ? 'ml-2' : 'mr-2'}"></i>${getTranslation('submitLoading')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 初始化模态框
    createMessageModal();
    
    // 获取DOM元素
    const messageModal = document.getElementById('message-modal');
    const openModalBtn = document.getElementById('send-message-btn');
    const closeModalBtn = document.getElementById('close-message-modal');
    const messageForm = document.getElementById('message-form');
    const modalSuccess = document.getElementById('modal-success');
    const modalError = document.getElementById('modal-error');
    const modalSubmitText = document.getElementById('modal-submit-text');
    const modalSubmitLoading = document.getElementById('modal-submit-loading');
    
    if (!messageModal || !openModalBtn) {
        console.error('消息模态框组件初始化失败，缺少必要元素');
        return;
    }
    
    // 打开模态框
    function openModal() {
        messageModal.classList.remove('invisible', 'opacity-0');
        messageModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');
        
        // 动画效果
        setTimeout(() => {
            const modalContent = messageModal.querySelector('div');
            if (modalContent) {
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }
        }, 10);
        
        // 重置表单
        messageForm.reset();
        modalSuccess.classList.add('hidden');
        modalError.classList.add('hidden');
    }
    
    // 关闭模态框
    function closeModal() {
        const modalContent = messageModal.querySelector('div');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
        }
        
        setTimeout(() => {
            messageModal.classList.add('invisible', 'opacity-0');
            messageModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('overflow-hidden');
        }, 300);
    }
    
    // 事件监听器
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // 点击模态框背景关闭
    messageModal.addEventListener('click', function(event) {
        if (event.target === messageModal) {
            closeModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && messageModal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
    
    // 表单提交处理
    messageForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        modalSuccess.classList.add('hidden');
        modalError.classList.add('hidden');
        
        // 显示加载状态
        modalSubmitText.classList.add('hidden');
        modalSubmitLoading.classList.remove('hidden');
        
        try {
            // 创建临时表单，避免原生submit方法被覆盖的问题
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = messageForm.action;
            
            // 手动复制所有表单字段
            const inputs = messageForm.querySelectorAll('input, select, textarea');
            for (let i = 0; i < inputs.length; i++) {
                const originalInput = inputs[i];
                // 跳过submit按钮
                if (originalInput.type === 'submit') continue;
                
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = originalInput.name;
                input.value = originalInput.value;
                tempForm.appendChild(input);
            }
            
            // 使用fetch API发送表单数据
            const formData = new URLSearchParams(new FormData(tempForm));
            
            const response = await fetch(messageForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            // 恢复按钮状态
            modalSubmitText.classList.remove('hidden');
            modalSubmitLoading.classList.add('hidden');
            
            if (result.success) {
                // 显示成功信息
                modalSuccess.classList.remove('hidden');
                // 重置表单
                messageForm.reset();
                
                // 3秒后关闭模态框
                setTimeout(() => {
                    closeModal();
                }, 3000);
            } else {
                // 显示错误信息
                modalError.classList.remove('hidden');
            }
        } catch (error) {
            console.error('提交表单时发生错误:', error);
            
            // 恢复按钮状态
            modalSubmitText.classList.remove('hidden');
            modalSubmitLoading.classList.add('hidden');
            
            // 显示错误信息
            modalError.classList.remove('hidden');
        }
    });
});
