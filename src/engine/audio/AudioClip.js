// Class thet defines an audio clip
export default class AudioClip
{
  // Constructor
  constructor(context)
  {
    // Reference to the audio context
    this.context = context;
    this.webAudioContext = this.context.webAudioContext;

    // State of the audio AudioClip
    this.state = 'uninitialized';
  }

  // Initialize the clip with a buffer
  async init(buffer)
  {
    // Create a buffer
    this.buffer = await this.webAudioContext.decodeAudioData(buffer);

    // Create a buffer source node
    this.sourceNode = this.webAudioContext.createBufferSource();
    this.sourceNode.buffer = this.buffer;

    // Set the state to ready
    this.state = 'ready';

    return this;
  }

  // Return the active source node
  get activeSourceNode()
  {
    return this.sourceNode;
  }
}
