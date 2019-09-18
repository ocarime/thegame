// Method to check if an object has the method methodName
Object.prototype.can = function(methodName)
{
  return (typeof this[methodName]) === "function";
};

// Static method to fill an array with predefined values
Array.fill = function(item, n)
{
  let a = [];
  for (let i = 0; i < n; i ++)
    a.push(item);
  return a;
};
