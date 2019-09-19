// Class that can parse command strings
export default class CommandParser
{
  // Constructor
  constructor()
  {
    this.commands = new Map();
  }

  // Register a command
  registerCommand(name, fn)
  {
    this.commands.set(name, fn);
  }

  // Unregister a command
  unregisterCommand(name)
  {
    this.commands.delete(name);
  }

  // Parse a string into a command
  parse(string)
  {
    // Check if the string is empty
    if (string.trim() === '')
      return undefined;

    // Split the string
    let [name, ...args] = (string.match(/[^\s"]+|"([^"]*)"/gi) || []).map(i => i.replace(/^"(.+(?="$))"$/, '$1'));

    // Check if the command exists
    if (this.commands.has(name))
    {
      // Execute the command
      let fn = this.commands.get(name);
      fn(...args);
    }
    else
    {
      // No command found
      console.warn(`Found unknown command '${string}'`);
    }
  }
}
