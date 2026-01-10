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
