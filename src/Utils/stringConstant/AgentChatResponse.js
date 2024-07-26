export const agentChatResponse = {
    emailSentMessage: "Your personal assistance request has been received and is currently being reviewed by our YankiAl agents. Depending on your subscription, you can expect to receive a response via the email address or SMS number registered with us. Press the start button to initiate a live chat with an assistant.",
    agentAvailabe: " If an agent is available, the chat will begin in a few seconds.",
    chatYankiAgent: "Chat With Yanki Agent",
    chatYankiAgentTitle: "Please describe what you need help with. (Note that the ability of Yanki to resolve your query may vary based on your current subscription.",
    yankiUser: "yankiUser",
    numeric: "numeric",
    chatAgentContainer: "chat-agent-container",
    chatAgentHeading: "chat-agent-heading",
    chatAgentTitle: "chat-agent-title",
    userChatContainer: "user-chat-container",
    smallUserChatContainer: "small-user-chat-container",
    messageContainer: "message-container",
    messageOutgoingContainer: "message-outgoing-container",
    messageIncomingContainer: "message-incoming-container",
    agentAvtar: "agentAvtar",
    agentLogo: "AgentLogo",
    message: "message",
    incoming: "incoming",
    outgoing: "outgoing",
    userMessageTime: "user-message-time",
    incomingTime: "incoming-time",
    outgoingTime: "outgoing-time",
    userAvtar: "userAvtar",
    chatWithAgentContainer: "chat-with-agent-container",
    chatWithAgent: "chat-with-agent",
    smallChatWithAgent: "small-chat-with-agent",
    searchQuery: "searchQuery",
    sendButton: "send-button",
    chatwithAgentPlaceholder: "Chat with Agent",
    emailSentMessageClass: "email-sent-message",
    startChatContainer: "start-chat-container",
    startChat: "start-chat",
    startingChat: "Starting Chat",
    submit: "submit",
    smallScreen: "sm",
    mediumScreen: "md",
    eventRequestContainer: "event-request-container",
    zeroWidth: "0",
    drawerOpenWidth: "270px",
    enterpriseFormBox: "enterpriseFormBox",
    enterpriseFormBoxHide: "enterpriseFormBoxHide",
    enterpriseFormBoxShow: "enterpriseFormBoxShow",
    drawerOpenCalcWidth: "calc(100% - 270px)",
    hundredWidth: "100%",
    noUserMessage: "no-user-message",
    chatContainer: "chat-container",
    userListHide: "user-list-hide",
    userListContainer: "user-list-container",
    userInfoContainer: "user-info-container",
    userImage: "user-image",
    userInfo: "user-info",
    userDetails: "user-details",
    userEmail: "user-email",
    lastMessageTime: "last-message-time",
    lastMessage: "last-message",
    messageListContainer: "messageList-container",
    userListHideClass: "userListHide",
    userListShow: "userListShow",
    chatHeader: "chat-header",  
    chatHeaderBackArrow: "chat-header-back-arrow",
    backArrow: "backarrow",
    chatHeaderUserImage: "chat-header-user-image",
    userListHideImage: "user-list-hide-image",
    userListShowImage: "user-list-show-image",
    chatHeaderInfoHide: "chat-header-info-hide",
    chatHeaderInfo: "chat-header-info",
    chatHeaderInfoEmail: "chat-header-info-email",
    chatHeaderInfoStatus: "chat-header-info-status",
    messageContentContainer: "message-content-container",
    messageContent: "message-content",
    messageItem: "message-item",
    messageOutgoing: "message-outgoing",
    messageIncoming: "message-incoming",
    messageTime: "message-time",
    timestampOutgoing: "timestamp-outgoing",
    timestampIncoming: "timestamp-incoming",
    chatBox: "chat-box",
    chatInputContainer: "chat-input-container",
    typeMessage: "Type a message",
    start: "start",
    smileyIcon: "smiley-icon",
    chatInputField: "chat-input-field",
    inputFieldHide: "input-field-hide",
    inputFieldShow: "input-field-show",
    userChatSession: "user-chat-session",
    activeChatSession: "activeChatSession",
    deactivateChatSession: "deactivateChatSession",
    receiveMessage: "ReceiveMessage",
    sendButtonMessage: "send-button-message",
    enterprise: "Enterprise",
    customDisableLight: "Custom-disable-light",
    chatHeaderHideUserList: "chat-header-hide-user-list",
}

export const apiUrls = {
    getUserMessage: `${process.env.REACT_APP_API_HOST}/api/agent-chat/get-user-message`,
    signalRConnection: `${process.env.REACT_APP_API_HOST}/chat`,
    userChatList: `${process.env.REACT_APP_API_HOST}/api/agent-chat/get-user-list`,
    getAdminMessage: (id) => `${process.env.REACT_APP_API_HOST}/api/agent-chat/get-admin-message?id=${id}`,
    sendMessage: `${process.env.REACT_APP_API_HOST}/api/agent-chat/send-message`,
    chatNavigateUrl: '/admin/chat',
    chatNavigateUrlById: (id) => `/admin/chat/${id}`,
    getUserListById: (id) => `${process.env.REACT_APP_API_HOST}/api/agent-chat/get-user-list-id?Id=${id}`
}