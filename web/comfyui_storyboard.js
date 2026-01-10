import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

console.log("ComfyUI Storyboard: Extension loading...");

app.registerExtension({
    name: "ComfyUI.Storyboard",
    setup() {
        console.log("ComfyUI Storyboard: Setup called");

        // Translation System
        const translations = {
            zh: {
                title: "Storyboard Image Generation",
                promptNode: "提示词节点:",
                saveNode: "保存图像节点:",
                refNode: "参考图节点:",
                selectNode: "-- 选择节点 --",
                noRefNode: "-- 无 (文生图) --",
                refresh: "刷新节点列表",
                refreshTitle: "刷新节点列表",
                helpHint: "💡 不选参考图节点为文生图模式",
                run: "▶ 运行",
                running: "⏳ 运行中...",
                generating: "⏳ 生成中...",
                done: "✓ 完成",
                timeout: "⚠ 超时",
                failed: "✗ 失败",
                camera: "相机设置",
                delete: "✕",
                confirmDelete: "确认删除",
                confirmDeleteText: "确定要删除",
                cancel: "取消",
                confirm: "确认",
                resultPreview: "结果预览区",
                cameraSettings: "📷 机位设置",
                zoomShot: "缩放/景别:",
                promptToAdd: "将添加的提示词:",
                confirmAdd: "✓ 确认添加",
                promptLabel: "提示词:",
                placeholder: "输入此分镜的提示词...",
                addShot: "➕ 增加分镜",
                runAll: "▶ 一键运行",
                addToWorkflow: "📥 添加到工作流",
                noImagesToAdd: "没有已生成的图片可添加到工作流！",
                copyingImages: "⏳ 复制图片中...",
                copyFailed: "复制图片失败！请检查控制台。",
                creatingNodes: "⏳ 创建节点中...",
                addedNodes: "✓ 已添加",
                createFailed: "创建节点失败，请检查控制台错误信息",
                clearAll: "🗑️ 清空分镜",
                noShotsClear: "没有分镜可清空！",
                confirmClear: "确认清空",
                confirmClearAll: "确定要清空所有",
                cannotUndone: "个分镜吗？此操作不可恢复！",
                langBtn: "English",
                azimuth: "水平角度",
                elevation: "垂直角度",
                zoom: "缩放",
                pleaseSelect: "请先填写提示词节点 ID 和保存图像节点 ID！",
                pleaseSelectAll: "请先选择提示词节点和保存图像节点！",
                noShotsRun: "没有分镜卡片可运行！请先添加分镜。",
                shot: "Shot", // Internal mostly
                clickEnlarge: "点击放大查看",
                close: "✕ 关闭"
            },
            en: {
                title: "Storyboard Image Generation",
                promptNode: "Prompt Node:",
                saveNode: "Save Image Node:",
                refNode: "Ref Image Node:",
                selectNode: "-- Select Node --",
                noRefNode: "-- None (Txt2Img) --",
                refresh: "Refresh Nodes",
                refreshTitle: "Refresh Node List",
                helpHint: "💡 No Ref Node = Txt2Img Mode",
                run: "▶ Run",
                running: "⏳ Running...",
                generating: "⏳ Generating...",
                done: "✓ Done",
                timeout: "⚠ Timeout",
                failed: "✗ Failed",
                camera: "Camera",
                delete: "✕",
                confirmDelete: "Confirm Delete",
                confirmDeleteText: "Are you sure to delete",
                cancel: "Cancel",
                confirm: "Confirm",
                resultPreview: "Result Preview",
                cameraSettings: "📷 Camera Settings",
                zoomShot: "Zoom/Shot:",
                promptToAdd: "Prompt to add:",
                confirmAdd: "✓ Confirm Add",
                promptLabel: "Prompt:",
                placeholder: "Enter prompt for this shot...",
                addShot: "➕ Add Shot",
                runAll: "▶ Run All",
                addToWorkflow: "📥 Add to Workflow",
                noImagesToAdd: "No generated images to add!",
                copyingImages: "⏳ Copying images...",
                copyFailed: "Failed to copy images! Check console.",
                creatingNodes: "⏳ Creating nodes...",
                addedNodes: "✓ Added",
                createFailed: "Failed to create nodes, check console.",
                clearAll: "🗑️ Clear All",
                noShotsClear: "No shots to clear!",
                confirmClear: "Confirm Clear",
                confirmClearAll: "Are you sure to clear all",
                cannotUndone: "shots? This cannot be undone!",
                langBtn: "中文",
                azimuth: "Azimuth",
                elevation: "Elevation",
                zoom: "Zoom",
                pleaseSelect: "Please select prompt and save nodes first!",
                pleaseSelectAll: "Please select prompt and save nodes first!",
                noShotsRun: "No shots to run! Please add shots first.",
                shot: "Shot",
                clickEnlarge: "Click to enlarge",
                close: "✕ Close"
            }
        };

        let currentLang = 'zh'; // Default to Chinese
        const t = (key) => translations[currentLang][key] || key;

        const updateLanguage = () => {
            // Static elements
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.dataset.i18n;
                if (translations[currentLang][key]) {
                    el.textContent = translations[currentLang][key];
                }
            });

            // Update specific placeholders if needed
            const textareas = document.querySelectorAll('textarea[data-i18n-placeholder]');
            textareas.forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[currentLang][key]) {
                    el.placeholder = translations[currentLang][key];
                }
            });

            // Update language button text
            const langBtn = document.getElementById('storyboard-lang-btn');
            if (langBtn) {
                langBtn.textContent = translations[currentLang].langBtn;
            }
        };

        const createModal = () => {
            const modal = document.createElement("div");
            Object.assign(modal.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                zIndex: "10000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            });

            const content = document.createElement("div");
            Object.assign(content.style, {
                backgroundColor: "#222",
                padding: "12px 20px",
                borderRadius: "8px",
                width: "80%",
                height: "80%",
                color: "white",
                display: "flex",
                flexDirection: "column",
                position: "relative"
            });

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "X";
            Object.assign(closeBtn.style, {
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer"
            });
            closeBtn.onclick = () => document.body.removeChild(modal);

            // Header container with title
            const headerDiv = document.createElement("div");
            Object.assign(headerDiv.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
            });

            const title = document.createElement("h2");
            title.dataset.i18n = "title";
            title.textContent = t("title");
            Object.assign(title.style, {
                margin: "0",
                fontSize: "18px"
            });

            // Language Switch Button
            const langBtn = document.createElement("button");
            langBtn.id = "storyboard-lang-btn";
            langBtn.textContent = t("langBtn");
            Object.assign(langBtn.style, {
                padding: "4px 8px",
                backgroundColor: "#444",
                border: "1px solid #666",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                marginLeft: "12px"
            });
            langBtn.onclick = () => {
                currentLang = currentLang === 'zh' ? 'en' : 'zh';
                updateLanguage();
            };

            // Title container to hold title and lang button
            const titleContainer = document.createElement("div");
            Object.assign(titleContainer.style, {
                display: "flex",
                alignItems: "center"
            });
            titleContainer.appendChild(title);
            titleContainer.appendChild(langBtn);

            // Action buttons container (will be populated later)
            const headerButtonsContainer = document.createElement("div");
            Object.assign(headerButtonsContainer.style, {
                display: "flex",
                gap: "12px",
                marginRight: "40px"
            });

            headerDiv.appendChild(titleContainer);
            headerDiv.appendChild(headerButtonsContainer);

            const body = document.createElement("div");
            Object.assign(body.style, {
                marginTop: "10px",
                flex: "1",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px dashed #444",
                overflow: "hidden",
                backgroundColor: "#111"
            });

            // Default content - Storyboard Tool
            const defaultContent = document.createElement("div");
            Object.assign(defaultContent.style, {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            });

            // Configuration bar at top
            const configBar = document.createElement("div");
            Object.assign(configBar.style, {
                padding: "12px 16px",
                backgroundColor: "#2a2a2a",
                borderBottom: "1px solid #444",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap"
            });

            // Common select style
            const selectStyle = {
                minWidth: "120px",
                maxWidth: "160px",
                padding: "6px 8px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white",
                fontSize: "11px",
                cursor: "pointer"
            };

            // Prompt node select
            const promptNodeGroup = document.createElement("div");
            Object.assign(promptNodeGroup.style, {
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            const promptNodeLabel = document.createElement("label");
            promptNodeLabel.dataset.i18n = "promptNode";
            promptNodeLabel.textContent = t("promptNode");
            Object.assign(promptNodeLabel.style, {
                color: "#aaa",
                fontSize: "12px",
                whiteSpace: "nowrap"
            });
            const promptNodeInput = document.createElement("select");
            Object.assign(promptNodeInput.style, selectStyle);
            promptNodeGroup.appendChild(promptNodeLabel);
            promptNodeGroup.appendChild(promptNodeInput);

            // Save image node select
            const saveNodeGroup = document.createElement("div");
            Object.assign(saveNodeGroup.style, {
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            const saveNodeLabel = document.createElement("label");
            saveNodeLabel.dataset.i18n = "saveNode";
            saveNodeLabel.textContent = t("saveNode");
            Object.assign(saveNodeLabel.style, {
                color: "#aaa",
                fontSize: "12px",
                whiteSpace: "nowrap"
            });
            const saveNodeInput = document.createElement("select");
            Object.assign(saveNodeInput.style, selectStyle);
            saveNodeGroup.appendChild(saveNodeLabel);
            saveNodeGroup.appendChild(saveNodeInput);

            // Reference image node select (for img2img mode)
            const refImageNodeGroup = document.createElement("div");
            Object.assign(refImageNodeGroup.style, {
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            const refImageNodeLabel = document.createElement("label");
            refImageNodeLabel.dataset.i18n = "refNode";
            refImageNodeLabel.textContent = t("refNode");
            Object.assign(refImageNodeLabel.style, {
                color: "#aaa",
                fontSize: "12px",
                whiteSpace: "nowrap"
            });
            const refImageNodeInput = document.createElement("select");
            Object.assign(refImageNodeInput.style, selectStyle);
            refImageNodeGroup.appendChild(refImageNodeLabel);
            refImageNodeGroup.appendChild(refImageNodeInput);

            // Refresh button to reload node list
            const refreshBtn = document.createElement("button");
            refreshBtn.textContent = "🔄";
            refreshBtn.title = t("refreshTitle");
            // Note: Refresh button icon doesn't need translation, tooltip does but static updateLanguage doesn't handle title attribute easily. 
            // We can add logic to updateLanguage for title attribute if we want, but "Refresh Node List" is minor.
            // Let's stick to simple text toggle.
            refreshBtn.dataset.i18nTitle = "refreshTitle"; // We can handle this if we expand updateLanguage
            Object.assign(refreshBtn.style, {
                padding: "6px 10px",
                backgroundColor: "#444",
                border: "none",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer"
            });
            refreshBtn.onmouseenter = () => refreshBtn.style.backgroundColor = "#555";
            refreshBtn.onmouseleave = () => refreshBtn.style.backgroundColor = "#444";

            // Function to populate node selects from current workflow
            const populateNodeSelects = () => {
                // Clear existing options
                promptNodeInput.innerHTML = `<option value="">${t('selectNode')}</option>`;
                saveNodeInput.innerHTML = `<option value="">${t('selectNode')}</option>`;
                refImageNodeInput.innerHTML = `<option value="">${t('noRefNode')}</option>`;

                if (!app.graph || !app.graph._nodes) return;

                const nodes = app.graph._nodes;
                nodes.forEach(node => {
                    if (!node) return;
                    const nodeId = node.id;
                    const nodeType = node.type || "Unknown";
                    const nodeTitle = node.title || nodeType;
                    const optionText = `[${nodeId}] ${nodeTitle}`;

                    // Add to prompt node (text/prompt related)
                    const promptOption = document.createElement("option");
                    promptOption.value = nodeId;
                    promptOption.textContent = optionText;
                    promptNodeInput.appendChild(promptOption);

                    // Add to save node (save/preview related)
                    const saveOption = document.createElement("option");
                    saveOption.value = nodeId;
                    saveOption.textContent = optionText;
                    saveNodeInput.appendChild(saveOption);

                    // Add to ref image node (load image related)
                    const refOption = document.createElement("option");
                    refOption.value = nodeId;
                    refOption.textContent = optionText;
                    refImageNodeInput.appendChild(refOption);
                });
            };

            refreshBtn.onclick = populateNodeSelects;

            // Initial population of node selects
            setTimeout(() => {
                populateNodeSelects();
            }, 100);

            // Help hint
            const helpHint = document.createElement("span");
            helpHint.dataset.i18n = "helpHint";
            helpHint.textContent = t("helpHint");
            Object.assign(helpHint.style, {
                color: "#666",
                fontSize: "11px",
                marginLeft: "auto"
            });

            configBar.appendChild(promptNodeGroup);
            configBar.appendChild(saveNodeGroup);
            configBar.appendChild(refImageNodeGroup);
            configBar.appendChild(refreshBtn);
            configBar.appendChild(helpHint);

            // Cards container (scrollable grid)
            const cardsContainer = document.createElement("div");
            Object.assign(cardsContainer.style, {
                flex: "1",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridAutoRows: "min-content",
                gap: "16px",
                padding: "16px",
                overflowY: "auto",
                alignContent: "start"
            });

            // Shot counter for naming
            let shotSequence = 1;

            // Use a simple fixed storage key for storyboard data
            // This ensures data persists regardless of workflow changes
            const getStorageKey = () => {
                return 'comfyui_storyboard_data';
            };

            // Save storyboard data to localStorage
            // Save storyboard data to backend
            const saveStoryboardData = async () => {
                const cards = cardsContainer.querySelectorAll("[data-shot-name]");
                const cardDataList = [];
                cards.forEach(card => {
                    if (card.shotData) {
                        cardDataList.push({
                            shotName: card.shotData.name,
                            prompt: card.shotData.promptInput.value || "",
                            imageUrl: card.shotData.lastImageUrl || null,
                            generateCount: card.shotData.getGenerateCount(),
                            cameraSettings: card.shotData.cameraSettings || { horizontal: 0, vertical: 0, zoom: 5 }
                        });
                    }
                });

                const data = {
                    promptNodeId: promptNodeInput.value,
                    saveNodeId: saveNodeInput.value,
                    refImageNodeId: refImageNodeInput.value,
                    shotSequence: shotSequence,
                    cards: cardDataList
                };

                try {
                    await api.fetchApi("/storyboard/save", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" }
                    });
                } catch (e) {
                    console.error("Failed to save storyboard data:", e);
                }
            };

            // Camera Settings Modal with 3D Viewer
            const openCameraSettingsModal = (shotData, refImageNodeId) => {
                const promptInput = shotData.promptInput;
                const savedSettings = shotData.cameraSettings || { horizontal: 0, vertical: 0, zoom: 5 };

                // Create modal overlay
                const modalOverlay = document.createElement("div");
                Object.assign(modalOverlay.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    zIndex: "25000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                });

                // Modal content
                const modalContent = document.createElement("div");
                Object.assign(modalContent.style, {
                    backgroundColor: "#1a1a1a",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #444",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    width: "500px",
                    maxWidth: "90vw"
                });

                // Modal header
                const modalHeader = document.createElement("div");
                Object.assign(modalHeader.style, {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px"
                });

                const modalTitle = document.createElement("h3");
                modalTitle.textContent = t("cameraSettings"); // Dynamic content, re-rendered on open
                Object.assign(modalTitle.style, {
                    margin: "0",
                    color: "#44ccff",
                    fontSize: "18px"
                });

                const closeModalBtn = document.createElement("button");
                closeModalBtn.textContent = "✕";
                Object.assign(closeModalBtn.style, {
                    background: "transparent",
                    border: "none",
                    color: "#888",
                    fontSize: "20px",
                    cursor: "pointer"
                });
                closeModalBtn.onclick = () => modalOverlay.remove();

                modalHeader.appendChild(modalTitle);
                modalHeader.appendChild(closeModalBtn);

                // 3D Viewer Container (iframe)
                const viewerContainer = document.createElement("div");
                Object.assign(viewerContainer.style, {
                    width: "100%",
                    height: "350px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    marginBottom: "16px",
                    border: "1px solid #333"
                });

                // Create inline HTML for 3D viewer
                const viewerHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 100%; height: 100vh; overflow: hidden;
            background: #0a0a0f;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #container { width: 100%; height: 100%; position: relative; }
        #threejs-container { width: 100%; height: 100%; }
        #prompt-preview {
            position: absolute; top: 8px; left: 8px; right: 8px;
            background: rgba(10, 10, 15, 0.9);
            border: 1px solid rgba(68, 204, 255, 0.3);
            border-radius: 6px; padding: 6px 10px;
            font-size: 12px; color: #44ccff;
            backdrop-filter: blur(4px);
            font-family: 'Consolas', 'Monaco', monospace;
        }
        #info-panel {
            position: absolute; bottom: 8px; left: 8px; right: 8px;
            background: rgba(10, 10, 15, 0.9);
            border: 1px solid rgba(68, 204, 255, 0.3);
            border-radius: 6px; padding: 8px 12px;
            font-size: 11px; color: #e0e0e0;
            display: flex; justify-content: space-around;
            backdrop-filter: blur(4px);
        }
        .param-item { text-align: center; }
        .param-label { color: #888; font-size: 10px; text-transform: uppercase; }
        .param-value { color: #44ccff; font-weight: 600; font-size: 13px; }
        .param-value.elevation { color: #00FFD0; }
        .param-value.zoom { color: #FFB800; }
    </style>
</head>
<body>
    <div id="container">
        <div id="threejs-container"></div>
        <div id="prompt-preview">front view, eye level, medium shot</div>
        <div id="info-panel">
            <div class="param-item">
                <div class="param-label">${t('azimuth')}</div>
                <div class="param-value" id="h-value">0°</div>
            </div>
            <div class="param-item">
                <div class="param-label">${t('elevation')}</div>
                <div class="param-value elevation" id="v-value">0°</div>
            </div>
            <div class="param-item">
                <div class="param-label">${t('zoom')}</div>
                <div class="param-value zoom" id="z-value">5.0</div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        let state = { azimuth: 0, elevation: 0, distance: 5 };
        let threeScene = null;
        const container = document.getElementById('threejs-container');
        const hValueEl = document.getElementById('h-value');
        const vValueEl = document.getElementById('v-value');
        const zValueEl = document.getElementById('z-value');
        const promptPreviewEl = document.getElementById('prompt-preview');

        function generatePromptPreview() {
            const h_angle = ((state.azimuth % 360) + 360) % 360;
            let h_direction;
            if (h_angle < 22.5 || h_angle >= 337.5) h_direction = "front view";
            else if (h_angle < 67.5) h_direction = "front-right view";
            else if (h_angle < 112.5) h_direction = "right side view";
            else if (h_angle < 157.5) h_direction = "back-right view";
            else if (h_angle < 202.5) h_direction = "back view";
            else if (h_angle < 247.5) h_direction = "back-left view";
            else if (h_angle < 292.5) h_direction = "left side view";
            else h_direction = "front-left view";

            let v_direction;
            if (state.elevation < -15) v_direction = "low angle";
            else if (state.elevation < 15) v_direction = "eye level";
            else if (state.elevation < 45) v_direction = "high angle";
            else if (state.elevation < 75) v_direction = "bird's eye view";
            else v_direction = "top-down view";

            let distance;
            if (state.distance < 2) distance = "wide shot";
            else if (state.distance < 4) distance = "medium-wide shot";
            else if (state.distance < 6) distance = "medium shot";
            else if (state.distance < 8) distance = "medium close-up";
            else distance = "close-up";

            return h_direction + ", " + v_direction + ", " + distance;
        }

        function updateDisplay() {
            hValueEl.textContent = Math.round(state.azimuth) + '°';
            vValueEl.textContent = Math.round(state.elevation) + '°';
            zValueEl.textContent = state.distance.toFixed(1);
            promptPreviewEl.textContent = generatePromptPreview();
        }

        function sendAngleUpdate() {
            window.parent.postMessage({
                type: 'CAMERA_ANGLE_UPDATE',
                horizontal: Math.round(state.azimuth),
                vertical: Math.round(state.elevation),
                zoom: Math.round(state.distance * 10) / 10,
                prompt: generatePromptPreview()
            }, '*');
        }

        function initThreeJS() {
            const width = container.clientWidth;
            const height = container.clientHeight;

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0f);

            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.set(4, 3.5, 4);
            camera.lookAt(0, 0.3, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
            mainLight.position.set(5, 10, 5);
            scene.add(mainLight);

            const gridHelper = new THREE.GridHelper(5, 20, 0x1a1a2e, 0x12121a);
            gridHelper.position.y = -0.01;
            scene.add(gridHelper);

            const CENTER = new THREE.Vector3(0, 0.5, 0);
            const AZIMUTH_RADIUS = 1.8;
            const ELEVATION_RADIUS = 1.4;
            const ELEV_ARC_X = -0.8;

            let liveAzimuth = state.azimuth;
            let liveElevation = state.elevation;
            let liveDistance = state.distance;

            // Subject plane
            const planeGeo = new THREE.PlaneGeometry(1.2, 1.2);
            const planeMat = new THREE.MeshBasicMaterial({ color: 0x3a3a4a, side: THREE.DoubleSide });
            const imagePlane = new THREE.Mesh(planeGeo, planeMat);
            imagePlane.position.copy(CENTER);
            scene.add(imagePlane);

            const frameGeo = new THREE.EdgesGeometry(planeGeo);
            const frameMat = new THREE.LineBasicMaterial({ color: 0x44ccff });
            const imageFrame = new THREE.LineSegments(frameGeo, frameMat);
            imageFrame.position.copy(CENTER);
            scene.add(imageFrame);

            // Camera indicator
            const camGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
            const camMat = new THREE.MeshStandardMaterial({
                color: 0x44ccff, emissive: 0x44ccff, emissiveIntensity: 0.5,
                metalness: 0.8, roughness: 0.2
            });
            const cameraIndicator = new THREE.Mesh(camGeo, camMat);
            scene.add(cameraIndicator);

            // Azimuth ring
            const azRingGeo = new THREE.TorusGeometry(AZIMUTH_RADIUS, 0.04, 16, 100);
            const azRingMat = new THREE.MeshBasicMaterial({ color: 0x44ccff, transparent: true, opacity: 0.7 });
            const azimuthRing = new THREE.Mesh(azRingGeo, azRingMat);
            azimuthRing.rotation.x = Math.PI / 2;
            azimuthRing.position.y = 0.02;
            scene.add(azimuthRing);

            // Azimuth handle
            const azHandleGeo = new THREE.SphereGeometry(0.16, 32, 32);
            const azHandleMat = new THREE.MeshStandardMaterial({
                color: 0x44ccff, emissive: 0x44ccff, emissiveIntensity: 0.6,
                metalness: 0.3, roughness: 0.4
            });
            const azimuthHandle = new THREE.Mesh(azHandleGeo, azHandleMat);
            scene.add(azimuthHandle);

            // Elevation arc
            const arcPoints = [];
            for (let i = 0; i <= 32; i++) {
                const angle = (-30 + (120 * i / 32)) * Math.PI / 180;
                arcPoints.push(new THREE.Vector3(
                    ELEV_ARC_X,
                    ELEVATION_RADIUS * Math.sin(angle) + CENTER.y,
                    ELEVATION_RADIUS * Math.cos(angle)
                ));
            }
            const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
            const elArcGeo = new THREE.TubeGeometry(arcCurve, 32, 0.04, 8, false);
            const elArcMat = new THREE.MeshBasicMaterial({ color: 0x00FFD0, transparent: true, opacity: 0.8 });
            const elevationArc = new THREE.Mesh(elArcGeo, elArcMat);
            scene.add(elevationArc);

            // Elevation handle
            const elHandleGeo = new THREE.SphereGeometry(0.16, 32, 32);
            const elHandleMat = new THREE.MeshStandardMaterial({
                color: 0x00FFD0, emissive: 0x00FFD0, emissiveIntensity: 0.6,
                metalness: 0.3, roughness: 0.4
            });
            const elevationHandle = new THREE.Mesh(elHandleGeo, elHandleMat);
            scene.add(elevationHandle);

            // Distance handle
            const distHandleGeo = new THREE.SphereGeometry(0.15, 32, 32);
            const distHandleMat = new THREE.MeshStandardMaterial({
                color: 0xFFB800, emissive: 0xFFB800, emissiveIntensity: 0.7,
                metalness: 0.5, roughness: 0.3
            });
            const distanceHandle = new THREE.Mesh(distHandleGeo, distHandleMat);
            scene.add(distanceHandle);

            // Distance line
            let distanceTube = null;
            function updateDistanceLine(start, end) {
                if (distanceTube) scene.remove(distanceTube);
                const path = new THREE.LineCurve3(start, end);
                const tubeGeo = new THREE.TubeGeometry(path, 1, 0.025, 8, false);
                const tubeMat = new THREE.MeshBasicMaterial({ color: 0xFFB800, transparent: true, opacity: 0.8 });
                distanceTube = new THREE.Mesh(tubeGeo, tubeMat);
                scene.add(distanceTube);
            }

            function updateVisuals() {
                const azRad = (liveAzimuth * Math.PI) / 180;
                const elRad = (liveElevation * Math.PI) / 180;
                const visualDist = 2.6 - (liveDistance / 10) * 2.0;

                const camX = visualDist * Math.sin(azRad) * Math.cos(elRad);
                const camY = CENTER.y + visualDist * Math.sin(elRad);
                const camZ = visualDist * Math.cos(azRad) * Math.cos(elRad);

                cameraIndicator.position.set(camX, camY, camZ);
                cameraIndicator.lookAt(CENTER);
                cameraIndicator.rotateX(Math.PI / 2);

                const azX = AZIMUTH_RADIUS * Math.sin(azRad);
                const azZ = AZIMUTH_RADIUS * Math.cos(azRad);
                azimuthHandle.position.set(azX, 0.16, azZ);

                const elY = CENTER.y + ELEVATION_RADIUS * Math.sin(elRad);
                const elZ = ELEVATION_RADIUS * Math.cos(elRad);
                elevationHandle.position.set(ELEV_ARC_X, elY, elZ);

                const distT = 0.15 + ((10 - liveDistance) / 10) * 0.7;
                distanceHandle.position.lerpVectors(CENTER, cameraIndicator.position, distT);

                updateDistanceLine(CENTER.clone(), cameraIndicator.position.clone());
            }

            updateVisuals();

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            let isDragging = false;
            let dragTarget = null;

            function getMousePos(event) {
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            }

            function onPointerDown(event) {
                getMousePos(event);
                raycaster.setFromCamera(mouse, camera);

                const handles = [
                    { mesh: azimuthHandle, name: 'azimuth' },
                    { mesh: elevationHandle, name: 'elevation' },
                    { mesh: distanceHandle, name: 'distance' }
                ];

                for (const h of handles) {
                    if (raycaster.intersectObject(h.mesh).length > 0) {
                        isDragging = true;
                        dragTarget = h.name;
                        renderer.domElement.style.cursor = 'grabbing';
                        return;
                    }
                }
            }

            function onPointerMove(event) {
                getMousePos(event);
                raycaster.setFromCamera(mouse, camera);

                if (!isDragging) {
                    const handles = [azimuthHandle, elevationHandle, distanceHandle];
                    let found = false;
                    for (const h of handles) {
                        if (raycaster.intersectObject(h).length > 0) {
                            found = true;
                            break;
                        }
                    }
                    renderer.domElement.style.cursor = found ? 'grab' : 'default';
                    return;
                }

                const plane = new THREE.Plane();
                const intersect = new THREE.Vector3();

                if (dragTarget === 'azimuth') {
                    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0));
                    if (raycaster.ray.intersectPlane(plane, intersect)) {
                        let angle = Math.atan2(intersect.x, intersect.z) * (180 / Math.PI);
                        if (angle < 0) angle += 360;
                        liveAzimuth = Math.max(0, Math.min(360, angle));
                        state.azimuth = Math.round(liveAzimuth);
                        updateDisplay();
                        updateVisuals();
                        sendAngleUpdate();
                    }
                } else if (dragTarget === 'elevation') {
                    const elevPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -ELEV_ARC_X);
                    if (raycaster.ray.intersectPlane(elevPlane, intersect)) {
                        const relY = intersect.y - CENTER.y;
                        const relZ = intersect.z;
                        let angle = Math.atan2(relY, relZ) * (180 / Math.PI);
                        angle = Math.max(-30, Math.min(90, angle));
                        liveElevation = angle;
                        state.elevation = Math.round(liveElevation);
                        updateDisplay();
                        updateVisuals();
                        sendAngleUpdate();
                    }
                } else if (dragTarget === 'distance') {
                    const newDist = 5 - mouse.y * 5;
                    liveDistance = Math.max(0, Math.min(10, newDist));
                    state.distance = Math.round(liveDistance * 10) / 10;
                    updateDisplay();
                    updateVisuals();
                    sendAngleUpdate();
                }
            }

            function onPointerUp() {
                isDragging = false;
                dragTarget = null;
                renderer.domElement.style.cursor = 'default';
            }

            renderer.domElement.addEventListener('mousedown', onPointerDown);
            renderer.domElement.addEventListener('mousemove', onPointerMove);
            renderer.domElement.addEventListener('mouseup', onPointerUp);
            renderer.domElement.addEventListener('mouseleave', onPointerUp);

            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                const w = container.clientWidth;
                const h = container.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            });

            // Expose update functions globally
            window.threeScene = {
                setZoom: (zoomValue) => {
                    liveDistance = zoomValue;
                    state.distance = zoomValue;
                    updateVisuals();
                    updateDisplay();
                    sendAngleUpdate();
                },
                setHorizontal: (angle) => {
                    liveAzimuth = angle;
                    state.azimuth = angle;
                    updateVisuals();
                    updateDisplay();
                    sendAngleUpdate();
                },
                setVertical: (angle) => {
                    liveElevation = angle;
                    state.elevation = angle;
                    updateVisuals();
                    updateDisplay();
                    sendAngleUpdate();
                },
                updateImage: (url) => {
                    if (!url) {
                        planeMat.map = null;
                        planeMat.color.set(0x3a3a4a);
                        planeMat.needsUpdate = true;
                        imagePlane.scale.set(1, 1, 1);
                        imageFrame.scale.set(1, 1, 1);
                        return;
                    }
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        const tex = new THREE.Texture(img);
                        tex.needsUpdate = true;
                        planeMat.map = tex;
                        planeMat.color.set(0xffffff);
                        planeMat.needsUpdate = true;
                        const ar = img.width / img.height;
                        const maxSize = 1.5;
                        let scaleX, scaleY;
                        if (ar > 1) { scaleX = maxSize; scaleY = maxSize / ar; }
                        else { scaleY = maxSize; scaleX = maxSize * ar; }
                        imagePlane.scale.set(scaleX, scaleY, 1);
                        imageFrame.scale.set(scaleX, scaleY, 1);
                    };
                    img.src = url;
                }
            };
        }

        // Message handler
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.type === 'SET_ZOOM') {
                if (window.threeScene && window.threeScene.setZoom) {
                    window.threeScene.setZoom(data.zoom);
                }
            } else if (data.type === 'UPDATE_IMAGE') {
                if (window.threeScene && window.threeScene.updateImage) {
                    window.threeScene.updateImage(data.imageUrl);
                }
            } else if (data.type === 'INIT_SETTINGS') {
                state.azimuth = data.horizontal || 0;
                state.elevation = data.vertical || 0;
                state.distance = data.zoom || 5;
                if (window.threeScene) {
                    window.threeScene.setZoom(state.distance);
                    window.threeScene.setHorizontal && window.threeScene.setHorizontal(state.azimuth);
                    window.threeScene.setVertical && window.threeScene.setVertical(state.elevation);
                }
                updateDisplay();
                sendAngleUpdate();
            }
        });

        initThreeJS();
        updateDisplay();
        sendAngleUpdate();

        // Notify parent that viewer is ready
        window.parent.postMessage({ type: 'VIEWER_READY' }, '*');
    </script>
</body>
</html>`;

                const blob = new Blob([viewerHTML], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);

                const iframe = document.createElement("iframe");
                Object.assign(iframe.style, {
                    width: "100%",
                    height: "100%",
                    border: "none",
                    backgroundColor: "#0a0a0f",
                    borderRadius: "8px"
                });
                iframe.src = blobUrl;
                viewerContainer.appendChild(iframe);

                // Load reference image if node ID is provided
                let iframeReady = false;
                let pendingImageUrl = null;

                const sendImageToViewer = (imageUrl) => {
                    if (iframe.contentWindow && iframeReady) {
                        iframe.contentWindow.postMessage({
                            type: 'UPDATE_IMAGE',
                            imageUrl: imageUrl
                        }, '*');
                    } else {
                        pendingImageUrl = imageUrl;
                    }
                };

                // Try to get image from the load image node
                if (refImageNodeId && app.graph && app.graph._nodes) {
                    const node = app.graph._nodes.find(n => n && n.id == refImageNodeId);
                    console.log("Camera Settings: Found node", node);

                    if (node) {
                        let imageUrl = null;

                        // Method 1: Try node.imgs (for already loaded/previewed images)
                        if (node.imgs && node.imgs.length > 0) {
                            const img = node.imgs[0];
                            if (img && img.src) {
                                imageUrl = img.src;
                                console.log("Camera Settings: Using node.imgs", imageUrl);
                            }
                        }

                        // Method 2: Try widget value (for LoadImage node)
                        if (!imageUrl && node.widgets) {
                            const imageWidget = node.widgets.find(w => w.name === 'image');
                            if (imageWidget && imageWidget.value) {
                                let imageName = imageWidget.value;
                                console.log("Camera Settings: Widget value", imageName);

                                // Handle subfolder format: "subfolder/filename" or just "filename"
                                if (imageName.includes('/')) {
                                    const parts = imageName.split('/');
                                    const subfolder = parts.slice(0, -1).join('/');
                                    const filename = parts[parts.length - 1];
                                    imageUrl = `/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=input`;
                                } else {
                                    imageUrl = `/view?filename=${encodeURIComponent(imageName)}&type=input`;
                                }
                                console.log("Camera Settings: Built URL", imageUrl);
                            }
                        }

                        // Method 3: Try node.properties.image
                        if (!imageUrl && node.properties && node.properties.image) {
                            const imageName = node.properties.image;
                            imageUrl = `/view?filename=${encodeURIComponent(imageName)}&type=input`;
                            console.log("Camera Settings: Using properties.image", imageUrl);
                        }

                        if (imageUrl) {
                            // Wait a bit for iframe to be ready, then send
                            const trySendImage = () => {
                                if (iframeReady) {
                                    sendImageToViewer(imageUrl);
                                } else {
                                    pendingImageUrl = imageUrl;
                                }
                            };
                            setTimeout(trySendImage, 300);
                        }
                    }
                }

                // Zoom slider control
                const sliderContainer = document.createElement("div");
                Object.assign(sliderContainer.style, {
                    backgroundColor: "#2a2a2a",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "12px"
                });

                const sliderRow = document.createElement("div");
                Object.assign(sliderRow.style, {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                });

                const sliderLabel = document.createElement("label");
                sliderLabel.textContent = t("zoomShot");
                Object.assign(sliderLabel.style, {
                    color: "#FFB800",
                    fontSize: "12px",
                    fontWeight: "bold",
                    minWidth: "70px"
                });

                const zoomSlider = document.createElement("input");
                zoomSlider.type = "range";
                zoomSlider.min = "0";
                zoomSlider.max = "100";
                zoomSlider.value = String(savedSettings.zoom * 10);
                Object.assign(zoomSlider.style, {
                    flex: "1",
                    accentColor: "#FFB800",
                    cursor: "pointer"
                });

                const zoomValueDisplay = document.createElement("span");
                zoomValueDisplay.textContent = savedSettings.zoom.toFixed(1);
                Object.assign(zoomValueDisplay.style, {
                    color: "#FFB800",
                    fontSize: "12px",
                    fontWeight: "bold",
                    minWidth: "30px",
                    textAlign: "right"
                });

                // Initial description based on saved zoom
                const getZoomDescription = (zoomValue) => {
                    if (zoomValue < 2) return "wide shot";
                    else if (zoomValue < 4) return "medium-wide shot";
                    else if (zoomValue < 6) return "medium shot";
                    else if (zoomValue < 8) return "medium close-up";
                    else return "close-up";
                };

                const zoomDescription = document.createElement("span");
                zoomDescription.textContent = getZoomDescription(savedSettings.zoom);
                Object.assign(zoomDescription.style, {
                    color: "#888",
                    fontSize: "11px",
                    minWidth: "100px"
                });

                zoomSlider.oninput = () => {
                    const zoomValue = parseFloat(zoomSlider.value) / 10;
                    zoomValueDisplay.textContent = zoomValue.toFixed(1);

                    // Update description
                    let desc;
                    if (zoomValue < 2) desc = "wide shot";
                    else if (zoomValue < 4) desc = "medium-wide shot";
                    else if (zoomValue < 6) desc = "medium shot";
                    else if (zoomValue < 8) desc = "medium close-up";
                    else desc = "close-up";
                    zoomDescription.textContent = desc;

                    // Send to iframe
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                            type: 'SET_ZOOM',
                            zoom: zoomValue
                        }, '*');
                    }
                };

                sliderRow.appendChild(sliderLabel);
                sliderRow.appendChild(zoomSlider);
                sliderRow.appendChild(zoomValueDisplay);
                sliderRow.appendChild(zoomDescription);
                sliderContainer.appendChild(sliderRow);

                // Prompt preview area
                let currentPrompt = "front view, eye level, medium shot";

                const promptPreviewArea = document.createElement("div");
                Object.assign(promptPreviewArea.style, {
                    backgroundColor: "#2a2a2a",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "16px"
                });

                const promptPreviewLabel = document.createElement("div");
                promptPreviewLabel.textContent = t("promptToAdd");
                Object.assign(promptPreviewLabel.style, {
                    color: "#888",
                    fontSize: "11px",
                    marginBottom: "6px"
                });

                const promptPreviewText = document.createElement("div");
                promptPreviewText.textContent = currentPrompt;
                Object.assign(promptPreviewText.style, {
                    color: "#44ccff",
                    fontSize: "14px",
                    fontFamily: "'Consolas', 'Monaco', monospace"
                });

                promptPreviewArea.appendChild(promptPreviewLabel);
                promptPreviewArea.appendChild(promptPreviewText);

                // Track current camera settings for saving
                let currentSettings = { ...savedSettings };

                // Listen for messages from iframe
                const handleMessage = (event) => {
                    if (event.source !== iframe.contentWindow) return;
                    const data = event.data;
                    if (data.type === 'CAMERA_ANGLE_UPDATE') {
                        currentPrompt = data.prompt;
                        promptPreviewText.textContent = currentPrompt;
                        // Update current settings for saving
                        if (data.horizontal !== undefined) currentSettings.horizontal = data.horizontal;
                        if (data.vertical !== undefined) currentSettings.vertical = data.vertical;
                        if (data.zoom !== undefined) currentSettings.zoom = data.zoom;
                        // Sync slider with viewer
                        if (data.zoom !== undefined) {
                            zoomSlider.value = data.zoom * 10;
                            zoomValueDisplay.textContent = data.zoom.toFixed(1);
                            zoomDescription.textContent = getZoomDescription(data.zoom);
                        }
                    } else if (data.type === 'VIEWER_READY') {
                        iframeReady = true;
                        // Send initial camera settings
                        iframe.contentWindow.postMessage({
                            type: 'INIT_SETTINGS',
                            horizontal: savedSettings.horizontal,
                            vertical: savedSettings.vertical,
                            zoom: savedSettings.zoom
                        }, '*');
                        // Send pending image if any
                        if (pendingImageUrl) {
                            sendImageToViewer(pendingImageUrl);
                            pendingImageUrl = null;
                        }
                    }
                };
                window.addEventListener('message', handleMessage);

                // Button container
                const buttonContainer = document.createElement("div");
                Object.assign(buttonContainer.style, {
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px"
                });

                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = t("cancel");
                Object.assign(cancelBtn.style, {
                    padding: "10px 24px",
                    backgroundColor: "#444",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer"
                });
                cancelBtn.onmouseenter = () => cancelBtn.style.backgroundColor = "#555";
                cancelBtn.onmouseleave = () => cancelBtn.style.backgroundColor = "#444";
                cancelBtn.onclick = () => {
                    window.removeEventListener('message', handleMessage);
                    URL.revokeObjectURL(blobUrl);
                    modalOverlay.remove();
                };

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = t("confirmAdd");
                Object.assign(confirmBtn.style, {
                    padding: "10px 24px",
                    backgroundColor: "#44aa44",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "bold"
                });
                confirmBtn.onmouseenter = () => confirmBtn.style.backgroundColor = "#55bb55";
                confirmBtn.onmouseleave = () => confirmBtn.style.backgroundColor = "#44aa44";
                confirmBtn.onclick = () => {
                    // Save camera settings to shotData
                    shotData.cameraSettings = { ...currentSettings };
                    // Append prompt to textarea
                    const existingText = promptInput.value.trim();
                    if (existingText) {
                        promptInput.value = existingText + ", " + currentPrompt;
                    } else {
                        promptInput.value = currentPrompt;
                    }
                    window.removeEventListener('message', handleMessage);
                    URL.revokeObjectURL(blobUrl);
                    modalOverlay.remove();
                    saveStoryboardData();
                };

                buttonContainer.appendChild(cancelBtn);
                buttonContainer.appendChild(confirmBtn);

                // Assemble modal
                modalContent.appendChild(modalHeader);
                modalContent.appendChild(viewerContainer);
                modalContent.appendChild(sliderContainer);
                modalContent.appendChild(promptPreviewArea);
                modalContent.appendChild(buttonContainer);
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);

                // ESC to close
                const handleEsc = (e) => {
                    if (e.key === "Escape") {
                        window.removeEventListener('message', handleMessage);
                        URL.revokeObjectURL(blobUrl);
                        modalOverlay.remove();
                        document.removeEventListener("keydown", handleEsc);
                    }
                };
                document.addEventListener("keydown", handleEsc);
            };

            // Create a storyboard card (optionally with initial data)
            const createCard = (initialData = null) => {
                let shotName, generateCount;

                if (initialData) {
                    shotName = initialData.shotName;
                    generateCount = initialData.generateCount || 0;
                } else {
                    shotName = `shot_${String(shotSequence).padStart(3, '0')}`;
                    generateCount = 0;
                    shotSequence++;
                }

                const card = document.createElement("div");
                card.dataset.shotName = shotName;
                Object.assign(card.style, {
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    overflow: "hidden",
                    height: "fit-content"
                });

                // Card header with shot name
                const header = document.createElement("div");
                Object.assign(header.style, {
                    padding: "8px 12px",
                    backgroundColor: "#333",
                    borderBottom: "1px solid #444",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                });

                const shotLabel = document.createElement("span");
                shotLabel.textContent = shotName;
                Object.assign(shotLabel.style, {
                    color: "#44ccff",
                    fontWeight: "bold",
                    fontSize: "12px",
                    fontFamily: "monospace"
                });

                // Run button
                const runBtn = document.createElement("button");
                runBtn.textContent = t("run"); // Initial text
                runBtn.dataset.i18n = "run"; // Key for translation
                Object.assign(runBtn.style, {
                    padding: "4px 10px",
                    backgroundColor: "#44aa44",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: "bold"
                });
                runBtn.onmouseenter = () => runBtn.style.backgroundColor = "#55bb55";
                runBtn.onmouseleave = () => runBtn.style.backgroundColor = "#44aa44";
                runBtn.onclick = async () => {
                    // Validate node IDs
                    const promptNodeId = promptNodeInput.value.trim();
                    const saveNodeId = saveNodeInput.value.trim();
                    const refImageNodeId = refImageNodeInput.value.trim();

                    if (!promptNodeId || !saveNodeId) {
                        alert(t("pleaseSelect"));
                        return;
                    }

                    runBtn.disabled = true;
                    runBtn.removeAttribute("data-i18n"); // Remove i18n while running to prevent overwrite
                    runBtn.textContent = t("running");
                    runBtn.style.backgroundColor = "#888";

                    try {
                        // Increment generation counter for file naming
                        generateCount++;
                        const fileName = `${shotName}_${String(generateCount).padStart(4, '0')}`;

                        // Get the prompt text from this card
                        const cardPromptText = card.shotData.promptInput.value || "";

                        // Get current graph and modify it
                        const graphData = await app.graphToPrompt();
                        const workflow = graphData.output;

                        // Update the prompt node with card's prompt text
                        if (workflow[promptNodeId] && workflow[promptNodeId].inputs) {
                            // Try common prompt input names
                            if ('text' in workflow[promptNodeId].inputs) {
                                workflow[promptNodeId].inputs.text = cardPromptText;
                            } else if ('prompt' in workflow[promptNodeId].inputs) {
                                workflow[promptNodeId].inputs.prompt = cardPromptText;
                            } else if ('positive' in workflow[promptNodeId].inputs) {
                                workflow[promptNodeId].inputs.positive = cardPromptText;
                            }
                        }

                        // Update save node with filename prefix
                        if (workflow[saveNodeId] && workflow[saveNodeId].inputs) {
                            if ('filename_prefix' in workflow[saveNodeId].inputs) {
                                workflow[saveNodeId].inputs.filename_prefix = fileName;
                            }
                        }

                        // Note: If refImageNodeId is set, this is img2img mode
                        // The LoadImage node in the workflow already has the reference image configured
                        // We don't modify it - just use the workflow's existing reference image

                        // Queue the modified prompt
                        const res = await fetch("/prompt", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                prompt: workflow,
                                extra_data: {
                                    extra_pnginfo: {
                                        workflow: graphData.workflow
                                    }
                                }
                            })
                        });

                        if (res.ok) {
                            const result = await res.json();
                            const promptId = result.prompt_id;

                            runBtn.textContent = t("generating");
                            runBtn.style.backgroundColor = "#cc8844";

                            // Show loading animation in result area
                            const resultArea = card.shotData.resultArea;
                            const placeholder = card.shotData.placeholder;
                            let loadingEl = resultArea.querySelector(".loading-animation");
                            if (!loadingEl) {
                                loadingEl = document.createElement("div");
                                loadingEl.className = "loading-animation";
                                loadingEl.innerHTML = `
                                    <div style="text-align:center;">
                                        <div style="width:40px;height:40px;border:3px solid #333;border-top:3px solid #44ccff;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 10px;"></div>
                                        <div style="color:#888;font-size:12px;">${t('generating')}</div>
                                    </div>
                                    <style>
                                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                                    </style>
                                `;
                                Object.assign(loadingEl.style, {
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)"
                                });
                            }
                            placeholder.style.display = "none";
                            resultArea.appendChild(loadingEl);

                            // Poll for execution completion
                            const checkExecution = async () => {
                                try {
                                    const historyRes = await fetch(`/history/${promptId}`);
                                    if (historyRes.ok) {
                                        const history = await historyRes.json();
                                        if (history[promptId]) {
                                            // Execution completed
                                            const outputs = history[promptId].outputs;

                                            // Find the image output from save node
                                            if (outputs[saveNodeId] && outputs[saveNodeId].images) {
                                                const images = outputs[saveNodeId].images;
                                                if (images.length > 0) {
                                                    const img = images[images.length - 1];
                                                    const imageUrl = `/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder || '')}&type=${encodeURIComponent(img.type || 'output')}`;

                                                    // Display image in result area
                                                    const resultArea = card.shotData.resultArea;
                                                    const placeholder = card.shotData.placeholder;

                                                    // Hide loading animation and placeholder
                                                    placeholder.style.display = "none";
                                                    const loadingAnim = resultArea.querySelector(".loading-animation");
                                                    if (loadingAnim) loadingAnim.remove();

                                                    // Create or update image element
                                                    let imgEl = resultArea.querySelector("img");
                                                    if (!imgEl) {
                                                        imgEl = document.createElement("img");
                                                        Object.assign(imgEl.style, {
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            objectFit: "contain"
                                                        });
                                                        resultArea.appendChild(imgEl);
                                                    }
                                                    imgEl.src = imageUrl;

                                                    // Save image URL for persistence
                                                    card.shotData.lastImageUrl = imageUrl;
                                                    saveStoryboardData();

                                                    runBtn.textContent = t("done");
                                                    runBtn.style.backgroundColor = "#44aa44";
                                                }
                                            }
                                            return true; // Done
                                        }
                                    }
                                    return false; // Not done yet
                                } catch (e) {
                                    console.error("Check execution error:", e);
                                    return false;
                                }
                            };

                            // Poll every 500ms for up to 120 seconds
                            let attempts = 0;
                            const maxAttempts = 240;
                            const pollInterval = setInterval(async () => {
                                attempts++;
                                const done = await checkExecution();
                                if (done || attempts >= maxAttempts) {
                                    clearInterval(pollInterval);
                                    // Remove loading animation
                                    const loadingAnim = card.shotData.resultArea.querySelector(".loading-animation");
                                    if (loadingAnim) loadingAnim.remove();

                                    if (!done && attempts >= maxAttempts) {
                                        runBtn.textContent = t("timeout");
                                        runBtn.style.backgroundColor = "#cc8844";
                                        // Show placeholder again on timeout
                                        if (!card.shotData.lastImageUrl) {
                                            card.shotData.placeholder.style.display = "";
                                        }
                                    }
                                    // Re-enable button after completion
                                    runBtn.disabled = false;
                                    setTimeout(() => {
                                        runBtn.textContent = t("run");
                                        runBtn.dataset.i18n = "run"; // Restore i18n
                                        runBtn.style.backgroundColor = "#44aa44";
                                    }, 1500);
                                }
                            }, 500);

                            return; // Don't reset button immediately
                        } else {
                            const errorData = await res.json().catch(() => ({}));
                            throw new Error(errorData.error || "Failed to queue");
                        }
                    } catch (e) {
                        console.error("Run failed:", e);
                        runBtn.textContent = t("failed");
                        runBtn.style.backgroundColor = "#cc4444";
                        generateCount--; // Rollback counter on failure

                        // Remove loading animation on error
                        const loadingAnim = card.shotData.resultArea.querySelector(".loading-animation");
                        if (loadingAnim) loadingAnim.remove();
                        // Show placeholder if no image
                        if (!card.shotData.lastImageUrl) {
                            card.shotData.placeholder.style.display = "";
                        }
                        runBtn.disabled = false;
                        setTimeout(() => {
                            runBtn.textContent = t("run");
                            runBtn.dataset.i18n = "run"; // Restore i18n
                            runBtn.style.backgroundColor = "#44aa44";
                        }, 2000);
                    }
                };

                // Delete button
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "✕";
                Object.assign(deleteBtn.style, {
                    padding: "4px 8px",
                    backgroundColor: "#aa4444",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "11px",
                    cursor: "pointer",
                    marginLeft: "6px"
                });
                deleteBtn.onmouseenter = () => deleteBtn.style.backgroundColor = "#cc5555";
                deleteBtn.onmouseleave = () => deleteBtn.style.backgroundColor = "#aa4444";
                deleteBtn.onclick = () => {
                    // Custom confirm dialog
                    const confirmOverlay = document.createElement("div");
                    Object.assign(confirmOverlay.style, {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        zIndex: "30000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    });

                    const confirmBox = document.createElement("div");
                    Object.assign(confirmBox.style, {
                        backgroundColor: "#2a2a2a",
                        borderRadius: "12px",
                        padding: "24px 32px",
                        textAlign: "center",
                        border: "1px solid #444",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        minWidth: "300px"
                    });

                    const confirmTitle = document.createElement("h3");
                    confirmTitle.textContent = t("confirmDelete");
                    Object.assign(confirmTitle.style, {
                        margin: "0 0 16px 0",
                        color: "#ff6666",
                        fontSize: "18px"
                    });

                    const confirmText = document.createElement("p");
                    confirmText.textContent = `${t("confirmDeleteText")} ${shotName}?`;
                    Object.assign(confirmText.style, {
                        margin: "0 0 24px 0",
                        color: "#ccc",
                        fontSize: "14px"
                    });

                    const btnContainer = document.createElement("div");
                    Object.assign(btnContainer.style, {
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px"
                    });

                    const cancelBtn = document.createElement("button");
                    cancelBtn.textContent = t("cancel");
                    Object.assign(cancelBtn.style, {
                        padding: "10px 28px",
                        backgroundColor: "#444",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer"
                    });
                    cancelBtn.onmouseenter = () => cancelBtn.style.backgroundColor = "#555";
                    cancelBtn.onmouseleave = () => cancelBtn.style.backgroundColor = "#444";
                    cancelBtn.onclick = () => confirmOverlay.remove();

                    const confirmBtn = document.createElement("button");
                    confirmBtn.textContent = t("confirm");
                    Object.assign(confirmBtn.style, {
                        padding: "10px 28px",
                        backgroundColor: "#cc4444",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    });
                    confirmBtn.onmouseenter = () => confirmBtn.style.backgroundColor = "#dd5555";
                    confirmBtn.onmouseleave = () => confirmBtn.style.backgroundColor = "#cc4444";
                    confirmBtn.onclick = () => {
                        card.remove();
                        saveStoryboardData();
                        confirmOverlay.remove();
                    };

                    btnContainer.appendChild(cancelBtn);
                    btnContainer.appendChild(confirmBtn);
                    confirmBox.appendChild(confirmTitle);
                    confirmBox.appendChild(confirmText);
                    confirmBox.appendChild(btnContainer);
                    confirmOverlay.appendChild(confirmBox);
                    document.body.appendChild(confirmOverlay);
                };

                const btnGroup = document.createElement("div");
                Object.assign(btnGroup.style, {
                    display: "flex",
                    gap: "4px"
                });

                // Camera settings button
                const cameraBtn = document.createElement("button");
                cameraBtn.textContent = t("camera");
                cameraBtn.dataset.i18n = "camera"; // Static label on card
                Object.assign(cameraBtn.style, {
                    padding: "4px 8px",
                    backgroundColor: "#4488cc",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "11px",
                    cursor: "pointer"
                });
                cameraBtn.onmouseenter = () => cameraBtn.style.backgroundColor = "#5599dd";
                cameraBtn.onmouseleave = () => cameraBtn.style.backgroundColor = "#4488cc";
                cameraBtn.onclick = (e) => {
                    e.stopPropagation();
                    openCameraSettingsModal(card.shotData, refImageNodeInput.value);
                };

                btnGroup.appendChild(cameraBtn);
                btnGroup.appendChild(runBtn);
                btnGroup.appendChild(deleteBtn);

                header.appendChild(shotLabel);
                header.appendChild(btnGroup);

                // Result display area (image preview) - 16:9 aspect ratio
                const resultArea = document.createElement("div");
                Object.assign(resultArea.style, {
                    width: "100%",
                    aspectRatio: "16 / 9",
                    flexShrink: "0",
                    backgroundColor: "#1a1a1a",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "1px solid #444",
                    position: "relative",
                    overflow: "hidden"
                });

                const placeholder = document.createElement("span");
                placeholder.textContent = t("resultPreview");
                placeholder.dataset.i18n = "resultPreview";
                Object.assign(placeholder.style, {
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "14px",
                    userSelect: "none"
                });
                resultArea.appendChild(placeholder);

                // Zoom overlay for enlarged view
                resultArea.style.cursor = "pointer";
                resultArea.title = t("clickEnlarge");
                resultArea.onclick = () => {
                    const imgEl = resultArea.querySelector("img");
                    if (!imgEl || !imgEl.src) return; // No image to zoom

                    // Create zoom overlay
                    const zoomOverlay = document.createElement("div");
                    Object.assign(zoomOverlay.style, {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.95)",
                        zIndex: "20000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "zoom-out"
                    });

                    // Close button
                    const closeBtn = document.createElement("button");
                    closeBtn.textContent = t("close");
                    Object.assign(closeBtn.style, {
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        padding: "10px 20px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer"
                    });
                    closeBtn.onmouseenter = () => closeBtn.style.backgroundColor = "rgba(255,255,255,0.3)";
                    closeBtn.onmouseleave = () => closeBtn.style.backgroundColor = "rgba(255,255,255,0.2)";

                    // Shot name label
                    const shotLabel = document.createElement("div");
                    shotLabel.textContent = shotName;
                    Object.assign(shotLabel.style, {
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        color: "#44ccff",
                        fontSize: "18px",
                        fontWeight: "bold",
                        fontFamily: "monospace"
                    });

                    // Zoomed image
                    const zoomedImg = document.createElement("img");
                    zoomedImg.src = imgEl.src;
                    Object.assign(zoomedImg.style, {
                        maxWidth: "95%",
                        maxHeight: "90%",
                        objectFit: "contain",
                        borderRadius: "4px",
                        boxShadow: "0 0 50px rgba(0,0,0,0.5)"
                    });

                    // ESC key to close
                    const handleEsc = (e) => {
                        if (e.key === "Escape") {
                            closeZoom();
                        }
                    };

                    const closeZoom = () => {
                        document.removeEventListener("keydown", handleEsc);
                        zoomOverlay.remove();
                    };

                    document.addEventListener("keydown", handleEsc);
                    zoomOverlay.onclick = closeZoom;
                    closeBtn.onclick = (e) => {
                        e.stopPropagation();
                        closeZoom();
                    };

                    zoomOverlay.appendChild(closeBtn);
                    zoomOverlay.appendChild(shotLabel);
                    zoomOverlay.appendChild(zoomedImg);
                    document.body.appendChild(zoomOverlay);
                };

                // Prompt area
                const promptArea = document.createElement("div");
                Object.assign(promptArea.style, {
                    padding: "8px"
                });

                const promptLabel = document.createElement("label");
                promptLabel.textContent = t("promptLabel");
                promptLabel.dataset.i18n = "promptLabel";
                Object.assign(promptLabel.style, {
                    color: "#aaa",
                    fontSize: "11px",
                    display: "block",
                    marginBottom: "4px"
                });

                const promptInput = document.createElement("textarea");
                promptInput.placeholder = t("placeholder");
                promptInput.dataset.i18nPlaceholder = "placeholder";
                Object.assign(promptInput.style, {
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "white",
                    padding: "8px",
                    fontSize: "12px",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                });
                promptInput.onfocus = () => promptInput.style.borderColor = "#44ccff";
                promptInput.onblur = () => {
                    promptInput.style.borderColor = "#444";
                    saveStoryboardData(); // Auto-save when prompt text changes
                };

                promptArea.appendChild(promptLabel);
                promptArea.appendChild(promptInput);

                card.appendChild(header);
                card.appendChild(resultArea);
                card.appendChild(promptArea);

                // Store references for later use
                card.shotData = {
                    name: shotName,
                    resultArea,
                    promptInput,
                    placeholder,
                    lastImageUrl: null,
                    cameraSettings: { horizontal: 0, vertical: 0, zoom: 5 },
                    getFileName: () => `${shotName}_${String(generateCount).padStart(4, '0')}.png`,
                    getGenerateCount: () => generateCount,
                    setGenerateCount: (val) => { generateCount = val; }
                };

                // Restore initial data if provided
                if (initialData) {
                    if (initialData.prompt) {
                        promptInput.value = initialData.prompt;
                    }
                    if (initialData.imageUrl) {
                        card.shotData.lastImageUrl = initialData.imageUrl;
                        placeholder.style.display = "none";
                        const imgEl = document.createElement("img");
                        Object.assign(imgEl.style, {
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain"
                        });
                        imgEl.src = initialData.imageUrl;
                        resultArea.appendChild(imgEl);
                    }
                    if (initialData.cameraSettings) {
                        card.shotData.cameraSettings = { ...initialData.cameraSettings };
                    }
                }

                return card;
            };

            // Add shot button (now in header)
            const addShotBtn = document.createElement("button");
            addShotBtn.textContent = t("addShot");
            addShotBtn.dataset.i18n = "addShot";
            Object.assign(addShotBtn.style, {
                padding: "8px 16px",
                backgroundColor: "#4488cc",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s"
            });
            addShotBtn.onmouseenter = () => addShotBtn.style.backgroundColor = "#5599dd";
            addShotBtn.onmouseleave = () => addShotBtn.style.backgroundColor = "#4488cc";
            addShotBtn.onclick = () => {
                const newCard = createCard();
                cardsContainer.appendChild(newCard);
                // Scroll to the new card
                newCard.scrollIntoView({ behavior: "smooth", block: "end" });
                // Save after adding
                saveStoryboardData();
            };

            // One-click run all button
            const runAllBtn = document.createElement("button");
            runAllBtn.textContent = t("runAll");
            runAllBtn.dataset.i18n = "runAll";
            Object.assign(runAllBtn.style, {
                padding: "8px 16px",
                backgroundColor: "#44aa44",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s"
            });
            runAllBtn.onmouseenter = () => runAllBtn.style.backgroundColor = "#55bb55";
            runAllBtn.onmouseleave = () => runAllBtn.style.backgroundColor = "#44aa44";
            runAllBtn.onclick = async () => {
                // Validate node IDs
                const promptNodeId = promptNodeInput.value.trim();
                const saveNodeId = saveNodeInput.value.trim();

                if (!promptNodeId || !saveNodeId) {
                    alert(t("pleaseSelectAll"));
                    return;
                }

                // Get all cards
                const cards = cardsContainer.querySelectorAll("[data-shot-name]");
                if (cards.length === 0) {
                    alert(t("noShotsRun"));
                    return;
                }

                runAllBtn.disabled = true;
                runAllBtn.removeAttribute("data-i18n"); // Prevent overwrite while running
                const originalText = runAllBtn.textContent;
                let completedCount = 0;

                // Run each card sequentially
                for (const card of cards) {
                    if (!card.shotData) continue;

                    runAllBtn.textContent = `${t("running")} (${completedCount + 1}/${cards.length})`;
                    runAllBtn.style.backgroundColor = "#cc8844";

                    // Find the run button in this card (look for button containing "运行")
                    const buttons = card.querySelectorAll("button");
                    const runBtn = Array.from(buttons).find(btn => btn.textContent.includes("运行"));

                    if (runBtn && !runBtn.disabled) {
                        // Trigger the click
                        runBtn.click();

                        // Wait a small moment for the click to process and disable the button
                        await new Promise(r => setTimeout(r, 100));

                        // Wait for this card to complete (poll for button state)
                        await new Promise(resolve => {
                            const checkComplete = setInterval(() => {
                                if (!runBtn.disabled) {
                                    clearInterval(checkComplete);
                                    resolve();
                                }
                            }, 500);
                            // Timeout after 2 minutes per card
                            setTimeout(() => {
                                clearInterval(checkComplete);
                                resolve();
                            }, 120000);
                        });
                    }
                    completedCount++;
                }

                runAllBtn.textContent = `${t("done")} (${completedCount}/${cards.length})`;
                runAllBtn.style.backgroundColor = "#44aa44";
                runAllBtn.disabled = false;

                setTimeout(() => {
                    runAllBtn.textContent = t("runAll");
                    runAllBtn.dataset.i18n = "runAll"; // Restore
                }, 2000);
            };

            // Add to workflow button - creates LoadImage nodes for generated images
            const addToWorkflowBtn = document.createElement("button");
            addToWorkflowBtn.textContent = t("addToWorkflow");
            addToWorkflowBtn.dataset.i18n = "addToWorkflow";
            Object.assign(addToWorkflowBtn.style, {
                padding: "8px 16px",
                backgroundColor: "#8844cc",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s"
            });
            addToWorkflowBtn.onmouseenter = () => addToWorkflowBtn.style.backgroundColor = "#9955dd";
            addToWorkflowBtn.onmouseleave = () => addToWorkflowBtn.style.backgroundColor = "#8844cc";
            addToWorkflowBtn.onclick = async () => {
                // Get all cards with generated images
                const cards = cardsContainer.querySelectorAll("[data-shot-name]");
                const imagesInfo = [];

                cards.forEach(card => {
                    if (card.shotData && card.shotData.lastImageUrl) {
                        // Parse the image URL to get filename
                        const url = new URL(card.shotData.lastImageUrl, window.location.origin);
                        const filename = url.searchParams.get('filename');
                        const subfolder = url.searchParams.get('subfolder') || '';
                        const type = url.searchParams.get('type') || 'output';

                        if (filename) {
                            imagesInfo.push({
                                shotName: card.shotData.name,
                                filename: filename,
                                subfolder: subfolder,
                                type: type,
                                imageUrl: card.shotData.lastImageUrl
                            });
                        }
                    }
                });

                if (imagesInfo.length === 0) {
                    alert(t("noImagesToAdd"));
                    return;
                }
                addToWorkflowBtn.textContent = t("copyingImages");
                addToWorkflowBtn.style.backgroundColor = "#cc8844";

                // First, copy images from output to input/storyboard folder
                const copiedImages = [];
                for (const info of imagesInfo) {
                    try {
                        // Fetch the image from output
                        const imageResponse = await fetch(info.imageUrl);
                        if (!imageResponse.ok) {
                            console.error(`Failed to fetch image: ${info.filename}`);
                            continue;
                        }
                        const imageBlob = await imageResponse.blob();

                        // Create a new filename with storyboard prefix
                        const newFilename = `storyboard_${info.shotName}_${Date.now()}.png`;

                        // Upload to input folder using ComfyUI's upload API
                        const formData = new FormData();
                        formData.append('image', imageBlob, newFilename);
                        formData.append('subfolder', 'storyboard');
                        formData.append('overwrite', 'true');

                        const uploadResponse = await fetch('/upload/image', {
                            method: 'POST',
                            body: formData
                        });

                        if (uploadResponse.ok) {
                            const uploadResult = await uploadResponse.json();
                            copiedImages.push({
                                shotName: info.shotName,
                                inputPath: uploadResult.subfolder ? `${uploadResult.subfolder}/${uploadResult.name}` : uploadResult.name
                            });
                        } else {
                            console.error(`Failed to upload image: ${info.filename}`);
                        }
                    } catch (e) {
                        console.error(`Error copying image ${info.filename}:`, e);
                    }
                }

                if (copiedImages.length === 0) {
                    alert(t("copyFailed"));
                    addToWorkflowBtn.disabled = false;
                    addToWorkflowBtn.textContent = t("addToWorkflow");
                    addToWorkflowBtn.style.backgroundColor = "#8844cc";
                    return;
                }
                addToWorkflowBtn.textContent = t("creatingNodes");

                // Create LoadImage nodes in the workflow
                const startX = 100;
                const startY = 100;
                const nodeWidth = 320;
                const nodeHeight = 350;
                const gapX = 50;
                const gapY = 50;
                const nodesPerRow = 3;

                let createdCount = 0;

                for (let i = 0; i < copiedImages.length; i++) {
                    const info = copiedImages[i];
                    const row = Math.floor(i / nodesPerRow);
                    const col = i % nodesPerRow;
                    const x = startX + col * (nodeWidth + gapX);
                    const y = startY + row * (nodeHeight + gapY);

                    try {
                        // Create LoadImage node using LiteGraph API
                        const node = LiteGraph.createNode("LoadImage");
                        if (node) {
                            node.pos = [x, y];
                            node.title = `📷 ${info.shotName}`;

                            // Add to graph
                            app.graph.add(node);

                            // Set the image value to the copied image in input folder
                            const imageWidget = node.widgets?.find(w => w.name === 'image');
                            if (imageWidget) {
                                imageWidget.value = info.inputPath;
                                // Trigger widget callback to refresh
                                if (imageWidget.callback) {
                                    imageWidget.callback(info.inputPath);
                                }
                            }

                            createdCount++;
                        }
                    } catch (e) {
                        console.error(`Failed to create LoadImage node for ${info.shotName}:`, e);
                    }
                }

                addToWorkflowBtn.disabled = false;

                if (createdCount > 0) {
                    // Refresh the canvas
                    app.graph.setDirtyCanvas(true, true);
                    addToWorkflowBtn.textContent = `${t("addedNodes")} ${createdCount}`;
                    addToWorkflowBtn.style.backgroundColor = "#44aa44";
                    setTimeout(() => {
                        addToWorkflowBtn.textContent = t("addToWorkflow");
                        addToWorkflowBtn.style.backgroundColor = "#8844cc";
                    }, 2000);
                } else {
                    alert(t("createFailed"));
                    addToWorkflowBtn.textContent = t("addToWorkflow");
                    addToWorkflowBtn.style.backgroundColor = "#8844cc";
                }
            };

            // Clear all storyboards button
            const clearAllBtn = document.createElement("button");
            clearAllBtn.textContent = t("clearAll");
            clearAllBtn.dataset.i18n = "clearAll";
            Object.assign(clearAllBtn.style, {
                padding: "8px 16px",
                backgroundColor: "#aa4444",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s"
            });
            clearAllBtn.onmouseenter = () => clearAllBtn.style.backgroundColor = "#cc5555";
            clearAllBtn.onmouseleave = () => clearAllBtn.style.backgroundColor = "#aa4444";
            clearAllBtn.onclick = () => {
                const cards = cardsContainer.querySelectorAll("[data-shot-name]");
                if (cards.length === 0) {
                    alert(t("noShotsClear"));
                    return;
                }

                // Custom confirm dialog
                const confirmOverlay = document.createElement("div");
                Object.assign(confirmOverlay.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    zIndex: "30000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                });

                const confirmBox = document.createElement("div");
                Object.assign(confirmBox.style, {
                    backgroundColor: "#2a2a2a",
                    borderRadius: "12px",
                    padding: "24px 32px",
                    textAlign: "center",
                    border: "1px solid #444",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    minWidth: "300px"
                });

                const confirmTitle = document.createElement("h3");
                confirmTitle.textContent = t("confirmClear");
                Object.assign(confirmTitle.style, {
                    margin: "0 0 16px 0",
                    color: "#ff6666",
                    fontSize: "18px"
                });

                const confirmText = document.createElement("p");
                confirmText.textContent = `${t("confirmClearAll")} ${cards.length} ${t("cannotUndone")}`;
                Object.assign(confirmText.style, {
                    margin: "0 0 24px 0",
                    color: "#ccc",
                    fontSize: "14px"
                });

                const btnContainer = document.createElement("div");
                Object.assign(btnContainer.style, {
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px"
                });

                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = t("cancel");
                Object.assign(cancelBtn.style, {
                    padding: "10px 28px",
                    backgroundColor: "#444",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer"
                });
                cancelBtn.onmouseenter = () => cancelBtn.style.backgroundColor = "#555";
                cancelBtn.onmouseleave = () => cancelBtn.style.backgroundColor = "#444";
                cancelBtn.onclick = () => confirmOverlay.remove();

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = t("confirm");
                Object.assign(confirmBtn.style, {
                    padding: "10px 28px",
                    backgroundColor: "#cc4444",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "bold"
                });
                confirmBtn.onmouseenter = () => confirmBtn.style.backgroundColor = "#dd5555";
                confirmBtn.onmouseleave = () => confirmBtn.style.backgroundColor = "#cc4444";
                confirmBtn.onclick = () => {
                    // Clear all cards
                    cards.forEach(card => card.remove());
                    // Reset shot sequence
                    shotSequence = 1;
                    // Save empty state
                    saveStoryboardData();
                    confirmOverlay.remove();
                };

                btnContainer.appendChild(cancelBtn);
                btnContainer.appendChild(confirmBtn);
                confirmBox.appendChild(confirmTitle);
                confirmBox.appendChild(confirmText);
                confirmBox.appendChild(btnContainer);
                confirmOverlay.appendChild(confirmBox);
                document.body.appendChild(confirmOverlay);
            };

            // Add buttons to header
            headerButtonsContainer.appendChild(clearAllBtn);
            headerButtonsContainer.appendChild(addToWorkflowBtn);
            headerButtonsContainer.appendChild(addShotBtn);
            headerButtonsContainer.appendChild(runAllBtn);

            // Load storyboard data from backend
            const loadStoryboardData = async () => {
                try {
                    const response = await api.fetchApi("/storyboard/load");
                    if (response.status === 200) {
                        const data = await response.json();
                        if (data) {
                            // Restore config
                            if (data.promptNodeId) promptNodeInput.value = data.promptNodeId;
                            if (data.saveNodeId) saveNodeInput.value = data.saveNodeId;
                            if (data.refImageNodeId) refImageNodeInput.value = data.refImageNodeId;
                            if (data.shotSequence) shotSequence = data.shotSequence;

                            // Restore cards
                            if (data.cards && data.cards.length > 0) {
                                // Clear existing cards first if any (though usually empty on load)
                                cardsContainer.innerHTML = '';
                                data.cards.forEach(cardData => {
                                    const card = createCard(cardData);
                                    cardsContainer.appendChild(card);
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.error("Failed to load storyboard data:", e);
                }
            };

            // Load saved data after a short delay to ensure options are populated
            setTimeout(() => {
                loadStoryboardData();
            }, 500);

            defaultContent.appendChild(configBar);
            defaultContent.appendChild(cardsContainer);

            body.appendChild(defaultContent);

            content.appendChild(closeBtn);
            content.appendChild(headerDiv);
            content.appendChild(body);
            modal.appendChild(content);

            return modal;
        };

        const openStoryboard = async () => {
            const modal = createModal();
            document.body.appendChild(modal);
        };

        const comfyAPI = window.comfyAPI;
        // Check if ComfyUI menu API is available
        const ComfyButton = comfyAPI && comfyAPI.button && comfyAPI.button.ComfyButton;

        if (ComfyButton && app.menu && app.menu.settingsGroup) {
            console.log("ComfyUI Storyboard: Adding button via ComfyButton API");
            // Add button to the settings group of the menu bar
            app.menu.settingsGroup.append(
                new ComfyButton({
                    icon: "film",
                    tooltip: "Open Storyboard",
                    content: "Storyboard",
                    action: openStoryboard,
                })
            );
        } else {
            // Fallback for standard ComfyUI menu if ComfyButton is not available
            console.log("ComfyUI Storyboard: ComfyButton API not found, trying standard DOM");
            const menu = document.querySelector(".comfy-menu");
            if (menu) {
                const separator = document.createElement("hr");

                const button = document.createElement("button");
                button.textContent = "Storyboard";
                button.onclick = openStoryboard;
                button.style.cursor = "pointer";

                menu.append(separator);
                menu.append(button);
                console.log("ComfyUI Storyboard: Button added via DOM manipulation");
            } else {
                console.warn("ComfyUI Storyboard: Could not find menu to add button");
            }
        }
    },
});
