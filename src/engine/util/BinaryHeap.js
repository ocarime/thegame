// Code adopted from https://github.com/bgrins/javascript-astar
export default class BinaryHeap
{
  // Constructor
  constructor(scoreFunction)
  {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  // Push an element onto the heap
  push(element)
  {
    // Add the new element to the end of the array
    this.content.push(element);

    // Allow it to sink down
    this._sinkDown(this.content.length - 1);
  }

  // Pop the last element from the heap
  pop()
  {
    // Store the first element so we can return it later
    let result = this.content[0];

    // Get the element at the end of the array
    let end = this.content.pop();

    // If there are any elements left, put the end element at the start, and let it bubble up
    if (this.content.length > 0)
    {
      this.content[0] = end;
      this._bubbleUp(0);
    }

    return result;
  }

  // Remove an element from the heap
  remove(element)
  {
    let i = this.content.indexOf(element);

    // When it is found, the process seen in pop is repeated to fill up the hole
    let end = this.content.pop();
    if (i !== this.content.length - 1)
    {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(element))
        this._sinkDown(i);
      else
        this._bubbleUp(i);
    }
  }

  // Return the size of the heap
  size()
  {
    return this.content.length;
  }

  // Rescore an element
  rescoreElement(element)
  {
    this._sinkDown(this.content.indexOf(element));
  }

  // Sink an element down
  _sinkDown(n)
  {
    // Fetch the element that has to be sunk
    let element = this.content[n];

    // When at 0, an element can not sink any further
    while (n > 0)
    {
      // Compute the parent element's index, and fetch it
      let parentN = ((n + 1) >> 1) - 1;
      let parent = this.content[parentN];

      // Swap the elements if the parent is greater
      if (this.scoreFunction(element) < this.scoreFunction(parent))
      {
        this.content[parentN] = element;
        this.content[n] = parent;

        // Update n to continue at the new position.
        n = parentN;
      }

      // Found a parent that is less, no need to sink any further
      else
        break;
    }
  }

  // BUbble an element up
  _bubbleUp(n)
   {
    // Look up the target element and its score
    let length = this.content.length;
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);

    while (true)
    {
      // Compute the indices of the child elements
      let child2N = (n + 1) << 1;
      let child1N = child2N - 1;

      // This is used to store the new position of the element, if any
      let swap = null;
      let child1Score;

      // If the first child exists (is inside the array)
      if (child1N < length)
      {
        // Look it up and compute its score
        let child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap
        if (child1Score < elemScore)
          swap = child1N;
      }

      // Do the same checks for the other child
      if (child2N < length)
      {
        let child2 = this.content[child2N];
        let child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score))
          swap = child2N;
      }

      // If the element needs to be moved, swap it, and continue
      if (swap !== null)
      {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }

      // Otherwise, we are done
      else
        break;
    }
  }
}
