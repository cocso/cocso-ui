const IS_NO_COLOR =
  process.env.NO_COLOR === "1" || process.env.NO_COLOR === "true";

const ANSI = {
  blue: "\u001B[34m",
  green: "\u001B[32m",
  red: "\u001B[31m",
  reset: "\u001B[0m",
  yellow: "\u001B[33m",
};

export const LogStatus = {
  INFO: "info",
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
} as const;

type LogStatus = (typeof LogStatus)[keyof typeof LogStatus];

interface LogPayload {
  details?: Record<string, unknown>;
  durationMs?: number;
  event: string;
  status: LogStatus;
  tool?: string;
}

const colorByStatus: Record<LogStatus, string> = {
  [LogStatus.INFO]: ANSI.blue,
  [LogStatus.ERROR]: ANSI.red,
  [LogStatus.SUCCESS]: ANSI.green,
  [LogStatus.WARNING]: ANSI.yellow,
};

export function log(payload: LogPayload): void {
  const message = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...payload,
  });

  if (IS_NO_COLOR) {
    console.error(message);
    return;
  }

  const color = colorByStatus[payload.status];
  console.error(`${color}${message}${ANSI.reset}`);
}
