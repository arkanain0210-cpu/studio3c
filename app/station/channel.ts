// 스테이션(조작 화면)과 고객용 QR 화면이 같은 브라우저 안에서 주고받는 메시지
export const CHANNEL_NAME = 'studio3c-station';

export interface DisplayState {
  sessionId: string;
  url: string;
  customerNo: number;
  total: number;
  uploaded: number;
}

export type ChannelMessage = { type: 'state'; state: DisplayState | null } | { type: 'hello' };
