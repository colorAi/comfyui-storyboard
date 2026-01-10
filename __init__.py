import os
import json
import sqlite3
import aiohttp
from server import PromptServer
from aiohttp import web
import folder_paths
import comfy.sd
import comfy.samplers
import comfy.sample
import torch
import numpy as np
from PIL import Image

# Database setup
DB_FILE = os.path.join(os.path.dirname(__file__), "storyboard.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS storyboard_data
                 (id TEXT PRIMARY KEY, data TEXT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

# API Routes
@PromptServer.instance.routes.post("/storyboard/save")
async def save_storyboard_data(request):
    try:
        data = await request.json()
        # We use a fixed ID 'default' for now as per current requirements, 
        # but the schema supports multiple stories if needed in future.
        story_id = 'default' 
        json_data = json.dumps(data)
        
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO storyboard_data (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (story_id, json_data))
        conn.commit()
        conn.close()
        
        return web.json_response({"status": "success"})
    except Exception as e:
        print(f"Error saving storyboard data: {e}")
        return web.json_response({"status": "error", "message": str(e)}, status=500)

@PromptServer.instance.routes.get("/storyboard/load")
async def load_storyboard_data(request):
    try:
        story_id = 'default'
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT data FROM storyboard_data WHERE id=?", (story_id,))
        result = c.fetchone()
        conn.close()
        
        if result:
            return web.json_response(json.loads(result[0]))
        else:
            return web.json_response(None) # Return null if no data found
    except Exception as e:
        print(f"Error loading storyboard data: {e}")
        return web.json_response({"status": "error", "message": str(e)}, status=500)


class StoryboardImageGen:
    def __init__(self):
        pass
    
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "model": ("MODEL",),
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff}),
                "steps": ("INT", {"default": 20, "min": 1, "max": 10000}),
                "cfg": ("FLOAT", {"default": 8.0, "min": 0.0, "max": 100.0}),
                "sampler_name": (comfy.samplers.SAMPLER_NAMES, ),
                "scheduler": (comfy.samplers.SCHEDULER_NAMES, ),
                "positive": ("CONDITIONING", ),
                "negative": ("CONDITIONING", ),
                "latent_image": ("LATENT", ),
                "denoise": ("FLOAT", {"default": 1.0, "min": 0.0, "max": 1.0, "step": 0.01}),
            }
        }

    RETURN_TYPES = ("LATENT",)
    FUNCTION = "generate"
    CATEGORY = "Storyboard"

    def generate(self, model, seed, steps, cfg, sampler_name, scheduler, positive, negative, latent_image, denoise=1.0):
        return comfy.sample.sample(model, seed, steps, cfg, sampler_name, scheduler, positive, negative, latent_image, denoise=denoise)

NODE_CLASS_MAPPINGS = {
    "StoryboardImageGen": StoryboardImageGen
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "StoryboardImageGen": "Storyboard Image Gen"
}

WEB_DIRECTORY = "./web"

# Presets setup
PRESETS_FILE = os.path.join(os.path.dirname(__file__), "presets.json")

def init_presets():
    if not os.path.exists(PRESETS_FILE):
        default_preset = {
            "name": "Qwen-Edit-2511",
            "azimuth": {
                "0": "front view",
                "45": "front-right view",
                "90": "right side view",
                "135": "back-right view",
                "180": "back view",
                "225": "back-left view",
                "270": "left side view",
                "315": "front-left view"
            },
            "elevation": {
                "-30": "low angle",
                "0": "eye level",
                "30": "high angle",
                "60": "bird's eye view",
                "90": "top-down view"
            },
            "zoom": {
                "0": "wide shot",
                "2": "medium-wide shot", 
                "4": "medium shot",
                "6": "medium close-up",
                "8": "close-up"
            }
        }
        data = {"presets": {"default": default_preset}}
        with open(PRESETS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

init_presets()

# API Routes for Presets
@PromptServer.instance.routes.get("/storyboard/presets/list")
async def list_presets(request):
    try:
        if os.path.exists(PRESETS_FILE):
            with open(PRESETS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return web.json_response(data)
        return web.json_response({"presets": {}})
    except Exception as e:
        print(f"Error listing presets: {e}")
        return web.json_response({"status": "error", "message": str(e)}, status=500)

@PromptServer.instance.routes.post("/storyboard/presets/save")
async def save_preset(request):
    try:
        req_data = await request.json()
        preset_id = req_data.get("id")
        preset_data = req_data.get("data")
        
        if not preset_id or not preset_data:
            return web.json_response({"status": "error", "message": "Missing id or data"}, status=400)

        data = {"presets": {}}
        if os.path.exists(PRESETS_FILE):
            with open(PRESETS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
        
        data["presets"][preset_id] = preset_data
        
        with open(PRESETS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        return web.json_response({"status": "success"})
    except Exception as e:
        print(f"Error saving preset: {e}")
        return web.json_response({"status": "error", "message": str(e)}, status=500)

@PromptServer.instance.routes.post("/storyboard/presets/delete")
async def delete_preset(request):
    try:
        req_data = await request.json()
        preset_id = req_data.get("id")
        
        if not preset_id:
             return web.json_response({"status": "error", "message": "Missing id"}, status=400)
             
        if os.path.exists(PRESETS_FILE):
            with open(PRESETS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if preset_id in data["presets"]:
                del data["presets"][preset_id]
                
                with open(PRESETS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4, ensure_ascii=False)
                return web.json_response({"status": "success"})
            else:
                return web.json_response({"status": "error", "message": "Preset not found"}, status=404)
        return web.json_response({"status": "error", "message": "Presets file not found"}, status=404)

    except Exception as e:
        print(f"Error deleting preset: {e}")
        return web.json_response({"status": "error", "message": str(e)}, status=500)

