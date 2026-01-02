import { app } from "../../scripts/app.js";

console.log("ComfyUI Storyboard: Extension loading...");

app.registerExtension({
    name: "ComfyUI.Storyboard",
    setup() {
        console.log("ComfyUI Storyboard: Setup called");

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
                padding: "20px",
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

            // Header container with title and snake button
            const headerDiv = document.createElement("div");
            Object.assign(headerDiv.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
            });

            const title = document.createElement("h2");
            title.textContent = "Storyboard Image Generation";

            // Snake game button
            const snakeBtn = document.createElement("button");
            snakeBtn.textContent = "🐍 贪吃蛇";
            Object.assign(snakeBtn.style, {
                padding: "8px 16px",
                backgroundColor: "#44aa44",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s"
            });
            snakeBtn.onmouseenter = () => snakeBtn.style.backgroundColor = "#55bb55";
            snakeBtn.onmouseleave = () => snakeBtn.style.backgroundColor = "#44aa44";

            headerDiv.appendChild(title);
            headerDiv.appendChild(snakeBtn);

            const body = document.createElement("div");
            Object.assign(body.style, {
                marginTop: "20px",
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

            // Prompt node ID input
            const promptNodeGroup = document.createElement("div");
            Object.assign(promptNodeGroup.style, {
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            const promptNodeLabel = document.createElement("label");
            promptNodeLabel.textContent = "提示词节点 ID:";
            Object.assign(promptNodeLabel.style, {
                color: "#aaa",
                fontSize: "12px",
                whiteSpace: "nowrap"
            });
            const promptNodeInput = document.createElement("input");
            promptNodeInput.type = "text";
            promptNodeInput.placeholder = "例如: 6";
            Object.assign(promptNodeInput.style, {
                width: "80px",
                padding: "6px 10px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px"
            });
            promptNodeInput.onfocus = () => promptNodeInput.style.borderColor = "#44ccff";
            promptNodeInput.onblur = () => promptNodeInput.style.borderColor = "#444";
            promptNodeGroup.appendChild(promptNodeLabel);
            promptNodeGroup.appendChild(promptNodeInput);

            // Save image node ID input
            const saveNodeGroup = document.createElement("div");
            Object.assign(saveNodeGroup.style, {
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            const saveNodeLabel = document.createElement("label");
            saveNodeLabel.textContent = "保存图像节点 ID:";
            Object.assign(saveNodeLabel.style, {
                color: "#aaa",
                fontSize: "12px",
                whiteSpace: "nowrap"
            });
            const saveNodeInput = document.createElement("input");
            saveNodeInput.type = "text";
            saveNodeInput.placeholder = "例如: 9";
            Object.assign(saveNodeInput.style, {
                width: "80px",
                padding: "6px 10px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px"
            });
            saveNodeInput.onfocus = () => saveNodeInput.style.borderColor = "#44ccff";
            saveNodeInput.onblur = () => saveNodeInput.style.borderColor = "#444";
            saveNodeGroup.appendChild(saveNodeLabel);
            saveNodeGroup.appendChild(saveNodeInput);

            // Reference image node ID input (for img2img mode)
            const refImageNodeGroup = document.createElement("div");
            Object.assign(refImageNodeGroup.style, {
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            const refImageNodeLabel = document.createElement("label");
            refImageNodeLabel.textContent = "参考图节点 ID:";
            Object.assign(refImageNodeLabel.style, {
                color: "#aaa",
                fontSize: "12px",
                whiteSpace: "nowrap"
            });
            const refImageNodeInput = document.createElement("input");
            refImageNodeInput.type = "text";
            refImageNodeInput.placeholder = "可选 (图生图)";
            Object.assign(refImageNodeInput.style, {
                width: "100px",
                padding: "6px 10px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px"
            });
            refImageNodeInput.onfocus = () => refImageNodeInput.style.borderColor = "#44ccff";
            refImageNodeInput.onblur = () => refImageNodeInput.style.borderColor = "#444";
            refImageNodeGroup.appendChild(refImageNodeLabel);
            refImageNodeGroup.appendChild(refImageNodeInput);

            // Help hint
            const helpHint = document.createElement("span");
            helpHint.textContent = "💡 不填参考图ID为文生图，填写则为图生图模式";
            Object.assign(helpHint.style, {
                color: "#666",
                fontSize: "11px",
                marginLeft: "auto"
            });

            configBar.appendChild(promptNodeGroup);
            configBar.appendChild(saveNodeGroup);
            configBar.appendChild(refImageNodeGroup);
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

            // Storage key for this workflow
            const storageKey = "comfyui_storyboard_data";

            // Save storyboard data to localStorage
            const saveStoryboardData = () => {
                const cards = cardsContainer.querySelectorAll("[data-shot-name]");
                const cardDataList = [];
                cards.forEach(card => {
                    if (card.shotData) {
                        cardDataList.push({
                            shotName: card.shotData.name,
                            prompt: card.shotData.promptInput.value || "",
                            imageUrl: card.shotData.lastImageUrl || null,
                            generateCount: card.shotData.getGenerateCount()
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
                    localStorage.setItem(storageKey, JSON.stringify(data));
                } catch (e) {
                    console.error("Failed to save storyboard data:", e);
                }
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
                runBtn.textContent = "▶ 运行";
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
                        alert("请先填写提示词节点 ID 和保存图像节点 ID！");
                        return;
                    }

                    runBtn.disabled = true;
                    runBtn.textContent = "⏳ 运行中...";
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

                            runBtn.textContent = "⏳ 生成中...";
                            runBtn.style.backgroundColor = "#cc8844";

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

                                                    // Hide placeholder
                                                    placeholder.style.display = "none";

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

                                                    runBtn.textContent = "✓ 完成";
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
                                    if (!done && attempts >= maxAttempts) {
                                        runBtn.textContent = "⚠ 超时";
                                        runBtn.style.backgroundColor = "#cc8844";
                                    }
                                    setTimeout(() => {
                                        runBtn.disabled = false;
                                        runBtn.textContent = "▶ 运行";
                                        runBtn.style.backgroundColor = "#44aa44";
                                    }, 2000);
                                }
                            }, 500);

                            return; // Don't reset button immediately
                        } else {
                            const errorData = await res.json().catch(() => ({}));
                            throw new Error(errorData.error || "Failed to queue");
                        }
                    } catch (e) {
                        console.error("Run failed:", e);
                        runBtn.textContent = "✗ 失败";
                        runBtn.style.backgroundColor = "#cc4444";
                        generateCount--; // Rollback counter on failure

                        setTimeout(() => {
                            runBtn.disabled = false;
                            runBtn.textContent = "▶ 运行";
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
                    if (confirm(`确定删除 ${shotName} 吗？`)) {
                        card.remove();
                        saveStoryboardData();
                    }
                };

                const btnGroup = document.createElement("div");
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
                placeholder.textContent = "结果预览区";
                Object.assign(placeholder.style, {
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "14px",
                    userSelect: "none"
                });
                resultArea.appendChild(placeholder);

                // Zoom overlay for enlarged view
                resultArea.style.cursor = "pointer";
                resultArea.title = "点击放大查看";
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
                    closeBtn.textContent = "✕ 关闭";
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
                promptLabel.textContent = "提示词:";
                Object.assign(promptLabel.style, {
                    color: "#aaa",
                    fontSize: "11px",
                    display: "block",
                    marginBottom: "4px"
                });

                const promptInput = document.createElement("textarea");
                promptInput.placeholder = "输入此分镜的提示词...";
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
                }

                return card;
            };

            // Bottom toolbar
            const toolbar = document.createElement("div");
            Object.assign(toolbar.style, {
                padding: "12px 16px",
                backgroundColor: "#2a2a2a",
                borderTop: "1px solid #444",
                display: "flex",
                justifyContent: "center",
                gap: "12px"
            });

            // Add shot button
            const addShotBtn = document.createElement("button");
            addShotBtn.textContent = "➕ 增加分镜";
            Object.assign(addShotBtn.style, {
                padding: "10px 24px",
                backgroundColor: "#4488cc",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
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

            toolbar.appendChild(addShotBtn);

            // Load storyboard data from localStorage
            const loadStoryboardData = () => {
                try {
                    const saved = localStorage.getItem(storageKey);
                    if (saved) {
                        const data = JSON.parse(saved);

                        // Restore config
                        if (data.promptNodeId) promptNodeInput.value = data.promptNodeId;
                        if (data.saveNodeId) saveNodeInput.value = data.saveNodeId;
                        if (data.refImageNodeId) refImageNodeInput.value = data.refImageNodeId;
                        if (data.shotSequence) shotSequence = data.shotSequence;

                        // Restore cards
                        if (data.cards && data.cards.length > 0) {
                            data.cards.forEach(cardData => {
                                const card = createCard(cardData);
                                cardsContainer.appendChild(card);
                            });
                        }
                    }
                } catch (e) {
                    console.error("Failed to load storyboard data:", e);
                }
            };

            // Load saved data on initialization
            loadStoryboardData();

            defaultContent.appendChild(configBar);
            defaultContent.appendChild(cardsContainer);
            defaultContent.appendChild(toolbar);

            // Snake game container (hidden by default)
            const snakeContainer = document.createElement("div");
            Object.assign(snakeContainer.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                display: "none"
            });

            const textDiv = document.createElement("div");
            textDiv.innerHTML = "正在计划制作一个Comfyui的分镜工具。<br>此时作者正在思考。。。完成时间未知。。。";
            Object.assign(textDiv.style, {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "32px",
                fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.3)",
                zIndex: "0",
                pointerEvents: "none",
                textAlign: "center",
                userSelect: "none",
                lineHeight: "1.6",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                padding: "30px",
                borderRadius: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.3)"
            });

            const canvas = document.createElement("canvas");
            Object.assign(canvas.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                zIndex: "1",
                outline: "none"
            });

            // Score Display
            const scoreDiv = document.createElement("div");
            scoreDiv.textContent = "Score: 0";
            Object.assign(scoreDiv.style, {
                position: "absolute",
                top: "20px",
                left: "20px",
                color: "#44ccff",
                fontSize: "24px",
                fontWeight: "bold",
                zIndex: "5",
                pointerEvents: "none",
                fontFamily: "monospace"
            });

            // Game Over Overlay
            const gameOverDiv = document.createElement("div");
            Object.assign(gameOverDiv.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.9)",
                display: "none",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                zIndex: "100"
            });

            // Watermark
            const watermark = document.createElement("div");
            watermark.textContent = "按 ↑ ↓ ← → 接管控制 / Press Arrow Keys to Play";
            Object.assign(watermark.style, {
                position: "absolute",
                bottom: "10px",
                right: "10px",
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "12px",
                zIndex: "2",
                pointerEvents: "none"
            });

            snakeContainer.appendChild(textDiv);
            snakeContainer.appendChild(canvas);
            snakeContainer.appendChild(scoreDiv);
            snakeContainer.appendChild(gameOverDiv);
            snakeContainer.appendChild(watermark);

            body.appendChild(defaultContent);
            body.appendChild(snakeContainer);

            // Audio Setup
            const bgMusic = new Audio("extensions/comfyui-storyboard/audio/bg.mp3");
            bgMusic.loop = true;
            bgMusic.volume = 0.3;

            const endMusic = new Audio("extensions/comfyui-storyboard/audio/end.mp3");
            endMusic.volume = 0.4;

            // Snake Game Logic
            let gameInterval;

            const startGame = () => {
                // Try to play music
                bgMusic.currentTime = 0;
                bgMusic.play().catch(e => console.log("Audio play failed (autoplay policy?):", e));

                const ctx = canvas.getContext('2d');
                const cellSize = 20;
                let width, height;
                let cols, rows;
                let obstacle = { x: 0, y: 0, w: 0, h: 0 };

                const resize = () => {
                    width = body.clientWidth;
                    height = body.clientHeight;
                    canvas.width = width;
                    canvas.height = height;
                    cols = Math.floor(width / cellSize);
                    rows = Math.floor(height / cellSize);

                    // Calculate text obstacle zone
                    // Use offset properties which are relative to the positioned parent (body)
                    // This matches the canvas coordinate system exactly
                    const startX = Math.floor(textDiv.offsetLeft / cellSize);
                    const startY = Math.floor(textDiv.offsetTop / cellSize);
                    const endX = Math.floor((textDiv.offsetLeft + textDiv.offsetWidth - 1) / cellSize);
                    const endY = Math.floor((textDiv.offsetTop + textDiv.offsetHeight - 1) / cellSize);

                    obstacle.x = startX;
                    obstacle.y = startY;
                    obstacle.w = endX - startX + 1;
                    obstacle.h = endY - startY + 1;
                };
                resize();
                window.addEventListener('resize', resize);

                let snake = [];
                let direction = { x: 1, y: 0 }; // Velocity
                let nextDirection = { x: 1, y: 0 };
                let food = null;
                let score = 0;
                let autoMode = true;
                let isGameOver = false;

                const isObstacle = (x, y) => {
                    return x >= obstacle.x && x < obstacle.x + obstacle.w &&
                        y >= obstacle.y && y < obstacle.y + obstacle.h;
                };

                const updateScore = (val) => {
                    score = val;
                    scoreDiv.textContent = `Score: ${score}`;
                };

                const triggerGameOver = () => {
                    isGameOver = true;
                    bgMusic.pause();
                    endMusic.currentTime = 0;
                    endMusic.play().catch(e => console.log("End music failed:", e));

                    let countdown = 5;
                    gameOverDiv.style.display = "flex";

                    const updateText = () => {
                        gameOverDiv.innerHTML = `
                            <h1 style="font-size: 48px; margin-bottom: 20px; color: #ff4444;">GAME OVER</h1>
                            <div style="font-size: 32px; margin-bottom: 20px;">您的分数为: <span style="color: #44ccff;">${score}</span></div>
                            <div style="font-size: 24px; color: #888;">${countdown} 秒后重新开始...</div>
                        `;
                    };

                    updateText();

                    const timer = setInterval(() => {
                        countdown--;
                        if (countdown <= 0) {
                            clearInterval(timer);
                            gameOverDiv.style.display = "none";
                            isGameOver = false;
                            endMusic.pause();
                            endMusic.currentTime = 0;
                            resetGame();
                        } else {
                            updateText();
                        }
                    }, 1000);
                };

                const resetGame = () => {
                    // Ensure BG music is playing if it was stopped
                    if (bgMusic.paused && !isGameOver) {
                        bgMusic.play().catch(e => console.log("BG music resume failed:", e));
                    }

                    // Start at top-left to avoid center text
                    snake = [
                        { x: 5, y: 5 },
                        { x: 4, y: 5 },
                        { x: 3, y: 5 }
                    ];
                    direction = { x: 1, y: 0 };
                    nextDirection = { x: 1, y: 0 };
                    updateScore(0);
                    autoMode = true;
                    spawnFood();
                };

                const spawnFood = () => {
                    if (cols <= 0 || rows <= 0) return;

                    let valid = false;
                    let attempts = 0;
                    const maxAttempts = 100;

                    while (!valid && attempts < maxAttempts) {
                        const fx = Math.floor(Math.random() * cols);
                        const fy = Math.floor(Math.random() * rows);
                        // Don't spawn on snake OR obstacle
                        if (!snake.some(s => s.x === fx && s.y === fy) && !isObstacle(fx, fy)) {
                            food = { x: fx, y: fy };
                            valid = true;
                        }
                        attempts++;
                    }

                    // Fallback: scan for empty spot if random fails
                    if (!valid) {
                        for (let y = 0; y < rows; y++) {
                            for (let x = 0; x < cols; x++) {
                                if (!snake.some(s => s.x === x && s.y === y) && !isObstacle(x, y)) {
                                    food = { x, y };
                                    valid = true;
                                    break;
                                }
                            }
                            if (valid) break;
                        }
                    }
                };

                // AI Logic
                const getAutoDirection = () => {
                    const head = snake[0];

                    // BFS to find shortest path to food
                    const visited = new Set();
                    const parents = new Map();
                    const queue = [head];
                    visited.add(`${head.x},${head.y}`);

                    // Create collision set for fast lookup (snake body)
                    const snakeBodySet = new Set();
                    snake.forEach(s => snakeBodySet.add(`${s.x},${s.y}`));

                    let foundTarget = null;

                    while (queue.length > 0) {
                        const curr = queue.shift();

                        if (curr.x === food.x && curr.y === food.y) {
                            foundTarget = curr;
                            break;
                        }

                        const moves = [
                            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
                        ];

                        for (const m of moves) {
                            const nx = curr.x + m.x;
                            const ny = curr.y + m.y;
                            const key = `${nx},${ny}`;

                            if (!visited.has(key)) {
                                // Check bounds
                                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                                    // Check obstacles
                                    const isSnake = snakeBodySet.has(key);
                                    const isText = isObstacle(nx, ny);

                                    if (!isSnake && !isText) {
                                        visited.add(key);
                                        parents.set(key, curr);
                                        queue.push({ x: nx, y: ny });
                                    }
                                }
                            }
                        }
                    }

                    if (foundTarget) {
                        // Reconstruct path to get the first move
                        let curr = foundTarget;
                        while (true) {
                            const parent = parents.get(`${curr.x},${curr.y}`);
                            if (parent.x === head.x && parent.y === head.y) {
                                return { x: curr.x - head.x, y: curr.y - head.y };
                            }
                            curr = parent;
                        }
                    }

                    // Fallback: Greedy if no path found (e.g. trapped)
                    const moves = [
                        { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
                    ];

                    // Filter out moves that kill us immediately (walls, self, or obstacle)
                    const safeMoves = moves.filter(m => {
                        // Prevent 180 turn
                        if (m.x === -direction.x && m.y === -direction.y) return false;

                        const nx = head.x + m.x;
                        const ny = head.y + m.y;

                        // Wall collision
                        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return false;

                        // Self collision
                        if (snake.some(s => s.x === nx && s.y === ny)) return false;

                        // Obstacle collision
                        if (isObstacle(nx, ny)) return false;

                        return true;
                    });

                    if (safeMoves.length === 0) return direction; // No hope

                    // Sort safe moves by distance to food
                    safeMoves.sort((a, b) => {
                        const distA = Math.abs((head.x + a.x) - food.x) + Math.abs((head.y + a.y) - food.y);
                        const distB = Math.abs((head.x + b.x) - food.x) + Math.abs((head.y + b.y) - food.y);
                        return distA - distB;
                    });

                    return safeMoves[0];
                };

                // Input Handling
                const handleKey = (e) => {
                    if (isGameOver) return;

                    const key = e.key;
                    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                        e.preventDefault();

                        if (autoMode) {
                            autoMode = false;
                            updateScore(0); // Reset score on takeover
                            // Reset snake length to initial size (3)
                            if (snake.length > 3) {
                                snake = snake.slice(0, 3);
                            }
                        }

                        if (key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
                        if (key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
                        if (key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
                        if (key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
                    }
                };
                document.addEventListener('keydown', handleKey);

                const update = () => {
                    if (isGameOver) return;

                    if (autoMode) {
                        nextDirection = getAutoDirection();
                    }

                    direction = nextDirection;
                    const head = snake[0];
                    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

                    // Check Death (Wall, Self, or Obstacle)
                    if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows ||
                        snake.some(s => s.x === newHead.x && s.y === newHead.y) ||
                        isObstacle(newHead.x, newHead.y)) {
                        triggerGameOver();
                        return;
                    }

                    snake.unshift(newHead);

                    // Check Eat
                    if (newHead.x === food.x && newHead.y === food.y) {
                        updateScore(score + 5);
                        spawnFood();
                    } else {
                        snake.pop();
                    }
                };

                const draw = () => {
                    // Clear
                    ctx.clearRect(0, 0, width, height);

                    // Draw Food
                    if (food) {
                        ctx.fillStyle = '#ff4444';
                        const px = food.x * cellSize;
                        const py = food.y * cellSize;
                        ctx.beginPath();
                        ctx.arc(px + cellSize / 2, py + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
                        ctx.fill();
                        // Shine
                        ctx.fillStyle = 'white';
                        ctx.beginPath();
                        ctx.arc(px + cellSize / 2 + 3, py + cellSize / 2 - 3, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Draw Snake
                    snake.forEach((s, i) => {
                        const px = s.x * cellSize;
                        const py = s.y * cellSize;

                        if (i === 0) {
                            // Head
                            ctx.fillStyle = autoMode ? '#00aa00' : '#0088ff'; // Green for AI, Blue for User
                            ctx.fillRect(px, py, cellSize, cellSize);

                            // Eyes
                            ctx.fillStyle = 'white';
                            let ex1 = 4, ey1 = 4, ex2 = 12, ey2 = 4; // Default Up
                            if (direction.x === 1) { ex1 = 12; ey1 = 4; ex2 = 12; ey2 = 12; } // Right
                            if (direction.x === -1) { ex1 = 4; ey1 = 4; ex2 = 4; ey2 = 12; } // Left
                            if (direction.y === 1) { ex1 = 4; ey1 = 12; ex2 = 12; ey2 = 12; } // Down

                            ctx.beginPath(); ctx.arc(px + ex1, py + ey1, 2, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(px + ex2, py + ey2, 2, 0, Math.PI * 2); ctx.fill();
                        } else {
                            // Body
                            ctx.fillStyle = autoMode ? '#44ff44' : '#44ccff';
                            ctx.fillRect(px, py, cellSize, cellSize);
                            ctx.strokeStyle = '#222';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(px, py, cellSize, cellSize);
                        }
                    });
                };

                resetGame();
                gameInterval = setInterval(() => {
                    update();
                    draw();
                }, 80); // Speed

                // Cleanup function to be called when modal closes
                return () => {
                    clearInterval(gameInterval);
                    document.removeEventListener('keydown', handleKey);
                    window.removeEventListener('resize', resize);
                };
            };

            const cleanupGameRef = { current: null };
            let gameStarted = false;

            // Snake button click handler (toggle)
            snakeBtn.onclick = () => {
                if (!gameStarted) {
                    // Show snake game container, hide default content
                    defaultContent.style.display = "none";
                    snakeContainer.style.display = "block";
                    snakeBtn.textContent = "🐍 游戏中 (点击关闭)";
                    snakeBtn.style.backgroundColor = "#cc4444";

                    // Start the game after a short delay
                    setTimeout(() => {
                        cleanupGameRef.current = startGame();
                        gameStarted = true;
                    }, 100);
                } else {
                    // Close the game, show default content
                    if (cleanupGameRef.current) {
                        cleanupGameRef.current();
                        cleanupGameRef.current = null;
                    }
                    bgMusic.pause();
                    bgMusic.currentTime = 0;
                    endMusic.pause();
                    endMusic.currentTime = 0;

                    snakeContainer.style.display = "none";
                    defaultContent.style.display = "flex";
                    snakeBtn.textContent = "🐍 贪吃蛇";
                    snakeBtn.style.backgroundColor = "#44aa44";
                    snakeBtn.onmouseenter = () => snakeBtn.style.backgroundColor = "#55bb55";
                    snakeBtn.onmouseleave = () => snakeBtn.style.backgroundColor = "#44aa44";
                    gameStarted = false;
                }
            };

            // Clean up on close
            const originalClose = closeBtn.onclick;
            closeBtn.onclick = () => {
                if (cleanupGameRef.current) cleanupGameRef.current();
                bgMusic.pause();
                endMusic.pause();
                originalClose();
            };

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
