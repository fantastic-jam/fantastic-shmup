local Actor = require('engine.actor')
local Weapon = require('engine.weapon.weapon')
local AnimatedSprite = require('engine.sprite.animated-sprite')

---@class Ship:Actor
---@field weapon Weapon
Ship = setmetatable({}, { __index = Actor })
Ship.__index = Ship

---@param spriteEngine SpriteEngine
---@param x number
---@param y number
function Ship:new(spriteEngine, x, y)
    local image = love.graphics.newImage('assets/ship.png')
    local obj = Actor:new(spriteEngine, x, y, 200, AnimatedSprite:new(image, 80, 64, 0.1))
    obj.weapon = Weapon:new(spriteEngine, 0, 0, 1, obj)
    setmetatable(obj, Ship)
    return obj
end

---@param self Ship
---@param dt number
function Ship:update(dt)
    Actor.update(self, dt) -- Call the parent class's update method if needed
    self.weapon:update(dt)

    if love.keyboard.isDown('left') then
        self.x = self.x - self.speed * dt
    elseif love.keyboard.isDown('right') then
        self.x = self.x + self.speed * dt
    end

    if love.keyboard.isDown('up') then
        self.y = self.y - self.speed * dt
    elseif love.keyboard.isDown('down') then
        self.y = self.y + self.speed * dt
    end

    if love.keyboard.isDown('space') then
        self.weapon:fire()
    end
end

function Ship:draw()
    Actor.draw(self)
    self.weapon:draw()
end

return Ship
