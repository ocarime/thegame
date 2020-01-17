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

// Static method to generate an UUID
Math.uuid = function()
{
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
