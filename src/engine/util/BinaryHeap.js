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

    // Allow it to bubble up
    this.bubbleUp(this.content.length - 1);
  }

  // Pop the lowest element from the heap
  pop()
  {
    // Store the first element so we can return it later
    let result = this.content[0];

    // Get the element at the end of the array
    let end = this.content.pop();

    // If there are any elements left, put the end element at the start, and let it sink down
    if (this.content.length > 0)
    {
      this.content[0] = end;
      this.sinkDown(0);
    }

    return result;
  }

  bubbleUp(n)
  {
    // Look up the target element and its score
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);

    // When at 0, an element can not bubble any further
    while (n > 0)
    {
      // Compute the parent element's index, and fetch it
      let parentN = ((n + 1) >> 1) - 1;
      let parent = this.content[parentN];

      // If the parent is less, then no need to bubble any further
      if (elemScore > this.scoreFunction(parent))
        break;

      // Swap the elements if the parent is greater
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  }

  sinkDown(n)
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

      // If the element doesn't need to be moved, we are done
      if (swap === null)
        break;

      // Otherwise swap it, and continue
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }

  // Return the size of the heap
  get size()
  {
    return this.content.length;
  }

  // Return if an element is present in the heap
  has(element)
  {
    return this.content.includes(element);
  }

  // Rescore an element
  rescoreElement(element)
  {
    this.sinkDown(this.content.indexOf(element));
  }
}
