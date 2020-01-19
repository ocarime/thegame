// Static method to fill an array with predefined values
Array.fill = function(item, n)
{
  let a = [];
  for (let i = 0; i < n; i ++)
    a.push(item);
  return a;
};
