[English](#comfyui-storyboard) | [中文](#comfyui-storyboard-中文说明)

# ComfyUI Storyboard

**ComfyUI Storyboard** is a powerful custom node and interface extension for ComfyUI that enables efficient storyboard creation, management, and execution. It introduces a visual workflow for managing multiple "shots" (scenes) with individual prompts and camera settings, all integrated seamlessly into your existing ComfyUI workflows.

After installation, open a window here.
<img width="1926" height="834" alt="cc331" src="https://github.com/user-attachments/assets/e863a8e5-3801-4ded-8b1a-2038925ff7e9" />
The prompt word is delivered using a text message.
<img width="1821" height="846" alt="CC44" src="https://github.com/user-attachments/assets/5c9662ec-bef4-4f35-ad0d-9e7c509a09b0" />

<img width="2757" height="1887" alt="cc22" src="https://github.com/user-attachments/assets/11ffc853-9f48-4db5-8861-00e3dcfe78cd" />
<img width="2781" height="1899" alt="cc11" src="https://github.com/user-attachments/assets/e7dad75c-a272-4133-aec3-b3806e18860c" />

## ✨ Features

*   **Visual Storyboard Interface**: Manage multiple shots in a grid view.
*   **3D Camera Control**: Interactive 3D viewer to set camera angles (Azimuth, Elevation, Zoom) which automatically generates descriptive prompts (e.g., "front view", "high angle").
*   **Batch Execution**: Run individual shots or all shots in sequence.
*   **Workflow Integration**: Dynamically injects prompts and camera settings into your existing ComfyUI graph.
*   **Add to Workflow**: Converts your storyboard shots into actual nodes in the ComfyUI workspace for further editing.
*   **Data Persistence**: Automatically saves your storyboard data (shots, settings) using a local SQLite database, ensuring you never lose your work.
*   **Bilingual UI**: Fully supports English and Chinese interfaces.

## 📦 Installation

### Method 1: Via ComfyUI Manager
Search for `comfyui storyboard` in ComfyUI Manager and install.

### Method 2: Manual Installation
1.  Navigate to your ComfyUI `custom_nodes` directory.
2.  Clone this repository:
    ```bash
    git clone https://github.com/colorAi/comfyui-storyboard.git
    ```
3.  Restart ComfyUI.
4.  Open ComfyUI and refresh your browser.

## 🚀 Usage

### 1. Opening the Interface
Click the **"Storyboard"** button in the ComfyUI menu bar to open the main interface.

### 2. Configuring Nodes
At the top of the Storyboard interface, you need to map the nodes from your current workflow:

*   **Prompt Node**: Select the node where the text prompt should be injected (usually a CLIP Text Encode or similar).
*   **Save Image Node**: Select the node that handles saving or previewing the image (e.g., Save Image, Preview Image).
*   **Ref Image Node (Optional)**: Select a Load Image node if you are doing img2img workflows.

### 3. Managing Shots
*   **Add Shot**: Click "➕ Add Shot" to create a new storyboard panel.
*   **Edit Prompt**: Type your prompt directly into the shot card.
*   **Camera Settings**: Click the **"Camera"** button on a shot to open the 3D Camera tool. Adjust the angle and zoom, and the tool will generate a prompt description for you.

### 4. Running Generations
*   **Run Shot**: Click the "▶" button on a specific shot to generate just that image.
*   **Run All**: Click "▶ Run All" to generate all shots in sequence.

### 5. Add to Workflow
Click "📥 Add to Workflow" to output your generated storyboard shots as actual nodes into the main ComfyUI canvas. This is useful if you want to perform further complex processing on specific shots.

## 🔧 Requirements

*   ComfyUI (latest version recommended)
*   Python 3.x
*   Modern Browser (Chrome/Firefox/Edge) for the 3D features.

## 🙏 Acknowledgements
Special thanks to [jtydhr88](https://github.com/jtydhr88/ComfyUI-qwenmultiangle) for their project support!
If you think it's good, you can give the author a star to support them.

## 📄 License

MIT License.

---

# ComfyUI Storyboard (中文说明)

**ComfyUI Storyboard** 是一个功能强大的 ComfyUI 自定义节点和界面扩展，旨在实现高效的故事板创建、管理和执行。它引入了一个可视化的工作流，用于管理具有独立提示词和相机设置的多个“分镜”（场景），并无缝集成到您现有的 ComfyUI 工作流中。

安装完成，在这里打开
<img width="1926" height="834" alt="cc331" src="https://github.com/user-attachments/assets/e863a8e5-3801-4ded-8b1a-2038925ff7e9" />
提示词节点使用文本传递
<img width="1821" height="846" alt="CC44" src="https://github.com/user-attachments/assets/5c9662ec-bef4-4f35-ad0d-9e7c509a09b0" />

<img width="2757" height="1887" alt="cc22" src="https://github.com/user-attachments/assets/11ffc853-9f48-4db5-8861-00e3dcfe78cd" />
<img width="2781" height="1899" alt="cc11" src="https://github.com/user-attachments/assets/e7dad75c-a272-4133-aec3-b3806e18860c" />

## ✨ 功能特点

*   **可视化故事板界面**：在网格视图中管理多个分镜。
*   **3D 相机控制**：交互式 3D 查看器，用于设置相机角度（水平角、垂直角、缩放），并自动生成描述性提示词（例如“正面视图”、“高角度”）。
*   **批量执行**：运行单个分镜或按顺序运行所有分镜。
*   **工作流集成**：动态地将提示词和相机设置注入到现有的 ComfyUI 图表中。
*   **添加到工作流**：将您的故事板分镜转换为 ComfyUI 工作区中的实际节点，以便进行进一步编辑。
*   **数据持久化**：使用本地 SQLite 数据库自动保存您的故事板数据（分镜、设置），确保您的工作永不丢失。
*   **双语界面**：完全支持中文和英文界面。

## 📦 安装

### 方法 1：通过 ComfyUI Manager 安装
在管理器中搜索 `comfyui storyboard` 进行安装。

### 方法 2：手动安装
1.  进入您的 ComfyUI `custom_nodes` 目录。
2.  克隆此仓库：
    ```bash
    git clone https://github.com/colorAi/comfyui-storyboard.git
    ```
3.  重启 ComfyUI。
4.  打开 ComfyUI 并刷新浏览器。

## 🚀 使用说明

### 1. 打开界面
点击 ComfyUI 菜单栏中的 **“Storyboard”**（故事板）按钮以打开主界面。

### 2. 配置节点
在故事板界面的顶部，您需要映射当前工作流中的节点：

*   **提示词节点**：选择应注入文本提示词的节点（通常是 CLIP 文本编码器 或类似节点）。
*   **保存图像节点**：选择处理保存或预览图像的节点（例如 Save Image, Preview Image）。
*   **参考图节点（可选）**：如果您正在进行图生图工作流，请选择一个加载图像节点。

### 3. 管理分镜
*   **增加分镜**：点击“➕ 增加分镜”创建一个新的故事板面板。
*   **编辑提示词**：直接在分镜卡片中输入您的提示词。
*   **相机设置**：点击分镜上的 **“相机设置”** 按钮打开 3D 相机工具。调整角度和缩放，工具将为您生成提示词描述。

### 4. 运行生成
*   **运行分镜**：点击特定分镜上的“▶”按钮以仅生成该图像。
*   **一键运行**：点击“▶ 一键运行”按顺序生成所有分镜。

### 5. 添加到工作流
点击“📥 添加到工作流”将您生成的故事板分镜作为实际节点输出到主 ComfyUI 画布中。如果您想对特定分镜进行更复杂的处理，这非常有用。

## 🔧 需求

*   ComfyUI (推荐最新版本)
*   Python 3.x
*   现代浏览器 (Chrome/Firefox/Edge) 以支持 3D 功能。

## 🙏 致谢
感谢 [柯基大佬](https://github.com/jtydhr88/ComfyUI-qwenmultiangle) 的项目支持！
如果你觉得不错，可以给作者点个星以示支持。

## 📄 许可证

MIT License.
