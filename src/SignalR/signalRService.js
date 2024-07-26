import * as signalR from "@microsoft/signalr";
import { apiUrls, agentChatResponse } from "../Utils/stringConstant/AgentChatResponse";

let connection = null;
let hubUrl = apiUrls.signalRConnection;

export const startConnection = async () => {
  const currentUserInfo = window.localStorage.getItem(agentChatResponse.yankiUser);
  const parsedUserInfo = JSON.parse(currentUserInfo);

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => parsedUserInfo.token,
      withCredentials: false,
    })
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  await connection.start();
};

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
  }
};

export const onReceiveMessage = (callback) => {
  if (connection) {
    connection.on(agentChatResponse.receiveMessage, (message) => {
      if (callback) {
        callback(message);
      }
    });
  }
};
