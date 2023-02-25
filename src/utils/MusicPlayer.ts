export class MusicPlayer {
  private queue: Map<string, string[]>;

  constructor() {
    this.queue = new Map();
  }

  async startManager(userID: string) {}

  play(guildID: string, request: string) {
    if (this.queue.has(guildID)) {
      const currentQueue = this.queue.get(guildID)!;
      currentQueue.push(request);
    } else {
      this.queue.set(guildID, [request]);
    }
  }

  getQueue(guildID: string): string[] {
    return this.queue.get(guildID) ?? ["Queue is empty"];
  }
}
