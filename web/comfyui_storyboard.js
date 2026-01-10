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
                clickEnlarge: "点击放大查看",
                close: "✕ 关闭",
                presets: "相机预设",
                presetEditor: "预设编辑器",
                presetName: "预设名称",
                savePreset: "保存预设",
                deletePreset: "删除预设",
                selectPreset: "选择预设:",
                confirmDeletePreset: "确定要删除预设",
                azimuthSettings: "水平角度设置 (8个方向)",
                elevationSettings: "垂直角度设置 (5个角度)",
                zoomSettings: "缩放设置 (5个级别)",
                presetSaved: "预设已保存！",
                presetDeleted: "预设已删除！",
                addField: "添加字段",
                deleteField: "删除字段",
                enterNewValue: "请输入新数值 (数字):",
                confirmDeleteField: "确认删除字段",
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
                clickEnlarge: "Click to enlarge",
                close: "✕ Close",
                presets: "Camera Presets",
                presetEditor: "Preset Editor",
                presetName: "Preset Name",
                savePreset: "Save Preset",
                deletePreset: "Delete Preset",
                selectPreset: "Select Preset:",
                confirmDeletePreset: "Are you sure to delete preset",
                azimuthSettings: "Azimuth Settings (8 directions)",
                elevationSettings: "Elevation Settings (5 levels)",
                zoomSettings: "Zoom Settings (5 levels)",
                presetSaved: "Preset saved!",
                presetDeleted: "Preset deleted!",
                addField: "Add Field",
                deleteField: "Delete Field",
                enterNewValue: "Enter new value (number):",
                confirmDeleteField: "Are you sure you want to delete field",
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

        // Preset Manager
        const PresetManager = {
            presets: {},
            currentPresetId: 'default',

            async loadPresets() {
                try {
                    const res = await api.fetchApi("/storyboard/presets/list");
                    if (res.status === 200) {
                        const data = await res.json();
                        if (data && data.presets) {
                            this.presets = data.presets;
                        }
                    }
                } catch (e) {
                    console.error("Failed to load presets:", e);
                }
            },

            getPreset(id) {
                return this.presets[id] || this.presets['default'];
            },

            async savePreset(id, data) {
                try {
                    await api.fetchApi("/storyboard/presets/save", {
                        method: "POST",
                        body: JSON.stringify({ id, data }),
                        headers: { "Content-Type": "application/json" }
                    });
                    this.presets[id] = data;
                    return true;
                } catch (e) {
                    console.error("Failed to save preset:", e);
                    return false;
                }
            },

            async deletePreset(id) {
                try {
                    await api.fetchApi("/storyboard/presets/delete", {
                        method: "POST",
                        body: JSON.stringify({ id }),
                        headers: { "Content-Type": "application/json" }
                    });
                    delete this.presets[id];
                    return true;
                } catch (e) {
                    console.error("Failed to delete preset:", e);
                    return false;
                }
            },

            // Get prompt for specific camera state based on current preset
            getPrompt(azimuth, elevation, zoom, presetId = null) {
                const preset = this.getPreset(presetId || this.currentPresetId);
                if (!preset) return "";

                // Logic to map angles to keys
                // Azimuth (0-360, 8 directions -> 45 deg steps)
                // Keys in default preset are "0", "45", "90"...
                // We need to find the closest key

                const normalizeAngle = (a) => ((a % 360) + 360) % 360;
                const az = normalizeAngle(azimuth);

                // Map to closest 45 degree increment
                let closestAz = 0;
                let minDiff = 360;
                const azKeys = Object.keys(preset.azimuth).map(Number);

                for (let key of azKeys) {
                    let diff = Math.abs(az - key);
                    if (diff > 180) diff = 360 - diff; // Handle wraparound
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestAz = key;
                    }
                }
                const azText = preset.azimuth[String(closestAz)] || "";

                // Elevation (-30 to 90)
                // Keys: -30, 0, 30, 60, 90
                let closestEl = 0;
                minDiff = 360;
                const elKeys = Object.keys(preset.elevation).map(Number);

                for (let key of elKeys) {
                    let diff = Math.abs(elevation - key);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestEl = key;
                    }
                }
                const elText = preset.elevation[String(closestEl)] || "";

                // Zoom (0-10)
                // Keys: 0, 2, 4, 6, 8
                let closestZoom = 0;
                minDiff = 100;
                const zoomKeys = Object.keys(preset.zoom).map(Number);

                for (let key of zoomKeys) {
                    let diff = Math.abs(zoom - key);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestZoom = key;
                    }
                }
                const zoomText = preset.zoom[String(closestZoom)] || "";

                return `${azText}, ${elText}, ${zoomText}`;
            }
        };

        // Load presets initially
        PresetManager.loadPresets();

        // Preset Editor Modal
        const openPresetEditor = () => {
            // Load latest presets
            PresetManager.loadPresets().then(() => {
                renderEditor();
            });

            const modalOverlay = document.createElement("div");
            Object.assign(modalOverlay.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                zIndex: "30000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            });

            const modalContent = document.createElement("div");
            Object.assign(modalContent.style, {
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #444",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                width: "800px",
                maxWidth: "95vw",
                height: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
            });

            // Header
            const header = document.createElement("div");
            Object.assign(header.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
            });
            const title = document.createElement("h3");
            title.textContent = t("presetEditor");
            Object.assign(title.style, { margin: "0", color: "#44ccff", fontSize: "20px" });
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "✕";
            Object.assign(closeBtn.style, {
                background: "transparent", border: "none", color: "#888", fontSize: "20px", cursor: "pointer"
            });
            closeBtn.onclick = () => modalOverlay.remove();
            header.appendChild(title);
            header.appendChild(closeBtn);
            modalContent.appendChild(header);

            // Content Area - Scrollable
            const contentArea = document.createElement("div");
            Object.assign(contentArea.style, {
                flex: "1",
                overflowY: "auto",
                paddingRight: "10px"
            });

            // Controls: Select Preset, Name input, Save/Delete
            const controlsDiv = document.createElement("div");
            Object.assign(controlsDiv.style, {
                display: "flex",
                gap: "12px",
                marginBottom: "20px",
                alignItems: "center",
                backgroundColor: "#2a2a2a",
                padding: "15px",
                borderRadius: "8px"
            });

            // Preset Select
            const selectContainer = document.createElement("div");
            selectContainer.style.flex = "1";
            const selectLabel = document.createElement("div");
            selectLabel.textContent = t("selectPreset");
            selectLabel.style.marginBottom = "5px";
            selectLabel.style.color = "#aaa";
            selectLabel.style.fontSize = "12px";

            const presetSelect = document.createElement("select");
            Object.assign(presetSelect.style, {
                width: "100%", padding: "8px", backgroundColor: "#111", border: "1px solid #444", color: "white", borderRadius: "4px"
            });

            selectContainer.appendChild(selectLabel);
            selectContainer.appendChild(presetSelect);

            // Name Input
            const nameContainer = document.createElement("div");
            nameContainer.style.flex = "1";
            const nameLabel = document.createElement("div");
            nameLabel.textContent = t("presetName");
            nameLabel.style.marginBottom = "5px";
            nameLabel.style.color = "#aaa";
            nameLabel.style.fontSize = "12px";

            const nameInput = document.createElement("input");
            Object.assign(nameInput.style, {
                width: "100%", padding: "8px", backgroundColor: "#111", border: "1px solid #444", color: "white", borderRadius: "4px"
            });

            nameContainer.appendChild(nameLabel);
            nameContainer.appendChild(nameInput);

            controlsDiv.appendChild(selectContainer);
            controlsDiv.appendChild(nameContainer);
            contentArea.appendChild(controlsDiv);

            // Editor Sections Container
            const sectionsContainer = document.createElement("div");
            contentArea.appendChild(sectionsContainer);

            // Footer Actions
            const footer = document.createElement("div");
            Object.assign(footer.style, {
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                paddingTop: "15px",
                borderTop: "1px solid #333"
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = t("deletePreset");
            Object.assign(deleteBtn.style, {
                padding: "8px 16px", backgroundColor: "#aa4444", border: "none", borderRadius: "4px", color: "white", cursor: "pointer"
            });

            const saveBtn = document.createElement("button");
            saveBtn.textContent = t("savePreset");
            Object.assign(saveBtn.style, {
                padding: "8px 16px", backgroundColor: "#44aa44", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontWeight: "bold"
            });

            footer.appendChild(deleteBtn);
            footer.appendChild(saveBtn);
            modalContent.appendChild(contentArea);
            modalContent.appendChild(footer);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            // Logic
            let activePresetId = 'default';
            let activeData = null; // Will hold the editing data

            const loadActiveData = () => {
                activeData = JSON.parse(JSON.stringify(PresetManager.getPreset(activePresetId)));
            };

            // Custom Modal for Adding Keys
            const showAddKeyModal = (titleKey, onConfirm) => {
                const overlay = document.createElement("div");
                Object.assign(overlay.style, {
                    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.6)", zIndex: "31000",
                    display: "flex", justifyContent: "center", alignItems: "center"
                });

                const dialog = document.createElement("div");
                Object.assign(dialog.style, {
                    backgroundColor: "#2a2a2a", padding: "20px", borderRadius: "10px",
                    border: "1px solid #444", width: "320px", display: "flex", flexDirection: "column", gap: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                });

                const title = document.createElement("h4");
                title.textContent = t("addField");
                Object.assign(title.style, { margin: "0 0 5px 0", color: "white" });
                dialog.appendChild(title);

                // Inputs
                const keyInputDiv = document.createElement("div");
                const keyLabel = document.createElement("label");
                keyLabel.textContent = t("enterNewValue");
                keyLabel.style.display = "block";
                keyLabel.style.color = "#aaa";
                keyLabel.style.fontSize = "12px";
                keyLabel.style.marginBottom = "4px";
                const keyInput = document.createElement("input");
                keyInput.type = "text"; // allow minus directly
                Object.assign(keyInput.style, { width: "100%", padding: "8px", backgroundColor: "#111", border: "1px solid #555", color: "white", borderRadius: "4px" });
                keyInputDiv.appendChild(keyLabel);
                keyInputDiv.appendChild(keyInput);

                const valInputDiv = document.createElement("div");
                const valLabel = document.createElement("label");
                valLabel.textContent = t("promptLabel") || "Prompt:";
                valLabel.style.display = "block";
                valLabel.style.color = "#aaa";
                valLabel.style.fontSize = "12px";
                valLabel.style.marginBottom = "4px";
                const valInput = document.createElement("input");
                valInput.type = "text";
                Object.assign(valInput.style, { width: "100%", padding: "8px", backgroundColor: "#111", border: "1px solid #555", color: "white", borderRadius: "4px" });
                valInputDiv.appendChild(valLabel);
                valInputDiv.appendChild(valInput);

                dialog.appendChild(keyInputDiv);
                dialog.appendChild(valInputDiv);

                // Buttons
                const btnRow = document.createElement("div");
                Object.assign(btnRow.style, { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" });

                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = t("cancel");
                Object.assign(cancelBtn.style, { padding: "6px 12px", backgroundColor: "#444", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" });
                cancelBtn.onclick = () => overlay.remove();

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = t("confirm");
                Object.assign(confirmBtn.style, { padding: "6px 12px", backgroundColor: "#44aa44", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" });
                confirmBtn.onclick = () => {
                    const k = keyInput.value.trim();
                    const v = valInput.value.trim();
                    if (k === "" || isNaN(Number(k))) {
                        alert("Please enter a valid number.");
                        return;
                    }
                    onConfirm(Number(k), v);
                    overlay.remove();
                };

                btnRow.appendChild(cancelBtn);
                btnRow.appendChild(confirmBtn);
                dialog.appendChild(btnRow);
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);

                keyInput.focus();
            };

            // Custom Confirm Modal
            const showCustomConfirm = (message, onConfirm) => {
                const overlay = document.createElement("div");
                Object.assign(overlay.style, {
                    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.6)", zIndex: "32000",
                    display: "flex", justifyContent: "center", alignItems: "center"
                });
                const dialog = document.createElement("div");
                Object.assign(dialog.style, {
                    backgroundColor: "#2a2a2a", padding: "20px", borderRadius: "8px", border: "1px solid #444",
                    maxWidth: "350px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                });
                const msg = document.createElement("p");
                msg.textContent = message;
                msg.style.color = "#ddd";
                msg.style.marginBottom = "20px";
                msg.style.fontSize = "16px";

                const actions = document.createElement("div");
                actions.style.display = "flex";
                actions.style.justifyContent = "center";
                actions.style.gap = "15px";

                const noBtn = document.createElement("button");
                noBtn.textContent = t("cancel");
                Object.assign(noBtn.style, { padding: "8px 16px", backgroundColor: "#444", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" });
                noBtn.onclick = () => overlay.remove();

                const yesBtn = document.createElement("button");
                yesBtn.textContent = t("confirm");
                Object.assign(yesBtn.style, { padding: "8px 16px", backgroundColor: "#aa4444", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontWeight: "bold" });
                yesBtn.onclick = () => {
                    onConfirm();
                    overlay.remove();
                };

                actions.appendChild(noBtn);
                actions.appendChild(yesBtn);
                dialog.appendChild(msg);
                dialog.appendChild(actions);
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
            };

            // Custom Alert Modal
            const showCustomAlert = (message) => {
                const overlay = document.createElement("div");
                Object.assign(overlay.style, {
                    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.6)", zIndex: "33000",
                    display: "flex", justifyContent: "center", alignItems: "center"
                });
                const dialog = document.createElement("div");
                Object.assign(dialog.style, {
                    backgroundColor: "#2a2a2a", padding: "20px", borderRadius: "8px", border: "1px solid #444",
                    maxWidth: "350px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                });
                const msg = document.createElement("p");
                msg.textContent = message;
                msg.style.color = "#ddd";
                msg.style.marginBottom = "20px";
                msg.style.fontSize = "16px";

                const okBtn = document.createElement("button");
                okBtn.textContent = t("confirm") || "OK"; // Reuse confirm text or use OK
                Object.assign(okBtn.style, { padding: "8px 20px", backgroundColor: "#44aa44", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" });
                okBtn.onclick = () => overlay.remove();

                dialog.appendChild(msg);
                dialog.appendChild(okBtn);
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
            };

            const renderEditor = () => {
                // Populate Select
                presetSelect.innerHTML = "";
                // Add default
                const defOption = document.createElement("option");
                defOption.value = 'default';
                defOption.textContent = t("defaultPreset");
                presetSelect.appendChild(defOption);

                // Add others
                Object.keys(PresetManager.presets).forEach(id => {
                    if (id === 'default') return;
                    const option = document.createElement("option");
                    option.value = id;
                    option.textContent = PresetManager.presets[id].name;
                    presetSelect.appendChild(option);
                });
                presetSelect.value = activePresetId;

                // Load Data - REMOVED (moved to loadActiveData)
                if (!activeData) loadActiveData();
                nameInput.value = activeData.name;

                // Render Tables
                sectionsContainer.innerHTML = "";

                // 1. Azimuth
                createSection(t("azimuthSettings"), activeData.azimuth, (k, v) => activeData.azimuth[k] = v);
                // 2. Elevation
                createSection(t("elevationSettings"), activeData.elevation, (k, v) => activeData.elevation[k] = v);
                // 3. Zoom
                createSection(t("zoomSettings"), activeData.zoom, (k, v) => activeData.zoom[k] = v);
            };

            const createSection = (title, dataMap, onChange) => {
                const section = document.createElement("div");
                Object.assign(section.style, {
                    marginBottom: "20px", backgroundColor: "#222", padding: "15px", borderRadius: "8px", border: "1px solid #333"
                });

                const header = document.createElement("div");
                Object.assign(header.style, {
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    margin: "0 0 15px 0", borderBottom: "1px solid #444", paddingBottom: "8px"
                });

                const h4 = document.createElement("h4");
                h4.textContent = title;
                Object.assign(h4.style, { margin: "0", color: "#ccc" });

                // Add Button
                const addBtn = document.createElement("button");
                addBtn.textContent = "+";
                Object.assign(addBtn.style, {
                    padding: "2px 8px", backgroundColor: "#333", border: "1px solid #555", borderRadius: "4px", color: "#ddd", cursor: "pointer", fontSize: "14px"
                });
                addBtn.title = t("addField");
                addBtn.onclick = () => {
                    showAddKeyModal(title, (numKey, val) => {
                        if (!isNaN(numKey)) {
                            if (dataMap.hasOwnProperty(numKey)) {
                                alert("Value already exists.");
                            } else {
                                dataMap[numKey] = val;
                                renderEditor();
                            }
                        } else {
                            alert("Invalid number.");
                        }
                    });
                };

                header.appendChild(h4);
                header.appendChild(addBtn);
                section.appendChild(header);

                const grid = document.createElement("div");
                Object.assign(grid.style, {
                    display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px"
                });

                // Sort keys numerically to display in order
                const sortedKeys = Object.keys(dataMap).sort((a, b) => Number(a) - Number(b));

                sortedKeys.forEach(key => {
                    const row = document.createElement("div");
                    Object.assign(row.style, { display: "flex", alignItems: "center", gap: "10px" });

                    const label = document.createElement("div");

                    // Format Label roughly
                    let labelText = key;
                    if (title.includes("Azimuth") || title.includes("水平")) labelText += "°";
                    else if (title.includes("Elevation") || title.includes("垂直")) labelText += "°";

                    label.textContent = labelText;
                    Object.assign(label.style, { width: "50px", color: "#888", fontSize: "12px", textAlign: "right" });

                    const input = document.createElement("input");
                    input.value = dataMap[key];
                    Object.assign(input.style, {
                        flex: "1", padding: "6px", backgroundColor: "#111", border: "1px solid #444", color: "#44ccff", borderRadius: "4px"
                    });
                    input.onchange = (e) => onChange(key, e.target.value);

                    // Delete Button
                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "✕";
                    Object.assign(deleteBtn.style, {
                        padding: "4px 6px", backgroundColor: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "12px", marginLeft: "5px"
                    });
                    deleteBtn.onmouseenter = () => deleteBtn.style.color = "#cc4444";
                    deleteBtn.onmouseleave = () => deleteBtn.style.color = "#666";
                    deleteBtn.title = t("deleteField");
                    deleteBtn.onclick = () => {
                        // Use custom confirm modal logic (reuse showAddKeyModal structure or make a new simple one?)
                        // For simplicity, let's reuse a simple custom confirm approach
                        const confirmOverlay = document.createElement("div");
                        Object.assign(confirmOverlay.style, {
                            position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
                            backgroundColor: "rgba(0,0,0,0.6)", zIndex: "32000",
                            display: "flex", justifyContent: "center", alignItems: "center"
                        });
                        const confirmDialog = document.createElement("div");
                        Object.assign(confirmDialog.style, {
                            backgroundColor: "#2a2a2a", padding: "20px", borderRadius: "8px", border: "1px solid #444",
                            maxWidth: "300px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                        });
                        const msg = document.createElement("p");
                        msg.textContent = t("confirmDeleteField") + ` ${labelText}?`;
                        msg.style.color = "#ddd";
                        msg.style.marginBottom = "15px";

                        const actions = document.createElement("div");
                        actions.style.display = "flex";
                        actions.style.justifyContent = "center";
                        actions.style.gap = "10px";

                        const noBtn = document.createElement("button");
                        noBtn.textContent = t("cancel");
                        Object.assign(noBtn.style, { padding: "6px 12px", backgroundColor: "#444", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" });
                        noBtn.onclick = () => confirmOverlay.remove();

                        const yesBtn = document.createElement("button");
                        yesBtn.textContent = t("confirm");
                        Object.assign(yesBtn.style, { padding: "6px 12px", backgroundColor: "#aa4444", border: "none", borderRadius: "4px", color: "white", cursor: "pointer" });
                        yesBtn.onclick = () => {
                            delete dataMap[key];
                            renderEditor();
                            confirmOverlay.remove();
                        };

                        actions.appendChild(noBtn);
                        actions.appendChild(yesBtn);
                        confirmDialog.appendChild(msg);
                        confirmDialog.appendChild(actions);
                        confirmOverlay.appendChild(confirmDialog);
                        document.body.appendChild(confirmOverlay);
                    };

                    row.appendChild(label);
                    row.appendChild(input);
                    row.appendChild(deleteBtn);
                    grid.appendChild(row);
                });
                section.appendChild(grid);
                sectionsContainer.appendChild(section);
            };

            presetSelect.onchange = () => {
                activePresetId = presetSelect.value;
                loadActiveData();
                renderEditor();
            };

            nameInput.onchange = () => {
                activeData.name = nameInput.value;
            };

            saveBtn.onclick = async () => {
                let saveId = activePresetId;
                if (saveId === 'default') {
                    // Create new if saving default
                    saveId = 'preset_' + Date.now();
                    activePresetId = saveId;
                }

                const success = await PresetManager.savePreset(saveId, activeData);
                if (success) {
                    showCustomAlert(t("presetSaved"));
                    // Reload but keep selection
                    renderEditor();
                    // Refresh current settings in manager
                    PresetManager.currentPresetId = saveId;
                }
            };

            deleteBtn.onclick = async () => {
                if (activePresetId === 'default') {
                    showCustomAlert("Cannot delete default preset.");
                    return;
                }
                showCustomConfirm(t("confirmDeletePreset") + ` "${activeData.name}"?`, async () => {
                    const success = await PresetManager.deletePreset(activePresetId);
                    if (success) {
                        showCustomAlert(t("presetDeleted"));
                        activePresetId = 'default';
                        loadActiveData(); // Load default
                        renderEditor();   // Render default
                    }
                });
            };
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

            // Camera Presets Button
            const presetsBtn = document.createElement("button");
            presetsBtn.textContent = t("presets");
            presetsBtn.dataset.i18n = "presets";
            Object.assign(presetsBtn.style, {
                padding: "4px 10px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "#ddd",
                fontSize: "12px",
                cursor: "pointer"
            });
            presetsBtn.onmouseenter = () => presetsBtn.style.backgroundColor = "#444";
            presetsBtn.onmouseleave = () => presetsBtn.style.backgroundColor = "#333";
            presetsBtn.onclick = openPresetEditor;

            headerButtonsContainer.appendChild(presetsBtn);

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

                // Initialize Preset Selection
                let selectedPresetId = savedSettings.presetId || PresetManager.currentPresetId;

                // Preset Selector Bar
                const presetBar = document.createElement("div");
                Object.assign(presetBar.style, {
                    display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px",
                    backgroundColor: "#222", padding: "8px 12px", borderRadius: "6px"
                });

                const presetLabel = document.createElement("label");
                presetLabel.textContent = t("selectPreset");
                Object.assign(presetLabel.style, { color: "#aaa", fontSize: "12px" });

                const presetSelect = document.createElement("select");
                Object.assign(presetSelect.style, {
                    flex: "1", padding: "6px", backgroundColor: "#111", border: "1px solid #444", color: "white", borderRadius: "4px"
                });

                // Populate presets
                // Default
                const defOption = document.createElement("option");
                defOption.value = 'default';
                defOption.textContent = t("defaultPreset");
                presetSelect.appendChild(defOption);

                Object.keys(PresetManager.presets).forEach(id => {
                    if (id === 'default') return;
                    const option = document.createElement("option");
                    option.value = id;
                    option.textContent = PresetManager.presets[id].name;
                    presetSelect.appendChild(option);
                });
                presetSelect.value = selectedPresetId;

                // Helper to update limits based on preset
                function applyPresetLimits(pid) {
                    const pData = PresetManager.getPreset(pid);
                    if (!pData || !iframe.contentWindow || !iframe.contentWindow.threeScene || !iframe.contentWindow.threeScene.updateLimits) return;

                    // Elevation
                    const elKeys = Object.keys(pData.elevation).map(Number);
                    if (elKeys.length > 0) {
                        const minEl = Math.min(...elKeys);
                        const maxEl = Math.max(...elKeys);
                        iframe.contentWindow.threeScene.updateLimits(minEl, maxEl);
                    }
                }

                presetSelect.onchange = () => {
                    selectedPresetId = presetSelect.value;
                    // Trigger update via checking current settings
                    // We need to re-calculate prompt based on current angles and new preset
                    const p = PresetManager.getPrompt(currentSettings.horizontal, currentSettings.vertical, currentSettings.zoom, selectedPresetId);
                    currentPrompt = p;
                    promptPreviewText.textContent = currentPrompt;
                    // Send to iframe
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                            type: 'SET_PROMPT_PREVIEW',
                            prompt: currentPrompt
                        }, '*');
                    }
                    applyPresetLimits(selectedPresetId);
                };

                presetBar.appendChild(presetLabel);
                presetBar.appendChild(presetSelect);

                // Add preset bar to modal before viewer
                // Note: We need to ensure modalContent is available in scope. It is created above.
                // But we are replacing lines where modalContent is already added to.
                // The replacement block ends at modalHeader appendChild. 
                // We need to append presetBar to modalContent. 
                modalContent.appendChild(presetBar);

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
        let limits = { minElevation: -30, maxElevation: 90 }; // Dynamic limits
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
            // promptPreviewEl.textContent = generatePromptPreview();
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
            let elevationArc = null;
            function rebuildElevationArc() {
                if (elevationArc) scene.remove(elevationArc);
                const arcPoints = [];
                const range = limits.maxElevation - limits.minElevation;
                for (let i = 0; i <= 32; i++) {
                    const angle = (limits.minElevation + (range * i / 32)) * Math.PI / 180;
                    arcPoints.push(new THREE.Vector3(
                        ELEV_ARC_X,
                        ELEVATION_RADIUS * Math.sin(angle) + CENTER.y,
                        ELEVATION_RADIUS * Math.cos(angle)
                    ));
                }
                const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
                const elArcGeo = new THREE.TubeGeometry(arcCurve, 32, 0.04, 8, false);
                const elArcMat = new THREE.MeshBasicMaterial({ color: 0x00FFD0, transparent: true, opacity: 0.8 });
                elevationArc = new THREE.Mesh(elArcGeo, elArcMat);
                scene.add(elevationArc);
            }
            rebuildElevationArc();

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
                        angle = Math.max(limits.minElevation, Math.min(limits.maxElevation, angle));
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
                        const maxSize = 1.6; // Slightly larger
                        let scaleX, scaleY;
                        if (ar > 1) { scaleX = maxSize; scaleY = maxSize / ar; }
                        else { scaleY = maxSize; scaleX = maxSize * ar; }
                        imagePlane.scale.set(scaleX, scaleY, 1);
                        imageFrame.scale.set(scaleX, scaleY, 1);
                    };
                    img.src = url;
                },
                updateLimits: (minEl, maxEl) => {
                    limits.minElevation = minEl;
                    limits.maxElevation = maxEl;
                    rebuildElevationArc();
                    // Clamp current state
                    if (state.elevation < minEl) state.elevation = minEl;
                    if (state.elevation > maxEl) state.elevation = maxEl;
                    liveElevation = state.elevation;
                    updateVisuals();
                    updateDisplay();
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
            } else if (data.type === 'SET_HORIZONTAL') {
                if (window.threeScene && window.threeScene.setHorizontal) {
                    window.threeScene.setHorizontal(data.angle);
                }
            } else if (data.type === 'SET_VERTICAL') {
                if (window.threeScene && window.threeScene.setVertical) {
                    window.threeScene.setVertical(data.angle);
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
            } else if (data.type === 'SET_PROMPT_PREVIEW') {
                promptPreviewEl.textContent = data.prompt;
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

                // Horizontal Slider
                const hSliderRow = document.createElement("div");
                Object.assign(hSliderRow.style, { display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" });

                const hLabel = document.createElement("label");
                hLabel.textContent = t("azimuth");
                Object.assign(hLabel.style, { color: "#44ccff", fontSize: "12px", fontWeight: "bold", minWidth: "70px" });

                const hSlider = document.createElement("input");
                hSlider.type = "range";
                hSlider.min = "0";
                hSlider.max = "360";
                hSlider.value = String(savedSettings.horizontal || 0);
                Object.assign(hSlider.style, { flex: "1", accentColor: "#44ccff", cursor: "pointer" });

                const hValueDisplay = document.createElement("span");
                hValueDisplay.textContent = (savedSettings.horizontal || 0) + '°';
                Object.assign(hValueDisplay.style, { color: "#44ccff", fontSize: "12px", fontWeight: "bold", minWidth: "30px", textAlign: "right" });

                hSlider.oninput = () => {
                    const val = parseInt(hSlider.value);
                    hValueDisplay.textContent = val + '°';
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage({ type: 'SET_HORIZONTAL', angle: val }, '*');
                    }
                };

                hSliderRow.appendChild(hLabel);
                hSliderRow.appendChild(hSlider);
                hSliderRow.appendChild(hValueDisplay);
                sliderContainer.appendChild(hSliderRow);

                // Vertical Slider
                const vSliderRow = document.createElement("div");
                Object.assign(vSliderRow.style, { display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" });

                const vLabel = document.createElement("label");
                vLabel.textContent = t("elevation");
                Object.assign(vLabel.style, { color: "#00FFD0", fontSize: "12px", fontWeight: "bold", minWidth: "70px" });

                const vSlider = document.createElement("input");
                vSlider.type = "range";
                vSlider.min = "-90";
                vSlider.max = "90";
                vSlider.value = String(savedSettings.vertical || 0);
                Object.assign(vSlider.style, { flex: "1", accentColor: "#00FFD0", cursor: "pointer" });

                const vValueDisplay = document.createElement("span");
                vValueDisplay.textContent = (savedSettings.vertical || 0) + '°';
                Object.assign(vValueDisplay.style, { color: "#00FFD0", fontSize: "12px", fontWeight: "bold", minWidth: "30px", textAlign: "right" });

                vSlider.oninput = () => {
                    const val = parseInt(vSlider.value);
                    vValueDisplay.textContent = val + '°';
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage({ type: 'SET_VERTICAL', angle: val }, '*');
                    }
                };

                vSliderRow.appendChild(vLabel);
                vSliderRow.appendChild(vSlider);
                vSliderRow.appendChild(vValueDisplay);
                sliderContainer.appendChild(vSliderRow);

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
                        // Use PresetManager to get prompt
                        currentPrompt = PresetManager.getPrompt(data.horizontal, data.vertical, data.zoom, selectedPresetId);
                        promptPreviewText.textContent = currentPrompt;

                        // Send back to iframe to update text
                        if (iframe.contentWindow) {
                            iframe.contentWindow.postMessage({
                                type: 'SET_PROMPT_PREVIEW',
                                prompt: currentPrompt
                            }, '*');
                        }

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
                        if (data.horizontal !== undefined) {
                            hSlider.value = Math.round(data.horizontal);
                            hValueDisplay.textContent = Math.round(data.horizontal) + '°';
                        }
                        if (data.vertical !== undefined) {
                            vSlider.value = Math.round(data.vertical);
                            vValueDisplay.textContent = Math.round(data.vertical) + '°';
                        }
                    } else if (data.type === 'VIEWER_READY') {
                        iframeReady = true;
                        // Apply limits when viewer is ready
                        applyPresetLimits(selectedPresetId);
                        // Send initial camera settings
                        iframe.contentWindow.postMessage({
                            type: 'INIT_SETTINGS',
                            horizontal: savedSettings.horizontal,
                            vertical: savedSettings.vertical,
                            zoom: savedSettings.zoom
                        }, '*');

                        // Also send initial prompt based on loaded settings
                        const p = PresetManager.getPrompt(savedSettings.horizontal, savedSettings.vertical, savedSettings.zoom, selectedPresetId);
                        currentPrompt = p;
                        promptPreviewText.textContent = currentPrompt;
                        iframe.contentWindow.postMessage({
                            type: 'SET_PROMPT_PREVIEW',
                            prompt: currentPrompt
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
                    shotData.cameraSettings = { ...currentSettings, presetId: selectedPresetId };
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
                // Run button
                const runBtn = document.createElement("button");
                runBtn.classList.add("storyboard-run-btn");
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
                runBtn.onmouseenter = () => {
                    if (!card.shotData.isRunning) runBtn.style.backgroundColor = "#55bb55";
                    else runBtn.style.backgroundColor = "#cc5555";
                };
                runBtn.onmouseleave = () => {
                    if (!card.shotData.isRunning) runBtn.style.backgroundColor = "#44aa44";
                    else runBtn.style.backgroundColor = "#aa4444";
                };

                const resetRunBtn = () => {
                    runBtn.textContent = t("run");
                    runBtn.dataset.i18n = "run";
                    runBtn.style.backgroundColor = "#44aa44";
                    runBtn.disabled = false;
                    card.shotData.isRunning = false;
                    card.shotData.pollInterval = null;
                };

                runBtn.onclick = async () => {
                    // Check if already running - if so, this is a Cancel action
                    if (card.shotData.isRunning) {
                        // Cancel logic
                        if (card.shotData.pollInterval) {
                            clearInterval(card.shotData.pollInterval);
                        }

                        try {
                            // Try to interrupt backend
                            await api.fetchApi("/interrupt", { method: "POST" });
                        } catch (e) {
                            console.error("Failed to interrupt:", e);
                        }

                        // Remove loading animation
                        const loadingAnim = card.shotData.resultArea.querySelector(".loading-animation");
                        if (loadingAnim) loadingAnim.remove();

                        // Show placeholder again if no image
                        if (!card.shotData.lastImageUrl) {
                            card.shotData.placeholder.style.display = "";
                        }

                        resetRunBtn();
                        return;
                    }

                    // Start Run Logic
                    // Validate node IDs
                    const promptNodeId = promptNodeInput.value.trim();
                    const saveNodeId = saveNodeInput.value.trim();
                    const refImageNodeId = refImageNodeInput.value.trim();

                    if (!promptNodeId || !saveNodeId) {
                        alert(t("pleaseSelect"));
                        return;
                    }

                    // Set state to running
                    card.shotData.isRunning = true;
                    // Change button to Cancel
                    runBtn.removeAttribute("data-i18n");
                    runBtn.textContent = t("cancel");
                    runBtn.style.backgroundColor = "#aa4444";

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

                            // Update button text to indicate generating but still cancellable
                            // runBtn.textContent = t("cancel"); // Keep as cancel

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
                            card.shotData.pollInterval = setInterval(async () => {
                                if (!card.shotData.isRunning) {
                                    clearInterval(card.shotData.pollInterval);
                                    return;
                                }
                                attempts++;
                                const done = await checkExecution();
                                if (done || attempts >= maxAttempts) {
                                    clearInterval(card.shotData.pollInterval);
                                    card.shotData.pollInterval = null;

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

                                    // Reset running state
                                    card.shotData.isRunning = false;

                                    // Re-enable button after completion
                                    setTimeout(() => {
                                        if (!card.shotData.isRunning) { // Double check
                                            resetRunBtn();
                                        }
                                    }, 1500);
                                }
                            }, 500);
                        } else {
                            runBtn.textContent = t("failed");
                            runBtn.style.backgroundColor = "#cc4444";
                            card.shotData.isRunning = false;
                            setTimeout(resetRunBtn, 2000);
                        }
                    } catch (e) {
                        console.error("Run error:", e);
                        runBtn.textContent = t("failed");
                        runBtn.style.backgroundColor = "#cc4444";
                        card.shotData.isRunning = false;
                        setTimeout(resetRunBtn, 2000);
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
            runAllBtn.onmouseenter = () => {
                if (!runAllBtn.dataset.isRunning) runAllBtn.style.backgroundColor = "#55bb55";
                else runAllBtn.style.backgroundColor = "#cc5555";
            };
            runAllBtn.onmouseleave = () => {
                if (!runAllBtn.dataset.isRunning) runAllBtn.style.backgroundColor = "#44aa44";
                else runAllBtn.style.backgroundColor = "#aa4444";
            };

            runAllBtn.onclick = async () => {
                // Check if already running - if so, this is a Cancel action
                if (runAllBtn.dataset.isRunning === 'true') {
                    // Set cancellation flag
                    runAllBtn.dataset.isCancelling = 'true';
                    runAllBtn.textContent = t("cancel") + "...";
                    return;
                }

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

                // Start Run All
                runAllBtn.dataset.isRunning = 'true';
                runAllBtn.dataset.isCancelling = 'false';
                runAllBtn.removeAttribute("data-i18n"); // Prevent overwrite while running
                const originalText = runAllBtn.textContent;
                let completedCount = 0;

                // Run each card sequentially
                for (const card of cards) {
                    // Check for cancellation
                    if (runAllBtn.dataset.isCancelling === 'true') {
                        // If current card is running, it will be cancelled explicitly if we trigger cancel on it
                        // But since we are in the loop, we just stop proceeding.
                        // The 'await' below might need to be interrupted?
                        // Actually, if we are waiting, we can't easily break the wait unless the wait checks the flag.
                        break;
                    }

                    if (!card.shotData) continue;

                    runAllBtn.textContent = `${t("cancel")} (${completedCount + 1}/${cards.length})`;
                    runAllBtn.style.backgroundColor = "#aa4444";

                    // Find the run button in this card
                    const runBtn = card.querySelector(".storyboard-run-btn");

                    if (runBtn) {
                        // If runBtn is already in 'Cancel' state (running), we skip or wait? 
                        // Assume logical start from scratch or idle.
                        // If it is NOT running, we click it to start.
                        if (!card.shotData.isRunning) {
                            runBtn.click();
                        }

                        // Wait for this card to complete
                        await new Promise(resolve => {
                            const checkComplete = setInterval(() => {
                                // If global cancellation requested
                                if (runAllBtn.dataset.isCancelling === 'true') {
                                    // Click run button again to cancel this specific card if it's running
                                    if (card.shotData.isRunning) {
                                        runBtn.click();
                                    }
                                    clearInterval(checkComplete);
                                    resolve();
                                    return;
                                }

                                if (!card.shotData.isRunning) {
                                    clearInterval(checkComplete);
                                    resolve();
                                }
                            }, 500);
                        });
                    }
                    completedCount++;
                }

                // Reset UI
                if (runAllBtn.dataset.isCancelling === 'true') {
                    // Was cancelled
                } else {
                    runAllBtn.textContent = `${t("done")} (${completedCount}/${cards.length})`;
                    runAllBtn.style.backgroundColor = "#44aa44";
                }

                runAllBtn.dataset.isRunning = 'false';
                runAllBtn.dataset.isCancelling = 'false';

                setTimeout(() => {
                    if (runAllBtn.dataset.isRunning !== 'true') {
                        runAllBtn.textContent = t("runAll");
                        runAllBtn.dataset.i18n = "runAll"; // Restore
                        runAllBtn.style.backgroundColor = "#44aa44";
                    }
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

            // Footer
            const footerDiv = document.createElement("div");
            Object.assign(footerDiv.style, {
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: "1px solid #333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                color: "#666",
                gap: "10px",
                flexWrap: "wrap"
            });

            const createLink = (text, url) => {
                const a = document.createElement("a");
                a.textContent = text;
                a.href = url;
                a.target = "_blank";
                Object.assign(a.style, {
                    color: "#888",
                    textDecoration: "none",
                    transition: "color 0.2s"
                });
                a.onmouseenter = () => a.style.color = "#ccc";
                a.onmouseleave = () => a.style.color = "#888";
                return a;
            };

            const authorText = document.createElement("span");
            authorText.textContent = "作者: HooToo";

            const bSiteLink = createLink("哔站", "https://space.bilibili.com/527601196?spm_id_from=333.1007.0.0");
            const githubLink = createLink("Github", "https://github.com/colorAi");
            const rhLink = createLink("RH邀请链接 送1000RH币", "https://www.runninghub.ai/?inviteCode=rh-v1123");

            const qqGroupText = document.createElement("span");
            qqGroupText.textContent = "QQ交流群: 543917943";

            const separator = () => {
                const s = document.createElement("span");
                s.textContent = "|";
                s.style.color = "#444";
                return s;
            };

            footerDiv.appendChild(authorText);
            footerDiv.appendChild(separator());
            footerDiv.appendChild(bSiteLink);
            footerDiv.appendChild(separator());
            footerDiv.appendChild(githubLink);
            footerDiv.appendChild(separator());
            footerDiv.appendChild(rhLink);
            footerDiv.appendChild(separator());
            footerDiv.appendChild(qqGroupText);

            content.appendChild(closeBtn);
            content.appendChild(headerDiv);
            content.appendChild(body);
            content.appendChild(footerDiv);
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
