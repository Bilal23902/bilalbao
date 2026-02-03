# 网恋照妖镜 - 静态网站版本

这是一个将原PHP网站完全转换为静态网站的版本，适用于GitHub Pages部署。

## 功能特点

- ✅ 完全静态化，无需服务器环境
- ✅ 使用浏览器本地存储(LocalStorage)保存照片
- ✅ 响应式设计，适配移动端
- ✅ 现代化的UI界面
- ✅ 支持照片分页浏览和管理
- ✅ 自动清理过期数据(7天)

## 文件结构

```
网恋照妖镜/
├── index.html          # 主页面
├── capture.html        # 拍摄页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── main.js         # 主要脚本
└── README.md           # 说明文档
```

## 部署到GitHub Pages

### 方法一：使用GitHub仓库

1. 在GitHub上创建一个新的仓库
2. 将所有文件推送到仓库的`main`分支
3. 在仓库设置中启用GitHub Pages：
   - 进入 Settings → Pages
   - Source选择"Deploy from a branch"
   - Branch选择`main`，folder选择`/ (root)`
4. 等待几分钟，网站就会在 `https://用户名.github.io/仓库名` 上线

### 方法二：使用GitHub Pages向导

1. 登录GitHub，在主页点击"New repository"
2. 输入仓库名称(如：wanglian-zhaoyaojing)
3. 选择"Public"(私有仓库也可以)
4. 不要初始化README、.gitignore等文件
5. 创建仓库后，上传所有文件
6. 按照方法一中的步骤启用Pages

## 使用说明

### 生成拍摄链接
1. 在主页面输入唯一的ID标识
2. 设置拍摄后跳转的目标网址
3. 点击"生成链接"按钮
4. 复制生成的链接发送给目标对象

### 查看照片
1. 在主页面输入对应的ID
2. 点击"查看照片"按钮
3. 可以浏览、分页查看所有照片
4. 支持清空该ID下的所有照片

### 注意事项
- 照片保存在浏览器的LocalStorage中，清除浏览器数据会丢失照片
- 同一设备同一浏览器可以查看所有ID的照片
- 建议定期手动清理不需要的照片以节省存储空间
- 系统会自动清理7天前的照片数据

## 技术实现

- **前端框架**：纯HTML5 + CSS3 + JavaScript ES6+
- **存储方案**：localStorage (替代原来的服务器端存储)
- **兼容性**：现代浏览器(Chrome、Firefox、Safari、Edge)
- **响应式**：使用CSS Grid和Flexbox布局

## 浏览器要求

- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 15+

需要支持的API：
- `navigator.mediaDevices.getUserMedia` (摄像头访问)
- `localStorage` (数据存储)
- `Canvas API` (图像处理)

## 开发者说明

如果你想进一步开发或修改：

1. **修改样式**：编辑 `css/style.css`
2. **修改功能**：编辑 `js/main.js`
3. **修改页面结构**：编辑对应的HTML文件
4. **本地测试**：使用Python或其他HTTP服务器运行

```bash
# Python 3
python -m http.server 8000

# Node.js (需要安装http-server)
npx http-server -p 8000
```

## 安全提醒

⚠️ **重要**：本工具仅供学习交流使用，请勿用于非法用途！

- 请遵守当地法律法规
- 尊重他人隐私权
- 使用前请获得对方明确同意
- 作者不对任何滥用行为负责

## 版权声明

本项目基于原有PHP版本改造，保留原作者的版权声明。

---
最后更新：2026年2月3日