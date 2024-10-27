---@class Sprite
---@field width number
---@field height number
Sprite = {}
Sprite.__index = Sprite

---@param width number
---@param height number
function Sprite:new(width, height)
    local obj = {
        width = width,
        height = height,
    }
    setmetatable(obj, Sprite)
    return obj
end

---@param dt number delta time
function Sprite:update(dt)
end


---@param x number
---@param y number
function Sprite:draw(x, y)
end

return Sprite