_G.lg = love.graphics
_G.lm = love.mouse
_G.lk = love.keyboard

if (love._console ~= nil) then
    _G.lm = {};
    local pos = {0, 0};
    lg.newShader = function(code)
        return code
    end
    lg.setShader = function(shader)
    end
    lm.getPosition = function()
        return pos[1], pos[2]
    end
    lm.setPosition = function(x, y)
        pos = {x, y}
    end
end

local modules = (...) and (...):gsub('%.init$', '') .. "." or ""
return require(modules .. 'urutora')
