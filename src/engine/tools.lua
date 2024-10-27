-- tools.lua

local Tools = {}

function Tools.mergeTables(t1, t2)
    local newTable = {}
    for k, v in pairs(t1) do
        newTable[k] = v
    end
    for k, v in pairs(t2) do
        newTable[k] = v
    end
    return newTable
end

return Tools