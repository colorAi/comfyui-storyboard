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
            body.textContent = "作者 正在思考。。。完成时间未知。。。";
            Object.assign(body.style, {
                marginTop: "20px",
                flex: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px dashed #444",
                fontSize: "64px",
                fontWeight: "bold",
                textAlign: "center"
            });

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
