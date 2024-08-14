import * as signalR from "@microsoft/signalr";
import {
  apiUrls,
  agentChatResponse,
} from "../Utils/stringConstant/AgentChatResponse";

let connection = null;
let connectionPromise = null;
let hubUrl = apiUrls.signalRConnection;

export const startConnection = () => {
  if(connectionPromise) {
    return;
  }
  const currentUserInfo = window.localStorage.getItem(
    agentChatResponse.yankiUser
  );
  const parsedUserInfo = JSON.parse(currentUserInfo);

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => parsedUserInfo.token,
      withCredentials: false,
    })
    .configureLogging(signalR.LogLevel.Warning)
    .withAutomaticReconnect()
    .build();

    connectionPromise = connection.start();
};

export const stopConnection = () => {
  if (connection) {
    connection.stop();
    connection = null;
    connectionPromise = null
  }
};

export const getConnectionPromise = () => {
  return connection;
};