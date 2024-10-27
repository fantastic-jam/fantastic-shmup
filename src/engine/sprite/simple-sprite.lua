---@class SimpleSprite:Sprite
---@field width number
---@field height number
---@field image love.Image
SimpleSprite = setmetatable({}, { __index = Sprite })
SimpleSprite.__index = SimpleSprite

---@param image love.Image
function SimpleSprite:new(image)
    local obj = {
        width = image:getWidth(),
        height = image:getHeight(),
        image = image
    }
    setmetatable(obj, SimpleSprite)
    return obj
end

---@param x number
---@param y number
function SimpleSprite:draw(x, y)
    love.graphics.draw(self.image, x, y)
end

return SimpleSprite