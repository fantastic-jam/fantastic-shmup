---@class Star
---@field x number
---@field y number
Star = {}
Star.__index = Star

---@param x number
---@param y number
function Star:new(x, y)
    local obj = setmetatable({ x = x, y = y }, Star)
    return obj;
end

return Star