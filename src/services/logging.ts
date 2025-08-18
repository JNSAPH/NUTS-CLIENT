import * as Sentry from "@sentry/node";

const Logger = {
  info: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("INFO - " + suffix, "color: #3b82f6;", ...messages),
  debug: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("DEBUG - " + suffix, "color: #7c3aed;", ...messages),
  warning: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("WARNING - " + suffix, "color: #d97706;", ...messages),
  error: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage("ERROR - " + suffix, "color: #ef4444;", ...messages),
  fatal: <T extends unknown[]>(suffix: string, ...messages: T) =>
    logMessage(
      "FATAL - " + suffix,
      "color: #ef4444; background: black",
      ...messages
    ),
} as const;

function logMessage(level: string, css: string, ...messages: unknown[]) {
  try {
    if (
      level.startsWith("DEBUG") &&
      (typeof window === "undefined" || window.location.port !== "1420")
    ) return;

    const { stack } = new Error();
    const stackLines = stack?.split("\n") || [];
    let callerLine = stackLines[3] || "unknown caller";
    callerLine = callerLine.replace(/^\s*at\s*/, "");

    if (["FATAL", "ERROR", "WARNING"].includes(level)) {
      console.error(`%c[${level}] ${callerLine}:\n`, css, ...messages);

      // Sentry.captureMessage(messages.map(m => (typeof m === "string" ? m : JSON.stringify(m))).join(" "), {
      //   level: level.toLowerCase() as "fatal" | "error" | "warning",
      // });
    } else {
      console.log(`%c[${level}] ${callerLine}:\n`, css, ...messages);
    }
  } catch (error) {
    console.error("Logger Error:", error);
    console.log("Logged Message: ", ...messages);
  }
}


export default Logger;
