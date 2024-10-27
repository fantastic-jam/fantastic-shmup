local Actor = require('engine.actor')

---@class Projectile:Actor
---@field speed number
Projectile = setmetatable({}, { __index = Actor })
Projectile.__index = Projectile

---@param spriteEngine SpriteEngine
---@param x number
---@param y number
function Projectile:new(spriteEngine, x, y)
    local obj = Actor:new(spriteEngine, x, y, 0, nil)

    setmetatable(obj, Projectile)
    return obj
end

function Projectile:update(dt)
    self.x = self.x + 20 * dt
    if self.x > love.graphics.getWidth() then
        self.spriteEngine:removeActor(self)
    end
end

function Projectile:draw()
    love.graphics.setColor(255, 0, 0)
    love.graphics.rectangle("fill", self.x, self.y, 1.5, 1.5)
    love.graphics.setColor(255, 255, 255)
end

return Projectile
