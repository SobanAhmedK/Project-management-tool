export const mockNotifications = [
  {
    id: 1,
    notification_type: 'task_assigned',
    message: 'You have been assigned to task "Implement user authentication"',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    task: 123,
    project: 456,
    url: '/projects/456/tasks/123'
  },
  {
    id: 2,
    notification_type: 'task_commented',
    message: 'John commented on task "Update dashboard UI"',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    task: 124,
    project: 456,
    url: '/organization/org1/projects/project1'
  },
  {
    id: 3,
    notification_type: 'organization_invite',
    message: 'You have been invited to join "Acme Corp" organization',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    organization: 789,
    url: '/organizations/789/invites'
  },
  {
    id: 4,
    notification_type: 'chat_message',
    message: 'New message from Sarah in "Project Discussion"',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    chat_room: 101,
    url: '/chat/101'
  },
  {
    id: 5,
    notification_type: 'video_call',
    message: 'Incoming video call from Team Standup',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    video_call: 'abc123',
    url: '/video-call/abc123'
  }
];

export const getNotificationTitle = (notification) => {
  switch (notification.notification_type) {
    case 'task_assigned':
      return 'New Task Assigned';
    case 'task_updated':
      return 'Task Updated';
    case 'task_commented':
      return 'New Comment on Task';
    case 'status_changed':
      return 'Task Status Changed';
    case 'organization_invite':
      return 'Organization Invitation';
    case 'chat_message':
      return 'New Message';
    case 'video_call':
      return 'Incoming Video Call';
    default:
      return 'New Notification';
  }
};

export const getNotificationIcon = (notificationType) => {
  switch (notificationType) {
    case 'task_assigned':
      return 'assignment';
    case 'task_updated':
      return 'update';
    case 'task_commented':
      return 'comment';
    case 'status_changed':
      return 'swap_horiz';
    case 'organization_invite':
      return 'group_add';
    case 'chat_message':
      return 'chat';
    case 'video_call':
      return 'videocam';
    default:
      return 'notifications';
  }
};

export const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getNotificationUrl = (notification) => {
  if (notification.url) {
    return notification.url;
  }
  
  switch (notification.notification_type) {
    case 'task_assigned':
    case 'task_updated':
    case 'task_commented':
    case 'status_changed':
      if (notification.task) {
        return `/projects/${notification.project}/tasks/${notification.task}`;
      }
      break;
    case 'organization_invite':
      if (notification.organization) {
        return `/organizations/${notification.organization}/invites`;
      }
      break;
    case 'chat_message':
      if (notification.chat_room) {
        return `/chat/${notification.chat_room}`;
      }
      break;
    case 'video_call':
      if (notification.video_call) {
        return `/video-call/${notification.video_call}`;
      }
      break;
    default:
      return '/notifications';
  }
  
  return '/dashboard';
};