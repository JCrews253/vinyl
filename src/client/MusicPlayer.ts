import { GuildManager } from "discord.js";
import { Node as Lavaclient } from "lavaclient";

type Track = {
  track: string;
  info: {
    title: string;
  };
};
export class MusicPlayer {
  readonly lavaclient: Lavaclient;
  private queue: Map<string, Track[]>;
  readonly showControls: Map<string, boolean>;

  constructor(guildManager: GuildManager) {
    this.queue = new Map();
    this.showControls = new Map();
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

  setControls(guildID: string, value: boolean) {
    this.showControls.set(guildID, value);
  }

  async play(
    request: string,
    guildID: string,
    voiceChannelID: string
  ): Promise<string> {
    let player = this.lavaclient.players.get(guildID);
    if (!player) {
      player = this.lavaclient.createPlayer(guildID);
      player.on("trackEnd", async () => {
        const nextTrack = this.queue.get(guildID)!.pop();
        if (nextTrack) {
          await player?.play(nextTrack);
        } else {
          await player?.disconnect();
        }
      });
    }

    if (!player.connected) {
      await player.connect(voiceChannelID);
    }

    if (player.playing && voiceChannelID !== player.channelId) {
      return "You must join the bot's current voice channel to request.";
    }

    const result = await this.lavaclient.rest.loadTracks(
      /^https?:\/\//.test(request) ? request : `ytsearch:${request}`
    );

    if (this.queue.has(guildID)) {
      const currentQueue = this.queue.get(guildID)!;
      currentQueue.push(result.tracks[0]);
    } else {
      this.queue.set(guildID, [result.tracks[0]]);
    }

    if (!player.playing) {
      const track = this.queue.get(guildID)!.pop()!;
      await player.play(track);
      return `Now playing ${track.info.title}.`;
    }

    return `Added ${result.tracks[0].info.title} to the queue.`;
  }

  getQueue(guildID: string): string[] {
    const queue = this.queue.get(guildID)?.map((q) => q.info.title);
    if (!queue || queue.length === 0) {
      return ["Queue is empty"];
    } else {
      return queue;
    }
  }
}
