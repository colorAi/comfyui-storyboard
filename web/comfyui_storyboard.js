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

            const title = document.createElement("h2");
            title.textContent = "Storyboard Image Generation";
            
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

            const textDiv = document.createElement("div");
            textDiv.innerHTML = "正在计划制作一个Comfyui的分镜工具。<br>此时作者正在思考。。。完成时间未知。。。";
            Object.assign(textDiv.style, {
                fontSize: "32px",
                fontWeight: "bold",
                color: "rgba(255, 255, 255, 0.3)", // Dimmed to be background-like
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

            body.appendChild(textDiv);
            body.appendChild(canvas);
            body.appendChild(scoreDiv);
            body.appendChild(gameOverDiv);
            body.appendChild(watermark);

            // Snake Game Logic
            let gameInterval;
            
            const startGame = () => {
                const ctx = canvas.getContext('2d');
                const cellSize = 20;
                let width, height;
                let cols, rows;
                let obstacle = {x:0, y:0, w:0, h:0};

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
                let direction = {x: 1, y: 0}; // Velocity
                let nextDirection = {x: 1, y: 0};
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
                            resetGame();
                        } else {
                            updateText();
                        }
                    }, 1000);
                };

                const resetGame = () => {
                    // Start at top-left to avoid center text
                    snake = [
                        {x: 5, y: 5},
                        {x: 4, y: 5},
                        {x: 3, y: 5}
                    ];
                    direction = {x: 1, y: 0};
                    nextDirection = {x: 1, y: 0};
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
                            food = {x: fx, y: fy};
                            valid = true;
                        }
                        attempts++;
                    }
                    
                    // Fallback: scan for empty spot if random fails
                    if (!valid) {
                        for (let y = 0; y < rows; y++) {
                            for (let x = 0; x < cols; x++) {
                                if (!snake.some(s => s.x === x && s.y === y) && !isObstacle(x, y)) {
                                    food = {x, y};
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
                            {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}
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
                                        queue.push({x: nx, y: ny});
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
                                return {x: curr.x - head.x, y: curr.y - head.y};
                            }
                            curr = parent;
                        }
                    }

                    // Fallback: Greedy if no path found (e.g. trapped)
                    const moves = [
                        {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}
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
                        
                        if (key === 'ArrowUp' && direction.y === 0) nextDirection = {x: 0, y: -1};
                        if (key === 'ArrowDown' && direction.y === 0) nextDirection = {x: 0, y: 1};
                        if (key === 'ArrowLeft' && direction.x === 0) nextDirection = {x: -1, y: 0};
                        if (key === 'ArrowRight' && direction.x === 0) nextDirection = {x: 1, y: 0};
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
                    const newHead = {x: head.x + direction.x, y: head.y + direction.y};

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
                        ctx.arc(px + cellSize/2, py + cellSize/2, cellSize/2 - 2, 0, Math.PI * 2);
                        ctx.fill();
                        // Shine
                        ctx.fillStyle = 'white';
                        ctx.beginPath();
                        ctx.arc(px + cellSize/2 + 3, py + cellSize/2 - 3, 2, 0, Math.PI * 2);
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
                            
                            ctx.beginPath(); ctx.arc(px + ex1, py + ey1, 2, 0, Math.PI*2); ctx.fill();
                            ctx.beginPath(); ctx.arc(px + ex2, py + ey2, 2, 0, Math.PI*2); ctx.fill();
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

            // Start animation after a short delay to ensure layout is done and DOM is ready
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    cleanupGameRef.current = startGame();
                }
            }, 100);

            // Clean up on close
            const originalClose = closeBtn.onclick;
            closeBtn.onclick = () => {
                if (cleanupGameRef.current) cleanupGameRef.current();
                originalClose();
            };

            content.appendChild(closeBtn);
            content.appendChild(title);
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
