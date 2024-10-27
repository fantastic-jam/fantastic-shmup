local Actor = require('engine.actor')
local Projectile = require('engine.weapon.projectile')

---@class Weapon:Actor
---@field lastFired number
---@field cooldown number
---@field speed number
Weapon = setmetatable({}, { __index = Actor })
Weapon.__index = Weapon

---@param spriteEngine SpriteEngine
---@param x number
---@param y number
---@param cooldown number
---@param parent Actor
function Weapon:new(spriteEngine, x, y, cooldown, parent)
    local obj = Actor:new(spriteEngine, x, y, 0, nil, parent)

    obj.cooldown = cooldown or 1;
    setmetatable(obj, Weapon)
    return obj
end

function Weapon:fire()
    if self.lastFired == nil or love.timer.getTime() > self.lastFired + self.cooldown then
        self.lastFired = love.timer.getTime()
        self.spriteEngine:addActor(Projectile:new(self.spriteEngine, self:globalX(), self:globalY()))
    end
end

function Weapon:update(dt)
end

function Weapon:draw()
end

return Weapon
