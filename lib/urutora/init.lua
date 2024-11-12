_G.lg = love.graphics
_G.lm = love.mouse

if (love._console ~= nil) then
    _G.lm = {};
    lg.newShader = function(code)
        return code
    end
    lg.setShader = function(shader)
    end
    lm.getPosition = function()
        return 0, 0
    end
end

local modules = (...) and (...):gsub('%.init$', '') .. "." or ""
return require(modules .. 'urutora')
