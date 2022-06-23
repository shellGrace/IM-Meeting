import AgoraRTC from "agora-rtc-sdk-ng";
import { EventEmitter } from "events";

class AgoraRTCManager extends EventEmitter {
  static getInstance() {
    if (AgoraRTCManager.instance) {
      return AgoraRTCManager.instance;
    }
    const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });
    AgoraRTCManager.instance = new AgoraRTCManager(client);
    return AgoraRTCManager.instance;
  }

  constructor(client) {
    super();
    this.localVideoTrack = null;
    this.localAudioTrack = null;
    this.joined = false;
    this.published = false;
    this.remoteUsers = [];
    window.client = this.client = client;
  }

  async createLocalTracks(audioConfig, videoConfig) {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
      audioConfig,
      videoConfig
    );
    this.localVideoTrack = cameraTrack;
    this.localAudioTrack = microphoneTrack;
  }

  async join(appid, channel, token = null, uid = null) {
    await this.createLocalTracks();
    await this.client.join(appid, channel, token, uid);
    this.listen();
    this.remoteUsers = this.client.remoteUsers || [];
    this.joined = true;
  }

  async subscribe(user, mediaType) {
    return await client.subscribe(user, mediaType);
  }

  async unsubscribe(user, mediaType) {
    return await client.unsubscribe(user, mediaType);
  }

  listen() {
    this.client.on("user-published", (user, mediaType) => {
      console.log("rtc user-published ", user, mediaType);
      this.remoteUsers = Array.from(this.client.remoteUsers);
      this.emit("user-published", user, mediaType);
    });
    this.client.on("user-unpublished", (user) => {
      console.log("rtc user-unpublished ", user);
      this.remoteUsers = Array.from(this.client.remoteUsers);
      this.emit("user-unpublished", user);
    });
    this.client.on("user-joined", (user) => {
      console.log("rtc user-joined ", user);
      this.remoteUsers = Array.from(this.client.remoteUsers);
      this.emit("user-joined", user);
    });
    this.client.on("user-left", (user) => {
      console.log("rtc user-left ", user);
      this.remoteUsers = Array.from(this.client.remoteUsers);
      this.emit("user-left", user);
    });
  }

  async publish() {
    await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
    this.published = true;
  }

  async unpublish() {
    await this.client.unpublish([this.localAudioTrack, this.localVideoTrack]);
    this.published = false;
  }

  async leave() {
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
    }
    if (this.localVideoTrack) {
      this.localVideoTrack.stop();
      this.localVideoTrack.close();
    }
    this.client?.removeAllListeners();
    await this.client?.leave();
    this.remoteUsers = [];
    this.joined = false;
    this.published = false;
  }
}

export const agoraRTCManager = AgoraRTCManager.getInstance();

window.agoraRTCManager = agoraRTCManager;
