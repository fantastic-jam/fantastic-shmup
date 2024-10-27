_G.love = require('love')

require('conf')

local Ship = require('ship')
local SpriteEngine = require('engine/sprite-engine')
local StarField = require('world.starfield')

local spriteEngine
local starField

function love.load()
    starField = StarField:new(4, nil)
    spriteEngine = SpriteEngine:new(0, 0)
    spriteEngine:addActor(Ship:new(spriteEngine, 300, 200))
end

function love.update(dt)
    starField:update(dt)
    spriteEngine:update(dt)
end

function love.draw()
    starField:draw()
    spriteEngine:draw()
end