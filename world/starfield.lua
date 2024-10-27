local Star = require('world.star')

---@class StarField
---@field layers number
---@field starCount number
---@field stars Star[][]
StarField = {}
StarField.__index = StarField

---@param layers number|nil
---@param starCount number|nil
function StarField:new(layers, starCount)
    local obj = setmetatable({
        layers = layers or 4,
        starCount = starCount or 600,
        stars = {
        },
    }, StarField)

    for i = 1, obj.layers do
        table.insert(obj.stars, {})
    end
    for i = 1, obj.starCount do
        local star = Star:new(love.math.random(0, love.graphics.getWidth()),
            love.math.random(0, love.graphics.getHeight()))
        local layer = love.math.random(1, obj.layers)
        table.insert(obj.stars[layer], star)
    end

    return obj
end

function StarField:update(dt)
    for i = 1, #self.stars do
        for j = 1, #self.stars[i] do
            local star = self.stars[i][j]
            star.x = star.x - 20 * i * dt
            if star.x < 0 then
                star.x = love.graphics.getWidth()
                star.y = love.math.random(0, love.graphics.getHeight())
            end
        end
    end
end

function StarField:draw()
    local brightness = 255
    for i = 1, #self.stars do
        for j = 1, #self.stars[i] do
            love.graphics.setColor(brightness, brightness, brightness)
            love.graphics.rectangle("fill", self.stars[i][j].x, self.stars[i][j].y, j * 0.01, j * 0.01)
        end
        brightness = brightness - 70
    end
    love.graphics.setColor(255, 255, 255)
end

return StarField
