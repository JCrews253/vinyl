import { GuildManager } from "discord.js";
import { Node as Lavaclient } from "lavaclient";

export class MusicPlayer {
  readonly lavaclient: Lavaclient;
  private queue: Map<string, string[]>;

  constructor(guildManager: GuildManager) {
    this.queue = new Map();
    this.lavaclient = new Lavaclient({
      sendGatewayPayload: (id, payload) => {
        guildManager.cache.get(id)?.shard?.send(payload);
      },
      connection: {
        host: "0.0.0.0",
        password: "youshallnotpass",
        port: 2333,
      },
    });

    this.lavaclient.on("error", (err) => console.log({ err }));
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
