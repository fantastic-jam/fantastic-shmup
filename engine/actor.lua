---@class Actor
---@field spriteEngine SpriteEngine
---@field x number
---@field y number
---@field speed number
---@field sprite Sprite
---@field parent Actor|nil
Actor = {}
Actor.__index = Actor

---@param spriteEngine SpriteEngine
---@param x number
---@param y number
---@param speed number
---@param sprite Sprite|nil
---@param parent Actor|nil
function Actor:new(spriteEngine, x, y, speed, sprite, parent)
    local obj = {
        spriteEngine = spriteEngine,
        x = x,
        y = y,
        speed = speed or 200,
        sprite = sprite,
        parent = parent
    }
    setmetatable(obj, Actor)
    return obj
end

---@param self Actor
---@param dt number
function Actor:update(dt)
    self.sprite:update(dt)
end

---@return number
function Actor:globalX()
    return self.x + (self.parent and self.parent.x or 0)
end
---@return number
function Actor:globalY()
    return self.y  + (self.parent and self.parent.y or 0)
end


-- Draw method
function Actor:draw()
    self.sprite:draw(self:globalX(), self:globalY())
end


-- function Actor:translate()
--     love.graphics.push()
--     love.graphics.translate(self.x, self.y)
-- end

-- function Actor:endTranslate()
--     love.graphics.pop()
-- end

return Actor
