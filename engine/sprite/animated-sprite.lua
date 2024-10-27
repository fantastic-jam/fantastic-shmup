---@class AnimatedSprite:Sprite
---@field width number
---@field height number
---@field animationSpeed number seconds per frame
---@field spritesheet love.Texture
---@field animations love.Quad[][]
---@field currentAnimation number
---@field currentFrame number
---@field currentAnimationSpeed number
---@field elapsedTime number
AnimatedSprite = setmetatable({}, { __index = Sprite })
AnimatedSprite.__index = AnimatedSprite

---Load animations from spritesheet
---@param spritesheet love.Texture
---@param frameWidth number
---@param frameHeight number
---@return love.Quad[][]
local function loadAnimations(spritesheet, frameWidth, frameHeight)
    local result = {};
    local numAnimations = spritesheet:getHeight() / frameHeight
    local numFrames = spritesheet:getWidth() / frameWidth;
    for i = 0, numAnimations - 1 do
        local animation = {};
        for j = 0, numFrames - 1 do
            table.insert(animation,
                love.graphics.newQuad(j * frameWidth, i * frameHeight, frameWidth, frameHeight,
                    spritesheet:getDimensions()))
        end
        table.insert(result, animation)
    end
    return result
end

---@param spritesheet love.Image
function AnimatedSprite:new(spritesheet, frameWidth, frameHeight, animationSpeed)
    local obj = {
        spritesheet = spritesheet,
        width = spritesheet:getWidth(),
        height = spritesheet:getHeight(),
        animationSpeed = animationSpeed,
        currentAnimationSpeed = animationSpeed,
        currentAnimation = 1,
        currentFrame = 1,
        animations = loadAnimations(spritesheet, frameWidth, frameHeight),
        elapsedTime = 0
    }
    setmetatable(obj, AnimatedSprite)
    return obj
end

---@param dt number delta time
function AnimatedSprite:update(dt)
    self.elapsedTime = self.elapsedTime + dt
    if self.elapsedTime > self.animationSpeed then
        self.elapsedTime = self.elapsedTime - self.animationSpeed
        self.currentFrame = self.currentFrame % #self.animations[self.currentAnimation] + 1
    end
end

---@param x number
---@param y number
function AnimatedSprite:draw(x, y)
    love.graphics.draw(self.spritesheet, self.animations[self.currentAnimation][self.currentFrame], x, y)
end

return AnimatedSprite
