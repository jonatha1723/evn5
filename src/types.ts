import { Timestamp } from 'firebase/firestore';

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  uniqueCode: string;
  publicKey: JsonWebKey;
  contacts: string[];
  role?: 'admin' | 'user';
  lastActive?: any;
  isBanned?: boolean;
  bannedUntil?: number | null;
  banReason?: string;
  avatarUrl?: string;
  networkInfo?: {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp?: string;
    timezone?: string;
    lastSeen?: any;
  };
  settings?: {
    friendRequestsMode?: 'manual' | 'auto';
    autoAcceptGroups?: boolean;
    blockedInviteUids?: string[];
    customNames?: Record<string, string>;
  };
}

export interface Group {
  id: string;
  name: string;
  adminUid: string;
  members: string[];
  memberJoinedAt?: Record<string, number>;
  banned?: string[];
  mutedUntil?: Record<string, number>;
  imageIndex: number;
  customImageUrl?: string;
  createdAt: any;
  lastMessage?: string;
  lastMessageTime?: any;
  isBanned?: boolean;
  bannedUntil?: number | null;
  banReason?: string;
}

export interface GroupRequest {
  id: string;
  type: 'friend' | 'group';
  fromUid: string;
  fromName: string;
  fromCode?: string;
  toUid: string;
  targetCode?: string;
  groupId?: string;
  groupName?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: any;
  updatedAt?: any;
}

export interface Message {
  id: string;
  senderId: string;
  senderUid?: string;
  senderCode?: string;
  receiverCode?: string | null;
  receiverId?: string; // Para mensagens privadas
  groupId?: string; // Para mensagens de grupo
  chatId: string;
  encryptedContent: string;
  encryptedKeyForSender?: string;
  encryptedKeyForReceiver?: string;
  iv: string;
  timestamp?: any;
  clientTimestamp: number;
  replyToId?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  mimeType?: string;
  isViewOnce?: boolean;
  viewedAt?: Timestamp;
  isUploading?: boolean;
  isPending?: boolean;
  localUrl?: string;
  senderName?: string; // Para exibição em grupos
}

export interface DecryptedMessage extends Message {
  text: string;
}

export interface MessagePosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface InviteToken {
  id?: string;
  creatorUid: string;
  creatorName: string;
  creatorCode: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
  usedBy?: string;
}

export interface GroupInviteToken {
  id?: string;
  groupId: string;
  groupName: string;
  creatorUid: string;
  createdAt: number;
  expiresAt: number;
  revoked: boolean;
}
