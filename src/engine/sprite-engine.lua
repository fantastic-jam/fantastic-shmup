local Camera = require('engine/camera')

---@class SpriteEngine
---@field camera Camera
---@field actors Actor[]
SpriteEngine = {}
SpriteEngine.__index = SpriteEngine

function SpriteEngine:new(x, y)
    local obj = {
        x = x,
        y = y,
        actors = {},
        camera = Camera:new(0, 0, 1, 200)
    }
    setmetatable(obj, SpriteEngine)
    return obj
end

-- Add Actor method
function SpriteEngine:addActor(actor)
    table.insert(self.actors, actor)
end

-- Remove Actor method
function SpriteEngine:removeActor(actor)
    for i, a in ipairs(self.actors) do
        if a == actor then
            table.remove(self.actors, i)
            break
        end
    end
end

-- Update method
function SpriteEngine:update(dt)
    if love.keyboard.isDown('kp+') then
        self.camera.scale = self.camera.scale - self.camera.speed * dt * 0.001
    elseif love.keyboard.isDown('kp-') then
        self.camera.scale = self.camera.scale + self.camera.speed * dt * 0.001
    end

    for _, actor in ipairs(self.actors) do
        actor:update(dt)
    end
end

-- Draw method
function SpriteEngine:draw()
    self.camera:set()
    for _, actor in ipairs(self.actors) do
        actor:draw()
    end
    self.camera:unset()
end

return SpriteEngine
