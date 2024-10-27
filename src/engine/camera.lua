
---@class Camera
---@field x number
---@field y number
---@field scale number
---@field speed number
Camera = {}
Camera.__index = Camera

---@param x number|nil
---@param y number|nil
---@param scale number|nil
---@param speed number|nil
function Camera:new(x, y, scale, speed)
    local obj = setmetatable({
        x = x or 0,
        y = y or 0,
        scale = scale or 1,
        speed = speed or 200,
    }, Camera)
    return obj
end

function Camera:set()
    love.graphics.push()
    love.graphics.scale(self.scale)
    love.graphics.translate(-self.x, -self.y)
end

function Camera:unset()
    love.graphics.pop()
end

return Camera